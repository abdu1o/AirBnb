'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import styles from '../styles/Modals.module.css';
import { feature } from 'topojson-client';
import { geoMercator, geoPath } from 'd3-geo';

export default function WhereModal({ isOpen, onClose, initialWhere, onSave }) {
  const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [topo, setTopo] = useState(null);
  const [geojson, setGeojson] = useState(null);
  const [selected, setSelected] = useState(initialWhere || null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // responsive size for the map container
  const [size, setSize] = useState({ width: 980, height: 420 });
  const margin = 10;

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    fetch(GEO_URL)
      .then(r => r.json())
      .then(t => {
        if (cancelled) return;
        setTopo(t);
        const fc = feature(t, t.objects.countries || t.objects['countries-110m'] || t.objects['land']);
        setGeojson(fc);
      })
      .catch(() => {
        if (!cancelled) alert('Ошибка загрузки карты');
      });
    return () => (cancelled = true);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && initialWhere) setSelected(initialWhere);
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen, initialWhere]);

  // ResizeObserver to make the map responsive
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    const update = () => {
      const w = Math.max(280, Math.min(980, el.clientWidth || 980));
      // height relative to width but constrained
      const h = Math.max(220, Math.round(w * 0.45));
      setSize({ width: Math.round(w), height: Math.round(h) });
    };

    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);

    // also update on window resize fallback
    const onWin = () => update();
    window.addEventListener('resize', onWin);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onWin);
    };
  }, [containerRef.current, isOpen]);

  const { projection, pathGen } = useMemo(() => {
    if (!geojson) return { projection: null, pathGen: () => '' };

    const proj = geoMercator()
      .fitSize([size.width - margin * 2, size.height - margin * 2], geojson)
      .precision(0.1);
    const path = geoPath().projection(proj);
    return { projection: proj, pathGen: path };
  }, [geojson, size.width, size.height]);

  const onCountryClick = (featureObj) => {
    const name = featureObj.properties?.name || featureObj.properties?.NAME || 'Unknown';
    setSelected({ label: name, lat: null, lon: null });
    setQuery(name);
    setResults([]);
  };

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
  };

  const saveAndClose = async () => {
    const payload = selected ? { label: selected.label, lat: selected.lat || null, lon: selected.lon || null } : null;

    try {
      await fetch('/api/searchState', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ where: payload }),
      });
    } catch (err) {
      console.error('Ошибка сохранения where:', err);
    }

    onSave(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
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

        {/* containerRef used to measure available width/height */}
        <div
          ref={containerRef}
          style={{ width: '100%', height: size.height, overflow: 'hidden', borderRadius: 10, border: '1px solid rgba(0,0,0,0.06)' }}
        >
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox={`0 0 ${size.width} ${size.height}`}
            preserveAspectRatio="xMidYMid meet"
          >
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

              {selected && selected.lon && selected.lat && projection && (() => {
                try {
                  const coords = projection([parseFloat(selected.lon), parseFloat(selected.lat)]);
                  if (!coords) return null;
                  const [x, y] = coords;
                  return (
                    <g transform={`translate(${x},${y})`}>
                      <circle r={6} fill="#1b79ff" stroke="#fff" strokeWidth={1.5} />
                      <text x={10} y={4} style={{ fontFamily: 'system-ui', fontSize: 12, fill: '#222' }}>{selected.label}</text>
                    </g>
                  );
                } catch (err) {
                  return null;
                }
              })()}
            </g>
          </svg>
        </div>

        <div className={styles.modalFooter}>
          <div style={{ flex: 1 }} />
          <button className={styles.chip} onClick={saveAndClose}>Зберегти</button>
        </div>
      </div>
    </div>
  );
}
