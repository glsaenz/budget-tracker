# Budget Tracker

A personal finance dashboard built with React and Recharts. Track income and expenses by category, visualize spending trends over 6 months, and manage transactions — all in the browser.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white) ![Recharts](https://img.shields.io/badge/Recharts-2-22B5BF) ![License](https://img.shields.io/badge/license-MIT-green)

---

## Features

- **Monthly navigation** — browse income and expenses by month with prev/next controls
- **Summary cards** — at-a-glance totals for income, expenses, and net balance
- **Category breakdown** — progress bars showing spending distribution across categories
- **Pie chart** — visual split of expenses by category using Recharts
- **6-month trend chart** — grouped bar chart comparing income vs. expenses over time
- **Add transactions** — inline form with description, amount, category, and type fields
- **Delete transactions** — remove any transaction from the current month
- **Persistent storage** — transactions saved to localStorage and restored on reload

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [React 18](https://react.dev) | UI framework |
| [Vite](https://vitejs.dev) | Build tool and dev server |
| [Recharts](https://recharts.org) | Chart components (BarChart, PieChart) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 7+

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/budget-tracker.git
cd budget-tracker

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for production

```bash
npm run build
```

Output goes to the `dist/` folder, ready to deploy to any static host (Vercel, Netlify, GitHub Pages).

---

## Project Structure

```
src/
├── main.jsx              # App entry point
├── App.jsx               # Root component
├── BudgetTracker.jsx     # Main dashboard component
├── index.css             # Global styles and font imports
├── constants.js          # Categories, colors, month names
├── utils.js              # fmt() and monthKey() helpers
├── seedData.js           # Sample transactions for demo
├── components/
│   ├── SummaryCard.jsx       # Metric tile (income / expenses / net)
│   ├── CategoryBar.jsx       # Progress bar row per category
│   └── TransactionRow.jsx    # Table row with delete button
└── hooks/
    ├── useBudget.js          # State: transactions, month, add, delete
    └── useChartData.js       # Derived: totals, category map, trend data
```

---

## How It Works

All application state lives in the `useBudget` custom hook — transactions, the currently viewed month, and the add-transaction form. Derived values (totals, category breakdowns, chart data) are computed with `useMemo` inside `useChartData` and only recalculate when their dependencies change.

Components are kept stateless — they receive props and fire events upward. `BudgetTracker.jsx` acts as the orchestrator, composing hooks and passing data down to each component.

---

## Customizing Categories

Edit `src/constants.js` to add, remove, or recolor categories:

```js
export const CATEGORIES = ["Housing", "Food", "Transport", "Health", "Entertainment", "Savings", "Other"];

export const CAT_COLORS = {
  Housing: "#3266ad",
  Food:    "#1D9E75",
  // add your own here
};
```

---

## Roadmap

- [ ] Budget goals per category with over/under indicators
- [ ] CSV export for the current month
- [ ] Mobile responsive layout
- [ ] Dark mode toggle
- [ ] Recurring transaction support

---

## License

MIT — free to use, modify, and distribute.