export const fmt = (n) =>
  "$" + Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

export const monthKey = (year, month) =>
  `${year}-${String(month + 1).padStart(2, "0")}`;