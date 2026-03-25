import { useBudget } from "./hooks/useBudget";
import { useChartData } from "./hooks/useChartData";
import { MONTHS, CATEGORIES, CAT_COLORS } from "./constants";
import { fmt } from "./utils";
import SummaryCard from "./components/SummaryCard";
import CategoryBar from "./components/CategoryBar";
import TransactionRow from "./components/TransactionRow";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BarChart, Bar, XAxis, YAxis} from "recharts";

export default function BudgetTracker() {
  const {
    year,
    month,
    transactions,
    form,
    setForm,
    changeMonth,
    addTx,
    deleteTx,
    resetData,
  } = useBudget();

  const {
    monthTxs,
    income,
    expense,
    net,
    catTotals,
    catChartData,
    trendData,
  } = useChartData({ transactions, year, month });

  const exportCSV = () => {
    const headers = ["Date", "Description", "Category", "Type", "Amount"];
    const rows = [...monthTxs]
      .reverse()
      .map((t) => [
        t.date,
        `"${t.desc}"`,
        t.cat,
        t.type,
        t.type === "expense" ? -t.amt : t.amt,
      ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");

    a.href     = url;
    a.download = `budget-${MONTHS[month].toLowerCase()}-${year}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.root}>

    {/* Header */}
    <div style={styles.header}>
      <div>
        <h1 style={styles.title}>Budget Tracker</h1>
        <p style={styles.subtitle}>Personal Finance · {year}</p>
      </div>
      <div style={styles.headerRight}>
        <div style={styles.monthNav}>
          <button style={styles.navBtn} onClick={() => changeMonth(-1)}>←</button>
          <span style={styles.monthLabel}>{MONTHS[month]} {year}</span>
          <button style={styles.navBtn} onClick={() => changeMonth(1)}>→</button>
        </div>
        <button style={styles.resetBtn} onClick={resetData}>
          Reset data
        </button>
      </div>
    </div>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        <SummaryCard label="Income"   value={fmt(income)}  color="#1D9E75" />
        <SummaryCard label="Expenses" value={fmt(expense)} color="#D85A30" />
        <SummaryCard
          label="Net"
          value={(net >= 0 ? "+" : "-") + fmt(net)}
          color={net >= 0 ? "#1D9E75" : "#D85A30"}
        />
      </div>
      
      {/* Category Breakdown */}
      <div style={styles.panel}>
        <p style={styles.panelTitle}>Spending by category</p>
        {catChartData.length === 0
          ? <p style={styles.empty}>No expenses this month.</p>
          : catChartData.map(({ name, value }) => (
              <CategoryBar
                key={name}
                cat={name}
                amount={value}
                total={expense}
                color={CAT_COLORS[name]}
              />
            ))
        }
      </div>

      {/* Transactions Panel */}
      <div style={styles.panel}>
        <div style={styles.panelHeader}>
          <button style={styles.exportBtn} onClick={exportCSV}>
            Export CSV
          </button>
        </div>

        {/* Add Transaction Form */}
        <div style={styles.formRow}>
          <input
            style={styles.input}
            placeholder="Description"
            value={form.desc}
            onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && addTx()}
          />
          <input
            style={{ ...styles.input, maxWidth: 110 }}
            placeholder="Amount"
            type="number"
            value={form.amt}
            onChange={(e) => setForm((f) => ({ ...f, amt: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && addTx()}
          />
          <select
            style={styles.select}
            value={form.cat}
            onChange={(e) => setForm((f) => ({ ...f, cat: e.target.value }))}
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            style={styles.select}
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <button style={styles.addBtn} onClick={addTx}>
            + Add
          </button>
        </div>

        {/* Table */}
        <table style={styles.table}>
          <thead>
            <tr>
              {["Description", "Category", "Date", "Amount", ""].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthTxs.length === 0
              ? (
                <tr>
                  <td colSpan={5} style={{ ...styles.td, color: "#aaa", padding: "16px 0" }}>
                    No transactions this month.
                  </td>
                </tr>
              )
              : [...monthTxs].reverse().map((tx) => (
                  <TransactionRow key={tx.id} tx={tx} onDelete={deleteTx} />
                ))
            }
          </tbody>
        </table>
      </div>

      {/* Category Pie Chart + Breakdown — two column layout */}
      <div style={styles.twoCol}>

        {/* Breakdown bars */}
        <div style={styles.panel}>
          <p style={styles.panelTitle}>Spending by category</p>
          {catChartData.length === 0
            ? <p style={styles.empty}>No expenses this month.</p>
            : catChartData.map(({ name, value }) => (
                <CategoryBar
                  key={name}
                  cat={name}
                  amount={value}
                  total={expense}
                  color={CAT_COLORS[name]}
                />
              ))
          }
        </div>

        {/* Pie chart */}
        <div style={styles.panel}>
          <p style={styles.panelTitle}>Category split</p>
          {catChartData.length === 0
            ? <p style={styles.empty}>No data.</p>
            : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={catChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {catChartData.map((entry) => (
                      <Cell key={entry.name} fill={CAT_COLORS[entry.name] || "#888"} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => "$" + v.toLocaleString("en-US")} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(v) => (
                      <span style={{ fontSize: 12, color: "#555" }}>{v}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )
          }
        </div>

      </div>
      {/* 6-month Trend Chart */}
      <div style={{ ...styles.panel, marginBottom: 16 }}>
        <p style={styles.panelTitle}>6-month trend</p>

        {/* Legend */}
        <div style={styles.legendRow}>
          <span style={styles.legendItem}>
            <span style={{ ...styles.legendDot, background: "#1D9E75" }} />
            Income
          </span>
          <span style={styles.legendItem}>
            <span style={{ ...styles.legendDot, background: "#D85A30" }} />
            Expenses
          </span>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={trendData}
            barGap={4}
            barCategoryGap="30%"
          >
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#aaa" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#aaa" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => v ? "$" + (v / 1000).toFixed(0) + "k" : ""}
            />
            <Tooltip
              formatter={(v) => "$" + v.toLocaleString("en-US")}
              contentStyle={{
                fontSize: 12,
                borderRadius: 6,
                border: "1px solid #eee",
              }}
            />
            <Bar dataKey="Income"   fill="#1D9E75" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Expenses" fill="#D85A30" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

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
    flexWrap: "wrap",
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 600,
    fontFamily: "'Playfair Display', Georgia, serif",
    margin: 0,
    letterSpacing: "-0.01em",
  },
  subtitle: {
    fontSize: 11,
    color: "#999",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    margin: "4px 0 0",
  },
  monthNav: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  navBtn: {
    background: "none",
    border: "1px solid #ddd",
    borderRadius: 6,
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: 14,
    fontFamily: "inherit",
    color: "#555",
    transition: "border-color 0.15s",
  },
  monthLabel: {
    fontSize: 13,
    minWidth: 140,
    textAlign: "center",
    fontWeight: 500,
    color: "#333",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
    marginBottom: 16,
  },
  debug: {
    background: "#fffbe6",
    border: "1px solid #ffe58f",
    borderRadius: 8,
    padding: "10px 14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  resetBtn: {
    background: "none",
    border: "1px solid #ccc",
    borderRadius: 6,
    padding: "4px 10px",
    cursor: "pointer",
    fontSize: 11,
    fontFamily: "inherit",
    whiteSpace: "nowrap",
  },
  panel: {
  background: "#fff",
  border: "1px solid #eee",
  borderRadius: 12,
  padding: "1.25rem",
  marginBottom: 16,
  },
  panelTitle: {
    fontSize: 11,
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    margin: "0 0 1rem",
  },
  empty: {
    fontSize: 13,
    color: "#aaa",
    margin: 0,
  },
  table: {
  width: "100%",
  borderCollapse: "collapse",
  },
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

  formRow: {
    display: "flex",
    gap: 8,
    flexWrap: "nowrap",
    marginBottom: "1rem",
    overflowX: "auto",
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
    minWidth: 70,
    flexShrink: 0,
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 12,
    marginBottom: 16,
  },
  legendRow: {
    display: "flex",
    gap: 16,
    marginBottom: 8,
  },
  legendItem: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    fontSize: 12,
    color: "#666",
  },
  legendDot: {
    display: "inline-block",
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  headerRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 8,
  },
  resetBtn: {
    background: "none",
    border: "1px solid #ddd",
    borderRadius: 6,
    padding: "4px 10px",
    cursor: "pointer",
    fontSize: 11,
    fontFamily: "inherit",
    color: "#aaa",
    whiteSpace: "nowrap",
  },

  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  exportBtn: {
    background: "none",
    border: "1px solid #ddd",
    borderRadius: 6,
    padding: "4px 10px",
    cursor: "pointer",
    fontSize: 11,
    fontFamily: "inherit",
    color: "#aaa",
    whiteSpace: "nowrap",
  },
};