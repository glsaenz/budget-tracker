import { useState } from "react";
import { SEED_TRANSACTIONS } from "../seedData";
import { monthKey } from "../utils";

export function useBudget() {
  const today = new Date();

  const [year, setYear]     = useState(today.getFullYear());
  const [month, setMonth]   = useState(today.getMonth());
  const [transactions, setTx] = useState(() => {
    const saved = localStorage.getItem("budget-transactions");
    return saved ? JSON.parse(saved) : SEED_TRANSACTIONS;
  });
  const [nextId, setNextId] = useState(200);
  const [form, setForm]     = useState({
    desc: "",
    amt:  "",
    cat:  "Food",
    type: "expense",
  });

  // ── Persist to localStorage on every change ──
  const saveTx = (updated) => {
    setTx(updated);
    localStorage.setItem("budget-transactions", JSON.stringify(updated));
  };

  // ── Month navigation ──
  const changeMonth = (dir) => {
    let m = month + dir;
    let y = year;
    if (m > 11) { m = 0;  y++; }
    if (m < 0)  { m = 11; y--; }
    setMonth(m);
    setYear(y);
  };

  // ── Add transaction ──
  const addTx = () => {
    const amt = parseFloat(form.amt);
    if (!form.desc.trim() || !amt || isNaN(amt)) return;

    const day = String(new Date().getDate()).padStart(2, "0");
    const newTx = {
      id:   nextId,
      desc: form.desc.trim(),
      cat:  form.cat,
      type: form.type,
      amt,
      date: `${monthKey(year, month)}-${day}`,
    };

    saveTx([newTx, ...transactions]);
    setNextId((n) => n + 1);
    setForm((f) => ({ ...f, desc: "", amt: "" }));
  };

  // ── Delete transaction ──
  const deleteTx = (id) => {
    saveTx(transactions.filter((t) => t.id !== id));
  };

  // ── Reset to seed data ──
  const resetData = () => {
    localStorage.removeItem("budget-transactions");
    saveTx(SEED_TRANSACTIONS);
  };

  return {
    year,
    month,
    transactions,
    form,
    setForm,
    changeMonth,
    addTx,
    deleteTx,
    resetData,
  };
}