import React, { useCallback, useMemo, useState } from "react";
import TransactionRow from "../components/TransactionRow.jsx";

function makeBigList(n = 5000) {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    merchant: `Merchant ${i + 1}`,
    amount: (Math.random() * 9000 + 10).toFixed(2),
    date: new Date(Date.now() - i * 60000).toISOString().slice(0, 19).replace("T", " "),
  }));
}

export default function PerfDemo() {
  const [data] = useState(() => makeBigList(5000));
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 50;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((t) => t.merchant.toLowerCase().includes(q));
  }, [data, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const next = useCallback(() => setPage((p) => Math.min(totalPages, p + 1)), [totalPages]);
  const prev = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);

  // Keep page valid when query changes
  React.useEffect(() => {
    setPage(1);
  }, [query]);

  return (
    <div className="wrap">
      <h1 className="h1">My Digital Banking</h1>
      <p className="muted">
        5000 items generated, but only {PAGE_SIZE} rendered per page. 
      </p>

      <div className="bar">
        <input
          className="input"
          placeholder="Search merchant…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="pager">
          <button className="btn" onClick={prev} disabled={page === 1}>
            Prev
          </button>
          <span className="meta">
            Page {page} / {totalPages} (results: {filtered.length})
          </span>
          <button className="btn" onClick={next} disabled={page === totalPages}>
            Next
          </button>
        </div>
      </div>

      <div className="table">
        <div className="thead">
          <div>Merchant</div>
          <div>Amount</div>
          <div>Date</div>
        </div>

        {pageItems.map((t) => (
          <TransactionRow key={t.id} t={t} />
        ))}
      </div>
    </div>
  );
}
