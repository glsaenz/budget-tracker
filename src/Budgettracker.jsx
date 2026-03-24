import { useBudget } from "./hooks/useBudget";
import { useChartData } from "./hooks/useChartData";
import { MONTHS, CATEGORIES, CAT_COLORS } from "./constants";
import { fmt } from "./utils";
import SummaryCard from "./components/SummaryCard";

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
};