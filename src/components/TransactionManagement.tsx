import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2,
  Calendar,
  DollarSign,
  Tag,
  Building
} from 'lucide-react';
import QuickenLayout from './QuickenLayout';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  account: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  status: 'cleared' | 'pending' | 'reconciled';
  payee?: string;
  memo?: string;
}

const TransactionManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [dateRange, setDateRange] = useState('30');
  const [showFilters, setShowFilters] = useState(false);

  const transactions: Transaction[] = [
    {
      id: '1',
      date: '2024-01-09',
      description: 'Grocery Store Purchase',
      category: 'Food & Dining',
      account: 'Checking Account',
      amount: -156.78,
      type: 'expense',
      status: 'cleared',
      payee: 'Whole Foods Market',
      memo: 'Weekly groceries'
    },
    {
      id: '2',
      date: '2024-01-08',
      description: 'Salary Deposit',
      category: 'Income',
      account: 'Checking Account',
      amount: 4250.00,
      type: 'income',
      status: 'cleared',
      payee: 'ABC Corporation',
      memo: 'Bi-weekly salary'
    },
    {
      id: '3',
      date: '2024-01-07',
      description: 'Electric Bill Payment',
      category: 'Utilities',
      account: 'Checking Account',
      amount: -89.45,
      type: 'expense',
      status: 'pending',
      payee: 'City Electric Company',
      memo: 'Monthly electric bill'
    },
    {
      id: '4',
      date: '2024-01-07',
      description: 'Gas Station',
      category: 'Transportation',
      account: 'Credit Card',
      amount: -45.20,
      type: 'expense',
      status: 'cleared',
      payee: 'Shell Gas Station',
      memo: 'Fuel purchase'
    },
    {
      id: '5',
      date: '2024-01-06',
      description: 'Restaurant Dinner',
      category: 'Food & Dining',
      account: 'Credit Card',
      amount: -67.89,
      type: 'expense',
      status: 'cleared',
      payee: 'Italian Bistro',
      memo: 'Date night dinner'
    },
    {
      id: '6',
      date: '2024-01-05',
      description: 'Transfer to Savings',
      category: 'Transfer',
      account: 'Checking Account',
      amount: -500.00,
      type: 'transfer',
      status: 'cleared',
      payee: 'Savings Account',
      memo: 'Monthly savings transfer'
    },
    {
      id: '7',
      date: '2024-01-04',
      description: 'Online Shopping',
      category: 'Shopping',
      account: 'Credit Card',
      amount: -234.56,
      type: 'expense',
      status: 'cleared',
      payee: 'Amazon',
      memo: 'Home office supplies'
    },
    {
      id: '8',
      date: '2024-01-03',
      description: 'Coffee Shop',
      category: 'Food & Dining',
      account: 'Checking Account',
      amount: -5.75,
      type: 'expense',
      status: 'cleared',
      payee: 'Local Coffee Co.',
      memo: 'Morning coffee'
    }
  ];

  const categories = [
    'All Categories',
    'Food & Dining',
    'Transportation',
    'Utilities',
    'Shopping',
    'Income',
    'Transfer',
    'Healthcare',
    'Entertainment',
    'Education'
  ];

  const accounts = [
    'All Accounts',
    'Checking Account',
    'Savings Account',
    'Credit Card',
    'Investment Account'
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'cleared': return 'var(--success)';
      case 'pending': return 'var(--warning)';
      case 'reconciled': return 'var(--info)';
      default: return 'var(--gray-600)';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income': return <DollarSign size={16} style={{ color: 'var(--success)' }} />;
      case 'expense': return <DollarSign size={16} style={{ color: 'var(--error)' }} />;
      case 'transfer': return <DollarSign size={16} style={{ color: 'var(--info)' }} />;
      default: return <DollarSign size={16} />;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.payee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.memo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
    const matchesAccount = selectedAccount === 'all' || transaction.account === selectedAccount;
    
    return matchesSearch && matchesCategory && matchesAccount;
  });

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netAmount = totalIncome - totalExpenses;

  return (
    <QuickenLayout>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-6)'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            color: 'var(--gray-900)', 
            margin: 0,
            marginBottom: 'var(--space-2)'
          }}>
            Transactions
          </h1>
          <p style={{ color: 'var(--gray-600)', margin: 0 }}>
            Track and categorize all your financial transactions
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button className="quicken-btn quicken-btn-ghost">
            <Download className="quicken-btn-icon" />
            Export
          </button>
          <button className="quicken-btn quicken-btn-primary">
            <Plus className="quicken-btn-icon" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="quicken-summary-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="quicken-card quicken-summary-card">
          <div className="quicken-card-content">
            <div className="quicken-summary-value" style={{ color: 'var(--success)' }}>
              {formatCurrency(totalIncome)}
            </div>
            <div className="quicken-summary-label">Total Income</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginTop: 'var(--space-2)' }}>
              {filteredTransactions.filter(t => t.type === 'income').length} transactions
            </div>
          </div>
        </div>

        <div className="quicken-card quicken-summary-card">
          <div className="quicken-card-content">
            <div className="quicken-summary-value" style={{ color: 'var(--error)' }}>
              {formatCurrency(totalExpenses)}
            </div>
            <div className="quicken-summary-label">Total Expenses</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginTop: 'var(--space-2)' }}>
              {filteredTransactions.filter(t => t.type === 'expense').length} transactions
            </div>
          </div>
        </div>

        <div className="quicken-card quicken-summary-card">
          <div className="quicken-card-content">
            <div className="quicken-summary-value" style={{ 
              color: netAmount >= 0 ? 'var(--success)' : 'var(--error)' 
            }}>
              {formatCurrency(netAmount)}
            </div>
            <div className="quicken-summary-label">Net Amount</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginTop: 'var(--space-2)' }}>
              {netAmount >= 0 ? 'Positive cash flow' : 'Negative cash flow'}
            </div>
          </div>
        </div>

        <div className="quicken-card quicken-summary-card">
          <div className="quicken-card-content">
            <div className="quicken-summary-value">
              {filteredTransactions.length}
            </div>
            <div className="quicken-summary-label">Total Transactions</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginTop: 'var(--space-2)' }}>
              Last 30 days
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="quicken-card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="quicken-card-content">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 'var(--space-4)', alignItems: 'end' }}>
            {/* Search */}
            <div>
              <label className="quicken-label">Search Transactions</label>
              <div className="quicken-search" style={{ marginBottom: 0 }}>
                <Search className="quicken-search-icon" />
                <input
                  type="text"
                  placeholder="Search by description, payee, or memo..."
                  className="quicken-search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="quicken-label">Category</label>
              <select
                className="quicken-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category === 'All Categories' ? 'all' : category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Account Filter */}
            <div>
              <label className="quicken-label">Account</label>
              <select
                className="quicken-select"
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
              >
                {accounts.map((account) => (
                  <option key={account} value={account === 'All Accounts' ? 'all' : account}>
                    {account}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="quicken-label">Date Range</label>
              <select
                className="quicken-select"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
                <option value="all">All time</option>
              </select>
            </div>

            {/* Advanced Filters Toggle */}
            <button
              className="quicken-btn quicken-btn-ghost"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div style={{
              marginTop: 'var(--space-6)',
              paddingTop: 'var(--space-6)',
              borderTop: '1px solid var(--gray-200)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--space-4)'
            }}>
              <div>
                <label className="quicken-label">Amount Range</label>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <input type="number" placeholder="Min" className="quicken-input" />
                  <input type="number" placeholder="Max" className="quicken-input" />
                </div>
              </div>
              <div>
                <label className="quicken-label">Status</label>
                <select className="quicken-select">
                  <option value="all">All Statuses</option>
                  <option value="cleared">Cleared</option>
                  <option value="pending">Pending</option>
                  <option value="reconciled">Reconciled</option>
                </select>
              </div>
              <div>
                <label className="quicken-label">Transaction Type</label>
                <select className="quicken-select">
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="quicken-card">
        <div className="quicken-card-header">
          <h2 className="quicken-card-title">
            Transaction History
          </h2>
          <p className="quicken-card-subtitle">
            {filteredTransactions.length} transactions found
          </p>
        </div>
        <div className="quicken-card-content" style={{ padding: 0 }}>
          <table className="quicken-table">
            <thead className="quicken-table-header">
              <tr>
                <th style={{ width: '100px' }}>Date</th>
                <th>Description</th>
                <th style={{ width: '120px' }}>Category</th>
                <th style={{ width: '120px' }}>Account</th>
                <th style={{ width: '100px' }}>Amount</th>
                <th style={{ width: '80px' }}>Status</th>
                <th style={{ width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="quicken-table-row">
                  <td className="quicken-table-cell">
                    <div style={{ fontSize: '0.875rem' }}>
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="quicken-table-cell">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ marginRight: 'var(--space-2)' }}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                          {transaction.description}
                        </div>
                        {transaction.payee && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>
                            {transaction.payee}
                          </div>
                        )}
                        {transaction.memo && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontStyle: 'italic' }}>
                            {transaction.memo}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="quicken-table-cell">
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: 'var(--space-1) var(--space-2)',
                      backgroundColor: 'var(--gray-100)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      fontWeight: 500
                    }}>
                      <Tag size={12} style={{ marginRight: 'var(--space-1)' }} />
                      {transaction.category}
                    </span>
                  </td>
                  <td className="quicken-table-cell">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Building size={14} style={{ marginRight: 'var(--space-1)', color: 'var(--gray-400)' }} />
                      <span style={{ fontSize: '0.875rem' }}>{transaction.account}</span>
                    </div>
                  </td>
                  <td className="quicken-table-cell">
                    <span style={{
                      fontWeight: 700,
                      color: transaction.amount > 0 ? 'var(--success)' : 'var(--error)',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {transaction.amount > 0 ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="quicken-table-cell">
                    <span 
                      className={`quicken-status quicken-status-${
                        transaction.status === 'cleared' ? 'success' : 
                        transaction.status === 'pending' ? 'warning' : 'success'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="quicken-table-cell">
                    <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                      <button
                        className="quicken-btn quicken-btn-ghost"
                        style={{ padding: 'var(--space-1)' }}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="quicken-btn quicken-btn-ghost"
                        style={{ padding: 'var(--space-1)', color: 'var(--error)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </QuickenLayout>
  );
};

export default TransactionManagement;