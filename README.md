# 💰 Expense Tracker Dashboard

---

## 📋 Intern Details

| Field            | Details                         |
|------------------|---------------------------------|
| **Intern ID**    | CITS5145                        |
| **Full Name**    | Srikanth Koneti                      |
| **No. of Weeks** | 4 Weeks                         |
| **Project Name** | Expense Tracker Dashboard       |
| **Track**        | Full Stack Web Development      |
| **Organization** | CodTech IT Solutions Pvt. Ltd   |
| **Period**       | 18 June 2026 – 16 July 2026     |
| **GitHub**       | github.com/Srikanth-Koneti             |
| **LinkedIn**     | linkedin.com/in/suman-dara-1175072b9 |

---

## 📌 Project Scope

A fully functional **Expense Tracker Dashboard** built with vanilla HTML, CSS, and JavaScript. It helps users manage personal finances by tracking income and expenses, visualizing spending patterns with charts, and filtering/exporting transaction history — all with data stored in the browser's localStorage (no backend required).

---

## ✨ Features

- ➕ **Add Transactions** — income or expense with description, amount, category, and date
- 📊 **Bar Chart** — visual comparison of total income vs total expenses (Chart.js)
- 🥧 **Pie/Doughnut Chart** — expense breakdown by category (Chart.js)
- 📋 **Transaction History Table** — sortable by newest date
- 🔍 **Filters** — filter by type (income/expense), category, and month
- ⬇ **CSV Export** — download all transactions as a `.csv` file
- 💾 **Persistent Storage** — data saved in `localStorage`, survives page refresh
- 🗑 **Delete** individual transactions or clear all
- 📱 **Responsive Design** — works on desktop, tablet, and mobile

---

## 🗂 Project Structure

```
expense-tracker/
├── index.html    ← Main HTML structure & layout
├── style.css     ← All styling (variables, cards, charts, table, responsive)
├── script.js     ← Full logic: CRUD, charts, filters, localStorage, CSV export
└── README.md     ← Project documentation (this file)
```

---

## 🛠 Technologies Used

| Technology       | Purpose                          |
|------------------|----------------------------------|
| HTML5            | Page structure & semantics       |
| CSS3             | Styling, layout (Grid/Flexbox)   |
| JavaScript (ES6) | App logic, DOM, localStorage     |
| Chart.js (CDN)   | Bar chart & Doughnut chart       |

---

## 🚀 How to Run

1. Download or clone this repository
2. Open `index.html` in any modern browser (Chrome, Edge, Firefox)
3. No server or installation required — runs entirely in the browser

---

## 📸 Screenshots

> *(Add screenshots of the dashboard, charts, and transaction table to your GitHub repo)*

---

## 💡 Key Implementation Details

### localStorage Persistence
All transactions are stored under the key `expense_tracker_transactions` in the browser's localStorage as a JSON string. Data persists across page refreshes and browser restarts.

### Chart.js Integration
- **Bar Chart**: Compares total income vs total expense amounts
- **Doughnut Chart**: Shows proportional spending across 9 expense categories

### Filtering System
Filters for type, category, and month work independently and can be combined. Summary cards always reflect the full dataset; the table reflects the active filter.

### CSV Export
Uses the Blob API to generate a downloadable `.csv` file containing all transactions with columns: Date, Description, Category, Type, Amount.

---

## 📦 Categories Supported

Food | Transport | Shopping | Health | Entertainment | Salary | Education | Utilities | Other

---

*Developed as part of the CodTech IT Solutions Full Stack Web Development Internship.*
