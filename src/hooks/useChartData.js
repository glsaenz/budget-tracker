import { useMemo } from "react";
import { MONTHS, CAT_COLORS } from "../constants";
import { monthKey } from "../utils";

export function useChartData({ transactions, year, month }) {

  // ── Transactions filtered to current month ──
  const monthTxs = useMemo(() => {
    const key = monthKey(year, month);
    return transactions.filter((t) => t.date.startsWith(key));
  }, [transactions, year, month]);

  // ── Summary totals ──
  const income = useMemo(
    () => monthTxs.filter((t) => t.type === "income").reduce((a, t) => a + t.amt, 0),
    [monthTxs]
  );

  const expense = useMemo(
    () => monthTxs.filter((t) => t.type === "expense").reduce((a, t) => a + t.amt, 0),
    [monthTxs]
  );

  const net = income - expense;

  // ── Category totals (expenses only) ──
  const catTotals = useMemo(() => {
    const map = {};
    monthTxs
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map[t.cat] = (map[t.cat] || 0) + t.amt;
      });
    return map;
  }, [monthTxs]);

  // ── Category chart data (sorted highest to lowest) ──
  const catChartData = useMemo(
    () =>
      Object.entries(catTotals)
        .map(([name, value]) => ({ name, value, color: CAT_COLORS[name] || "#888" }))
        .sort((a, b) => b.value - a.value),
    [catTotals]
  );

  // ── 6-month trend (current month + 5 months back) ──
  const trendData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      let m = month - (5 - i);
      let y = year;
      while (m < 0) { m += 12; y--; }

      const key = monthKey(y, m);
      const txs = transactions.filter((t) => t.date.startsWith(key));

      return {
        name:     MONTHS[m].slice(0, 3),
        Income:   txs.filter((t) => t.type === "income").reduce((a, t) => a + t.amt, 0),
        Expenses: txs.filter((t) => t.type === "expense").reduce((a, t) => a + t.amt, 0),
      };
    });
  }, [transactions, year, month]);

  return {
    monthTxs,
    income,
    expense,
    net,
    catTotals,
    catChartData,
    trendData,
  };
}