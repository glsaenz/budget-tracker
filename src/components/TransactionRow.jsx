import { MONTHS, CAT_COLORS } from "../constants";

export default function TransactionRow({ tx, onDelete }) {
  const isIncome = tx.type === "income";
  const color    = isIncome ? "#1D9E75" : "#D85A30";
  const sign     = isIncome ? "+" : "-";
  const day      = tx.date.split("-")[2];
  const monthIdx = parseInt(tx.date.split("-")[1], 10) - 1;
  const badgeBg  = (CAT_COLORS[tx.cat] || "#888") + "22";
  const badgeColor = CAT_COLORS[tx.cat] || "#888";

  return (
    <tr>
      <td style={styles.td}>{tx.desc}</td>
      <td style={styles.td}>
        <span style={{ ...styles.badge, background: badgeBg, color: badgeColor }}>
          {tx.cat}
        </span>
      </td>
      <td style={{ ...styles.td, color: "#aaa", fontSize: 12 }}>
        {MONTHS[monthIdx].slice(0, 3)} {day}
      </td>
      <td style={{ ...styles.td, color, fontWeight: 500, textAlign: "right" }}>
        {sign}${Math.abs(tx.amt).toLocaleString("en-US")}
      </td>
      <td style={{ ...styles.td, textAlign: "right" }}>
        <button
          style={styles.deleteBtn}
          onClick={() => onDelete(tx.id)}
          title="Delete"
        >
          ✕
        </button>
      </td>
    </tr>
  );
}

const styles = {
  td: {
    padding: "10px 0",
    fontSize: 13,
    borderBottom: "1px solid #f5f5f3",
    verticalAlign: "middle",
  },
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