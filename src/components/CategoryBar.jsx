export default function CategoryBar({ cat, amount, total, color }) {
  const pct = total > 0 ? Math.round((amount / total) * 100) : 0;
  const width = total > 0 ? Math.round((amount / total) * 100) : 0;

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={styles.meta}>
        <span style={styles.name}>{cat}</span>
        <span style={styles.amt}>
          {`$${amount.toLocaleString("en-US")}`}{" "}
          <span style={styles.pct}>{pct}%</span>
        </span>
      </div>
      <div style={styles.track}>
        <div
          style={{
            ...styles.fill,
            width: `${width}%`,
            background: color || "#888",
          }}
        />
      </div>
    </div>
  );
}

const styles = {
  meta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  name: {
    fontSize: 13,
    color: "#333",
  },
  amt: {
    fontSize: 13,
    fontWeight: 500,
    color: "#555",
  },
  pct: {
    color: "#aaa",
    fontSize: 11,
  },
  track: {
    background: "#f0f0ee",
    borderRadius: 99,
    height: 6,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 99,
    transition: "width 0.4s ease",
  },
};