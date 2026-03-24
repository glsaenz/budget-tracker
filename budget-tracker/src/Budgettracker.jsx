import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from "recharts";

// ─── Constants ───────────────────────────────────────────────────────────────

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const CATEGORIES = ["Housing","Food","Transport","Health","Entertainment","Savings","Other"];

const CAT_COLORS = {
  Housing:       "#3266ad",
  Food:          "#1D9E75",
  Transport:     "#BA7517",
  Health:        "#D4537E",
  Entertainment: "#7F77DD",
  Savings:       "#639922",
  Other:         "#888780",
};

const SEED_TRANSACTIONS = [
  { id: 1,  desc: "Salary",           cat: "Other",         type: "income",  amt: 5200, date: "2026-03-01" },
  { id: 2,  desc: "Freelance project",cat: "Other",         type: "income",  amt: 900,  date: "2026-03-10" },
  { id: 3,  desc: "Rent",             cat: "Housing",       type: "expense", amt: 1450, date: "2026-03-01" },
  { id: 4,  desc: "Groceries",        cat: "Food",          type: "expense", amt: 320,  date: "2026-03-05" },
  { id: 5,  desc: "Uber Eats",        cat: "Food",          type: "expense", amt: 75,   date: "2026-03-08" },
  { id: 6,  desc: "Netflix",          cat: "Entertainment", type: "expense", amt: 18,   date: "2026-03-03" },
  { id: 7,  desc: "Gym",              cat: "Health",        type: "expense", amt: 45,   date: "2026-03-02" },
  { id: 8,  desc: "Gas",              cat: "Transport",     type: "expense", amt: 60,   date: "2026-03-09" },
  { id: 9,  desc: "401k",             cat: "Savings",       type: "expense", amt: 520,  date: "2026-03-01" },
  { id: 10, desc: "Electric bill",    cat: "Housing",       type: "expense", amt: 95,   date: "2026-03-06" },
  { id: 11, desc: "Concert tickets",  cat: "Entertainment", type: "expense", amt: 120,  date: "2026-03-12" },
  { id: 12, desc: "Pharmacy",         cat: "Health",        type: "expense", amt: 30,   date: "2026-03-14" },
  // Feb data for trend chart
  { id: 13, desc: "Salary",           cat: "Other",         type: "income",  amt: 5200, date: "2026-02-01" },
  { id: 14, desc: "Rent",             cat: "Housing",       type: "expense", amt: 1450, date: "2026-02-01" },
  { id: 15, desc: "Groceries",        cat: "Food",          type: "expense", amt: 290,  date: "2026-02-05" },
  { id: 16, desc: "Utilities",        cat: "Housing",       type: "expense", amt: 110,  date: "2026-02-07" },
  { id: 17, desc: "Transport pass",   cat: "Transport",     type: "expense", amt: 90,   date: "2026-02-03" },
  // Jan data
  { id: 18, desc: "Salary",           cat: "Other",         type: "income",  amt: 5200, date: "2026-01-01" },
  { id: 19, desc: "Rent",             cat: "Housing",       type: "expense", amt: 1450, date: "2026-01-01" },
  { id: 20, desc: "New Year dinner",  cat: "Food",          type: "expense", amt: 200,  date: "2026-01-02" },
  { id: 21, desc: "Gym signup",       cat: "Health",        type: "expense", amt: 120,  date: "2026-01-04" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n) =>
  "$" + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const monthKey = (y, m) => `${y}-${String(m + 1).padStart(2, "0")}`;

// ─── Sub-components ───────────────────────────────────────────────────────────

function SummaryCard({ label, value, color }) {
  return (
    <div style={styles.summaryCard}>
      <p style={styles.summaryLabel}>{label}</p>
      <p style={{ ...styles.summaryValue, color }}>{value}</p>
    </div>
  );
}

function CategoryBar({ cat, amount, total }) {
  const pct = total > 0 ? Math.round((amount / total) * 100) : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={styles.barName}>{cat}</span>
        <span style={styles.barAmt}>
          {fmt(amount)}{" "}
          <span style={{ color: "#888", fontSize: 11 }}>{pct}%</span>
        </span>
      </div>
      <div style={styles.barTrack}>
        <div
          style={{
            ...styles.barFill,
            width: `${pct}%`,
            background: CAT_COLORS[cat] || "#888",
          }}
        />
      </div>
    </div>
  );
}

function TransactionRow({ tx, onDelete }) {
  const isIncome = tx.type === "income";
  const color = isIncome ? "#1D9E75" : "#D85A30";
  const sign = isIncome ? "+" : "-";
  const day = tx.date.split("-")[2];
  const monthIdx = parseInt(tx.date.split("-")[1], 10) - 1;

  return (
    <tr style={styles.txRow}>
      <td style={styles.td}>{tx.desc}</td>
      <td style={styles.td}>
        <span
          style={{
            ...styles.badge,
            background: CAT_COLORS[tx.cat] + "22",
            color: CAT_COLORS[tx.cat] || "#888",
          }}
        >
          {tx.cat}
        </span>
      </td>
      <td style={{ ...styles.td, color: "#888", fontSize: 12 }}>
        {MONTHS[monthIdx].slice(0, 3)} {day}
      </td>
      <td style={{ ...styles.td, color, fontWeight: 500, textAlign: "right" }}>
        {sign}{fmt(tx.amt)}
      </td>
      <td style={{ ...styles.td, textAlign: "right" }}>
        <button onClick={() => onDelete(tx.id)} style={styles.deleteBtn} title="Delete">
          ✕
        </button>
      </td>
    </tr>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BudgetTracker() {
  const today = new Date();
  const [year, setYear]           = useState(today.getFullYear());
  const [month, setMonth]         = useState(today.getMonth());
  const [transactions, setTx]     = useState(SEED_TRANSACTIONS);
  const [form, setForm]           = useState({ desc: "", amt: "", cat: "Food", type: "expense" });
  const [nextId, setNextId]       = useState(100);

  // ── Navigation ──
  const changeMonth = (dir) => {
    let m = month + dir, y = year;
    if (m > 11) { m = 0; y++; }
    if (m < 0)  { m = 11; y--; }
    setMonth(m);
    setYear(y);
  };

  // ── Filtered transactions for current month ──
  const monthTxs = useMemo(() => {
    const key = monthKey(year, month);
    return transactions.filter((t) => t.date.startsWith(key));
  }, [transactions, year, month]);

  // ── Summary totals ──
  const income  = useMemo(() => monthTxs.filter(t => t.type === "income").reduce((a, t) => a + t.amt, 0), [monthTxs]);
  const expense = useMemo(() => monthTxs.filter(t => t.type === "expense").reduce((a, t) => a + t.amt, 0), [monthTxs]);
  const net     = income - expense;

  // ── Category totals ──
  const catTotals = useMemo(() => {
    const map = {};
    monthTxs.filter(t => t.type === "expense").forEach(t => {
      map[t.cat] = (map[t.cat] || 0) + t.amt;
    });
    return map;
  }, [monthTxs]);

  const catChartData = useMemo(() =>
    Object.entries(catTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value),
    [catTotals]
  );

  // ── 6-month trend ──
  const trendData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      let m = month - (5 - i), y = year;
      while (m < 0) { m += 12; y--; }
      const key = monthKey(y, m);
      const txs = transactions.filter(t => t.date.startsWith(key));
      return {
        name: MONTHS[m].slice(0, 3),
        Income:   txs.filter(t => t.type === "income").reduce((a, t) => a + t.amt, 0),
        Expenses: txs.filter(t => t.type === "expense").reduce((a, t) => a + t.amt, 0),
      };
    });
  }, [transactions, year, month]);

  // ── Add transaction ──
  const addTx = () => {
    const amt = parseFloat(form.amt);
    if (!form.desc.trim() || !amt || isNaN(amt)) return;
    const day = String(new Date().getDate()).padStart(2, "0");
    setTx(prev => [
      { id: nextId, desc: form.desc.trim(), cat: form.cat, type: form.type, amt, date: `${monthKey(year, month)}-${day}` },
      ...prev,
    ]);
    setNextId(n => n + 1);
    setForm(f => ({ ...f, desc: "", amt: "" }));
  };

  // ── Delete transaction ──
  const deleteTx = (id) => setTx(prev => prev.filter(t => t.id !== id));

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={styles.root}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Budget Tracker</h1>
          <p style={styles.subtitle}>Personal Finance · {year}</p>
        </div>
        <div style={styles.monthNav}>
          <button style={styles.navBtn} onClick={() => changeMonth(-1)}>←</button>
          <span style={styles.monthLabel}>{MONTHS[month]} {year}</span>
          <button style={styles.navBtn} onClick={() => changeMonth(1)}>→</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        <SummaryCard label="Income"   value={fmt(income)}  color="#1D9E75" />
        <SummaryCard label="Expenses" value={fmt(expense)} color="#D85A30" />
        <SummaryCard label="Net"      value={(net >= 0 ? "+" : "-") + fmt(net)} color={net >= 0 ? "#1D9E75" : "#D85A30"} />
      </div>

      {/* Category Breakdown + Pie Chart */}
      <div style={styles.twoCol}>

        {/* Bars */}
        <div style={styles.panel}>
          <p style={styles.panelTitle}>Spending by category</p>
          {catChartData.length === 0
            ? <p style={{ color: "#888", fontSize: 13 }}>No expenses this month.</p>
            : catChartData.map(({ name, value }) => (
                <CategoryBar key={name} cat={name} amount={value} total={expense} />
              ))
          }
        </div>

        {/* Pie */}
        <div style={styles.panel}>
          <p style={styles.panelTitle}>Category split</p>
          {catChartData.length === 0
            ? <p style={{ color: "#888", fontSize: 13 }}>No data.</p>
            : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={catChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%" cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {catChartData.map((entry) => (
                      <Cell key={entry.name} fill={CAT_COLORS[entry.name] || "#888"} />
                    ))}
                  </Pie>
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(v) => <span style={{ fontSize: 12, color: "#555" }}>{v}</span>}
                  />
                  <Tooltip formatter={(v) => fmt(v)} />
                </PieChart>
              </ResponsiveContainer>
            )
          }
        </div>
      </div>

      {/* 6-month Trend Bar Chart */}
      <div style={{ ...styles.panel, marginBottom: 16 }}>
        <p style={styles.panelTitle}>6-month trend</p>
        <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
          <span style={styles.legendDot("#1D9E75")}>Income</span>
          <span style={styles.legendDot("#D85A30")}>Expenses</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={trendData} barGap={4} barCategoryGap="30%">
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} tickFormatter={(v) => v ? "$" + (v / 1000).toFixed(0) + "k" : ""} />
            <Tooltip formatter={(v) => fmt(v)} />
            <Bar dataKey="Income"   fill="#1D9E75" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Expenses" fill="#D85A30" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Add Transaction */}
      <div style={styles.panel}>
        <p style={styles.panelTitle}>Transactions</p>

        {/* Form */}
        <div style={styles.formRow}>
          <input
            style={styles.input}
            placeholder="Description"
            value={form.desc}
            onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && addTx()}
          />
          <input
            style={{ ...styles.input, maxWidth: 100 }}
            placeholder="Amount"
            type="number"
            value={form.amt}
            onChange={e => setForm(f => ({ ...f, amt: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && addTx()}
          />
          <select style={styles.select} value={form.cat} onChange={e => setForm(f => ({ ...f, cat: e.target.value }))}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select style={styles.select} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <button style={styles.addBtn} onClick={addTx}>+ Add</button>
        </div>

        {/* Table */}
        <table style={styles.table}>
          <thead>
            <tr>
              {["Description","Category","Date","Amount",""].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthTxs.length === 0
              ? <tr><td colSpan={5} style={{ ...styles.td, color: "#888", padding: "16px 0" }}>No transactions this month. Add one above.</td></tr>
              : [...monthTxs].reverse().map(tx => (
                  <TransactionRow key={tx.id} tx={tx} onDelete={deleteTx} />
                ))
            }
          </tbody>
        </table>
      </div>

    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  root: {
    fontFamily: "'DM Mono', 'Courier New', monospace",
    maxWidth: 900,
    margin: "0 auto",
    padding: "2rem 1.5rem",
    color: "#1a1a1a",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "1.5rem",
  },
  title: {
    fontSize: 26,
    fontWeight: 600,
    fontFamily: "'Playfair Display', Georgia, serif",
    margin: 0,
  },
  subtitle: {
    fontSize: 11,
    color: "#999",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    margin: "4px 0 0",
  },
  monthNav: { display: "flex", alignItems: "center", gap: 10 },
  navBtn: {
    background: "none",
    border: "1px solid #ddd",
    borderRadius: 6,
    padding: "4px 10px",
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "inherit",
  },
  monthLabel: { fontSize: 13, minWidth: 120, textAlign: "center" },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    background: "#f5f5f3",
    borderRadius: 10,
    padding: "1rem",
  },
  summaryLabel: { fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 6px" },
  summaryValue: { fontSize: 24, fontWeight: 500, margin: 0 },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginBottom: 16,
  },
  panel: {
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 12,
    padding: "1.25rem",
    marginBottom: 0,
  },
  panelTitle: {
    fontSize: 11,
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    margin: "0 0 1rem",
  },
  barName: { fontSize: 13, color: "#333" },
  barAmt:  { fontSize: 13, fontWeight: 500, color: "#555" },
  barTrack: { background: "#f0f0ee", borderRadius: 99, height: 6, overflow: "hidden" },
  barFill:  { height: "100%", borderRadius: 99, transition: "width 0.4s ease" },
  legendDot: (color) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    fontSize: 12,
    color: "#666",
    // usage: <span style={styles.legendDot("#hex")}>Label</span>
    // Note: CSS can't be applied this way; see inline usage in JSX
  }),
  formRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: "1rem",
  },
  input: {
    flex: 1,
    minWidth: 120,
    fontFamily: "inherit",
    fontSize: 12,
    padding: "8px 10px",
    border: "1px solid #ddd",
    borderRadius: 6,
    outline: "none",
  },
  select: {
    fontFamily: "inherit",
    fontSize: 12,
    padding: "8px 10px",
    border: "1px solid #ddd",
    borderRadius: 6,
    outline: "none",
    background: "#fff",
  },
  addBtn: {
    background: "#1a1a1a",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "8px 16px",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 12,
    whiteSpace: "nowrap",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    fontSize: 11,
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    padding: "0 0 8px",
    borderBottom: "1px solid #eee",
    textAlign: "left",
    fontWeight: 400,
  },
  td: {
    padding: "10px 0",
    fontSize: 13,
    borderBottom: "1px solid #f5f5f3",
    verticalAlign: "middle",
  },
  txRow: { transition: "background 0.1s" },
  badge: {
    display: "inline-block",
    fontSize: 10,
    padding: "2px 7px",
    borderRadius: 99,
    fontWeight: 500,
    letterSpacing: "0.03em",
  },
  deleteBtn: {
    background: "none",
    border: "none",
    color: "#ccc",
    cursor: "pointer",
    fontSize: 12,
    padding: "2px 4px",
    fontFamily: "inherit",
  },
};