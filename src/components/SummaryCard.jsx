export default function SummaryCard({ label, value, color }) {
  return (
    <div style={styles.card}>
      <p style={styles.label}>{label}</p>
      <p style={{ ...styles.value, color }}>{value}</p>
    </div>
  );
}

const styles = {
  card: {
    background: "#f5f5f3",
    borderRadius: 10,
    padding: "1rem",
  },
  label: {
    fontSize: 11,
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    margin: "0 0 6px",
  },
  value: {
    fontSize: 24,
    fontWeight: 500,
    margin: 0,
  },
};