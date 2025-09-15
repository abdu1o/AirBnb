let state = {
  who: {
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  },
  where: {
    selected: null,
    query: "",
  },
  dateRange: {
    start: null, 
    end: null,   
    label: "",    
  },
  categories: [],
};

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json(state);
  }

  if (req.method === "POST") {
    const newState = req.body;

    if (newState.dateRange?.start && newState.dateRange?.end) {
      const startDate = new Date(newState.dateRange.start);
      const endDate = new Date(newState.dateRange.end);

      const format = (date) =>
        date.toLocaleDateString("uk-UA", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

      newState.dateRange.label = `${format(startDate)} — ${format(endDate)}`;
    }

    state = { ...state, ...newState };
    console.log("Сохраняем state:", newState);
    return res.status(200).json({ message: "Saved", state });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
