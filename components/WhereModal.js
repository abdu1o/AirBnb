'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import styles from '../styles/Modals.module.css';
import { feature } from 'topojson-client';
import { geoMercator, geoPath } from 'd3-geo';

/**
 * WhereModal — лёгкий SVG-рендерер карт, без react-simple-maps.
 * Props:
 *  - isOpen, onClose
 *  - initialWhere: { label, lat, lon } | null
 *  - onSave(selection)
 */
export default function WhereModal({ isOpen, onClose, initialWhere, onSave }) {
  const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
  const svgRef = useRef(null);
  const [topo, setTopo] = useState(null);
  const [geojson, setGeojson] = useState(null);
  const [selected, setSelected] = useState(initialWhere || null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // svg layout
  const width = 980;
  const height = 420;
  const margin = 10;

  useEffect(() => {
    if (!isOpen) return;
    // load topojson once
    let cancelled = false;
    fetch(GEO_URL)
      .then(r => r.json())
      .then(t => {
        if (cancelled) return;
        setTopo(t);
        // countries object name in this topojson is 'countries'
        const fc = feature(t, t.objects.countries || t.objects['countries-110m'] || t.objects['land']);
        setGeojson(fc);
      })
      .catch(() => {
        if (!cancelled) alert('Ошибка загрузки карты');
      });
    return () => cancelled = true;
  }, [isOpen]);

  useEffect(() => {
    // sync initial selection when modal opens
    if (isOpen && initialWhere) setSelected(initialWhere);
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen, initialWhere]);

  // projection & path generator (recreated when geojson available)
  const { projection, pathGen } = useMemo(() => {
    // center/scale heuristics — можно улучшить
    const proj = geoMercator()
      .fitSize([width - margin * 2, height - margin * 2], geojson || { type: 'FeatureCollection', features: [] })
      .precision(0.1);
    const path = geoPath().projection(proj);
    return { projection: proj, pathGen: path };
  }, [geojson]);

  // handle country click -> set label
  const onCountryClick = (featureObj) => {
    const name = featureObj.properties?.name || featureObj.properties?.NAME || 'Unknown';
    setSelected({ label: name, lat: null, lon: null });
    setQuery(name);
    setResults([]);
  };

  // Nominatim forward search (simple, no debounce — можно добавить)
  const doSearch = async (q) => {
    if (!q || q.length < 2) { setResults([]); return; }
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&q=${encodeURIComponent(q)}`;
      const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
      const data = await res.json();
      const mapped = data.map(r => {
        const addr = r.address || {};
        const city = addr.city || addr.town || addr.village || addr.county;
        const country = addr.country;
        const label = city && country ? `${city}, ${country}` : (r.display_name || `${r.lat},${r.lon}`);
        return { label, lat: r.lat, lon: r.lon, raw: r };
      });
      setResults(mapped);
    } catch (e) {
      console.error(e);
      setResults([]);
    }
  };

  const selectResult = (r) => {
    setSelected(r);
    setQuery(r.label);
    setResults([]);
    // optionally scroll/zoom to the marker — not implemented here
  };

  const saveAndClose = () => {
    if (selected) onSave({ label: selected.label, lat: selected.lat || null, lon: selected.lon || null });
    else onSave(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>✕</button>
        <h3 style={{ textAlign: 'center', margin: '8px 0 14px' }}>Оберіть місто або країну</h3>

        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); doSearch(e.target.value); }}
            placeholder="Пошук міста (наприклад: Odesa)"
            style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)' }}
          />
          <button className={styles.chip} onClick={() => { setQuery(''); setResults([]); setSelected(null); }}>Очистити</button>
        </div>

        {results.length > 0 && (
          <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 8, border: '1px solid rgba(0,0,0,0.06)', borderRadius: 8 }}>
            {results.map((r, i) => (
              <div key={i} onClick={() => selectResult(r)} style={{ padding: '8px 10px', cursor: 'pointer', borderBottom: i < results.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                <div style={{ fontWeight: 600 }}>{r.label}</div>
                {r.lat && r.lon && <div style={{ fontSize: 12, color: '#666' }}>{parseFloat(r.lat).toFixed(4)}, {parseFloat(r.lon).toFixed(4)}</div>}
              </div>
            ))}
          </div>
        )}

        <div style={{ width: '100%', height: height, overflow: 'hidden', borderRadius: 10, border: '1px solid rgba(0,0,0,0.06)' }}>
          <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
            <g transform={`translate(${margin},${margin})`}>
              {geojson && geojson.features.map((f, i) => (
                <path
                  key={i}
                  d={pathGen(f) || ''}
                  fill="#f7f7f7"
                  stroke="#e6e6e6"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onCountryClick(f)}
                  onMouseEnter={(e) => e.currentTarget.setAttribute('fill', '#e8f0ff')}
                  onMouseLeave={(e) => e.currentTarget.setAttribute('fill', '#f7f7f7')}
                />
              ))}

              {/* marker for selected city */}
              {selected && selected.lon && selected.lat && (() => {
                const [x, y] = projection([parseFloat(selected.lon), parseFloat(selected.lat)]) || [0,0];
                return (
                  <g transform={`translate(${x},${y})`}>
                    <circle r={6} fill="#1b79ff" stroke="#fff" strokeWidth={1.5} />
                    <text x={10} y={4} style={{ fontFamily: 'system-ui', fontSize: 12, fill: '#222' }}>{selected.label}</text>
                  </g>
                );
              })()}
            </g>
          </svg>
        </div>

        <div className={styles.modalFooter} style={{ marginTop: 12 }}>
          <div style={{ flex: 1 }} />
          <button className={styles.chip} onClick={saveAndClose}>Зберегти</button>
        </div>
      </div>
    </div>
  );
}
