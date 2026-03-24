import { useBudget } from "./hooks/useBudget";
import { useChartData } from "./hooks/useChartData";
import { MONTHS, CATEGORIES, CAT_COLORS } from "./constants";
import { fmt } from "./utils";
import SummaryCard from "./components/SummaryCard";
import CategoryBar from "./components/CategoryBar";
import TransactionRow from "./components/TransactionRow";

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

      {/* Transactions Table */}
      <div style={styles.panel}>
        <p style={styles.panelTitle}>Transactions</p>
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
  monthLabel: {
    fontSize: 13,
    minWidth: 130,
    textAlign: "center",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
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
};