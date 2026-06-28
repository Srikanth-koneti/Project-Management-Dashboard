/**
 * Expense Tracker Dashboard
 * CodTech IT Solutions Internship
 * Intern: Srikanth Koneti | Intern ID: CITS5145
 * Track: Full Stack Web Development
 * Duration: 4 Weeks (18 June 2026 - 16 July 2026)
 */

/* =============================================
   DATA MANAGEMENT (localStorage)
   ============================================= */

/** Load transactions from localStorage */
function loadTransactions() {
  const data = localStorage.getItem('expense_tracker_transactions');
  return data ? JSON.parse(data) : [];
}

/** Save transactions to localStorage */
function saveTransactions(transactions) {
  localStorage.setItem('expense_tracker_transactions', JSON.stringify(transactions));
}

// In-memory copy
let transactions = loadTransactions();

/* =============================================
   DOM REFERENCES
   ============================================= */
const txDesc      = document.getElementById('tx-desc');
const txAmount    = document.getElementById('tx-amount');
const txType      = document.getElementById('tx-type');
const txCategory  = document.getElementById('tx-category');
const txDate      = document.getElementById('tx-date');
const btnAdd      = document.getElementById('btn-add-tx');
const btnClear    = document.getElementById('btn-clear-all');
const btnExport   = document.getElementById('btn-export');

const filterType  = document.getElementById('filter-type');
const filterCat   = document.getElementById('filter-category');
const filterMonth = document.getElementById('filter-month');

const txBody      = document.getElementById('tx-body');
const emptyMsg    = document.getElementById('empty-msg');
const txTable     = document.getElementById('tx-table');

const totalIncomeEl  = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const netBalanceEl   = document.getElementById('net-balance');
const txCountEl      = document.getElementById('tx-count');
const currentDateEl  = document.getElementById('current-date');

/* =============================================
   CHARTS (Chart.js)
   ============================================= */
let barChart, pieChart;

/** Initialize or update the bar chart (Income vs Expenses) */
function renderBarChart(income, expense) {
  const ctx = document.getElementById('bar-chart').getContext('2d');
  if (barChart) barChart.destroy();

  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Income', 'Expenses'],
      datasets: [{
        label: 'Amount (₹)',
        data: [income, expense],
        backgroundColor: ['rgba(16,185,129,0.7)', 'rgba(239,68,68,0.7)'],
        borderColor:     ['#10b981', '#ef4444'],
        borderWidth: 2,
        borderRadius: 8,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: v => '₹' + v.toLocaleString('en-IN') }
        }
      }
    }
  });
}

/** Initialize or update the pie chart (Expense by Category) */
function renderPieChart(categoryTotals) {
  const ctx = document.getElementById('pie-chart').getContext('2d');
  if (pieChart) pieChart.destroy();

  const labels = Object.keys(categoryTotals);
  const data   = Object.values(categoryTotals);

  const palette = [
    '#4f46e5','#10b981','#f59e0b','#ef4444','#6366f1',
    '#14b8a6','#f97316','#ec4899','#8b5cf6'
  ];

  pieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: palette.slice(0, labels.length),
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { font: { size: 11 } } }
      }
    }
  });
}

/* =============================================
   RENDER / UPDATE UI
   ============================================= */

/** Re-render everything */
function render() {
  const typeFilter  = filterType.value;
  const catFilter   = filterCat.value;
  const monthFilter = filterMonth.value; // "YYYY-MM" or ""

  // Calculate summary from ALL transactions (not filtered)
  let totalIncome  = 0;
  let totalExpense = 0;
  const categoryTotals = {};

  transactions.forEach(tx => {
    if (tx.type === 'income')  totalIncome  += tx.amount;
    if (tx.type === 'expense') {
      totalExpense += tx.amount;
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
    }
  });

  // Update summary cards
  totalIncomeEl.textContent  = '₹' + totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 });
  totalExpenseEl.textContent = '₹' + totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 });
  const balance = totalIncome - totalExpense;
  netBalanceEl.textContent   = (balance < 0 ? '-₹' : '₹') + Math.abs(balance).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  netBalanceEl.style.color   = balance >= 0 ? '#10b981' : '#ef4444';
  txCountEl.textContent      = transactions.length;

  // Update charts
  renderBarChart(totalIncome, totalExpense);
  renderPieChart(categoryTotals);

  // Filter transactions for table
  let filtered = transactions.filter(tx => {
    const typeMatch  = typeFilter === 'all' || tx.type === typeFilter;
    const catMatch   = catFilter  === 'all' || tx.category === catFilter;
    const monthMatch = !monthFilter || tx.date.startsWith(monthFilter);
    return typeMatch && catMatch && monthMatch;
  });

  // Sort newest first
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Render table rows
  txBody.innerHTML = '';

  if (filtered.length === 0) {
    txTable.style.display = 'none';
    emptyMsg.style.display = 'block';
    return;
  }

  txTable.style.display = 'table';
  emptyMsg.style.display = 'none';

  filtered.forEach((tx, i) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${formatDate(tx.date)}</td>
      <td>${escHtml(tx.description)}</td>
      <td>${tx.category}</td>
      <td><span class="badge badge-${tx.type}">${tx.type}</span></td>
      <td class="amount-${tx.type}">${tx.type === 'income' ? '+' : '-'}₹${tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      <td><button class="btn-delete" data-id="${tx.id}">🗑 Delete</button></td>
    `;
    txBody.appendChild(row);
  });

  // Attach delete listeners
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => deleteTransaction(btn.dataset.id));
  });
}

/* =============================================
   CRUD OPERATIONS
   ============================================= */

/** Add a new transaction */
function addTransaction() {
  const description = txDesc.value.trim();
  const amount      = parseFloat(txAmount.value);
  const type        = txType.value;
  const category    = txCategory.value;
  const date        = txDate.value;

  // Validate
  if (!description) { alert('Please enter a description.'); txDesc.focus(); return; }
  if (isNaN(amount) || amount <= 0) { alert('Please enter a valid amount.'); txAmount.focus(); return; }
  if (!date) { alert('Please select a date.'); txDate.focus(); return; }

  const newTx = {
    id: Date.now().toString(),
    description,
    amount,
    type,
    category,
    date
  };

  transactions.push(newTx);
  saveTransactions(transactions);

  // Reset form
  txDesc.value   = '';
  txAmount.value = '';
  txType.value   = 'income';

  render();
}

/** Delete a transaction by id */
function deleteTransaction(id) {
  if (!confirm('Delete this transaction?')) return;
  transactions = transactions.filter(tx => tx.id !== id);
  saveTransactions(transactions);
  render();
}

/** Clear all transactions */
function clearAll() {
  if (!confirm('Delete ALL transactions? This cannot be undone.')) return;
  transactions = [];
  saveTransactions(transactions);
  render();
}

/* =============================================
   CSV EXPORT
   ============================================= */
function exportCSV() {
  if (transactions.length === 0) { alert('No transactions to export.'); return; }

  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount (INR)'];
  const rows = transactions.map(tx => [
    tx.date,
    `"${tx.description.replace(/"/g, '""')}"`,
    tx.category,
    tx.type,
    tx.amount.toFixed(2)
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'expense_tracker_data.csv';
  a.click();
  URL.revokeObjectURL(url);
}

/* =============================================
   HELPERS
   ============================================= */

/** Format YYYY-MM-DD → DD Mon YYYY */
function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Escape HTML to prevent XSS */
function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/** Show current date in header */
function showCurrentDate() {
  const now = new Date();
  currentDateEl.textContent = now.toLocaleDateString('en-IN', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
  });
}

/** Set default date input to today */
function setDefaultDate() {
  const today = new Date().toISOString().split('T')[0];
  txDate.value = today;
}

/* =============================================
   EVENT LISTENERS
   ============================================= */
btnAdd.addEventListener('click', addTransaction);
btnClear.addEventListener('click', clearAll);
btnExport.addEventListener('click', exportCSV);

filterType.addEventListener('change', render);
filterCat.addEventListener('change', render);
filterMonth.addEventListener('change', render);

// Allow pressing Enter in form fields
[txDesc, txAmount, txDate].forEach(el => {
  el.addEventListener('keydown', e => { if (e.key === 'Enter') addTransaction(); });
});

/* =============================================
   INIT
   ============================================= */
showCurrentDate();
setDefaultDate();
render();
