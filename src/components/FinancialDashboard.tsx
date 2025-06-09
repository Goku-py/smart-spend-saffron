import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Target,
  PieChart,
  BarChart3,
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import QuickenLayout from './QuickenLayout';

const FinancialDashboard: React.FC = () => {
  // Sample data - in real app this would come from API
  const accountSummary = {
    totalBalance: 45750.32,
    monthlyIncome: 8500.00,
    monthlyExpenses: 6234.50,
    monthlyChange: 2265.50,
    changePercentage: 5.2
  };

  const accounts = [
    { name: 'Checking Account', balance: 12450.32, type: 'checking', change: 234.50 },
    { name: 'Savings Account', balance: 28300.00, type: 'savings', change: 1200.00 },
    { name: 'Credit Card', balance: -2340.50, type: 'credit', change: -156.20 },
    { name: 'Investment Account', balance: 7340.50, type: 'investment', change: 987.20 }
  ];

  const recentTransactions = [
    { id: 1, description: 'Grocery Store', amount: -156.78, category: 'Food', date: '2024-01-09', account: 'Checking' },
    { id: 2, description: 'Salary Deposit', amount: 4250.00, category: 'Income', date: '2024-01-08', account: 'Checking' },
    { id: 3, description: 'Electric Bill', amount: -89.45, category: 'Utilities', date: '2024-01-07', account: 'Checking' },
    { id: 4, description: 'Gas Station', amount: -45.20, category: 'Transportation', date: '2024-01-07', account: 'Credit Card' },
    { id: 5, description: 'Restaurant', amount: -67.89, category: 'Dining', date: '2024-01-06', account: 'Credit Card' }
  ];

  const budgetCategories = [
    { name: 'Food & Dining', spent: 456.78, budget: 600.00, percentage: 76 },
    { name: 'Transportation', spent: 234.50, budget: 400.00, percentage: 59 },
    { name: 'Utilities', spent: 189.45, budget: 200.00, percentage: 95 },
    { name: 'Entertainment', spent: 123.67, budget: 300.00, percentage: 41 },
    { name: 'Shopping', spent: 345.89, budget: 250.00, percentage: 138 }
  ];

  const upcomingBills = [
    { name: 'Mortgage Payment', amount: 1850.00, dueDate: '2024-01-15', status: 'upcoming' },
    { name: 'Car Insurance', amount: 156.78, dueDate: '2024-01-18', status: 'upcoming' },
    { name: 'Internet Bill', amount: 79.99, dueDate: '2024-01-20', status: 'upcoming' },
    { name: 'Phone Bill', amount: 89.99, dueDate: '2024-01-12', status: 'overdue' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking': return <DollarSign size={20} />;
      case 'savings': return <TrendingUp size={20} />;
      case 'credit': return <CreditCard size={20} />;
      case 'investment': return <BarChart3 size={20} />;
      default: return <DollarSign size={20} />;
    }
  };

  return (
    <QuickenLayout>
      {/* Financial Summary Cards */}
      <div className="quicken-summary-grid">
        <div className="quicken-card quicken-summary-card">
          <div className="quicken-card-content">
            <div className="quicken-summary-value">
              {formatCurrency(accountSummary.totalBalance)}
            </div>
            <div className="quicken-summary-label">Total Balance</div>
            <div className={`quicken-summary-change ${accountSummary.changePercentage > 0 ? 'positive' : 'negative'}`}>
              {accountSummary.changePercentage > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span style={{ marginLeft: 'var(--space-1)' }}>
                {accountSummary.changePercentage}% this month
              </span>
            </div>
          </div>
        </div>

        <div className="quicken-card quicken-summary-card">
          <div className="quicken-card-content">
            <div className="quicken-summary-value">
              {formatCurrency(accountSummary.monthlyIncome)}
            </div>
            <div className="quicken-summary-label">Monthly Income</div>
            <div className="quicken-summary-change positive">
              <TrendingUp size={16} />
              <span style={{ marginLeft: 'var(--space-1)' }}>
                +{formatCurrency(accountSummary.monthlyChange)}
              </span>
            </div>
          </div>
        </div>

        <div className="quicken-card quicken-summary-card">
          <div className="quicken-card-content">
            <div className="quicken-summary-value">
              {formatCurrency(accountSummary.monthlyExpenses)}
            </div>
            <div className="quicken-summary-label">Monthly Expenses</div>
            <div className="quicken-summary-change negative">
              <TrendingDown size={16} />
              <span style={{ marginLeft: 'var(--space-1)' }}>
                vs last month
              </span>
            </div>
          </div>
        </div>

        <div className="quicken-card quicken-summary-card">
          <div className="quicken-card-content">
            <div className="quicken-summary-value">
              {formatCurrency(accountSummary.monthlyIncome - accountSummary.monthlyExpenses)}
            </div>
            <div className="quicken-summary-label">Net Income</div>
            <div className="quicken-summary-change positive">
              <TrendingUp size={16} />
              <span style={{ marginLeft: 'var(--space-1)' }}>
                Healthy savings rate
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quicken-quick-actions">
        <a href="/transactions/new" className="quicken-quick-action">
          <div className="quicken-quick-action-icon">
            <CreditCard />
          </div>
          <div className="quicken-quick-action-title">Add Transaction</div>
          <div className="quicken-quick-action-subtitle">Record income or expense</div>
        </a>

        <a href="/transfers/new" className="quicken-quick-action">
          <div className="quicken-quick-action-icon">
            <TrendingUp />
          </div>
          <div className="quicken-quick-action-title">Transfer Money</div>
          <div className="quicken-quick-action-subtitle">Between accounts</div>
        </a>

        <a href="/budgets" className="quicken-quick-action">
          <div className="quicken-quick-action-icon">
            <Target />
          </div>
          <div className="quicken-quick-action-title">Manage Budgets</div>
          <div className="quicken-quick-action-subtitle">Track spending goals</div>
        </a>

        <a href="/reports" className="quicken-quick-action">
          <div className="quicken-quick-action-icon">
            <PieChart />
          </div>
          <div className="quicken-quick-action-title">View Reports</div>
          <div className="quicken-quick-action-subtitle">Analyze spending patterns</div>
        </a>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        {/* Accounts Overview */}
        <div className="quicken-card">
          <div className="quicken-card-header">
            <h2 className="quicken-card-title">
              <Wallet size={20} style={{ marginRight: 'var(--space-2)' }} />
              Account Balances
            </h2>
            <p className="quicken-card-subtitle">Current balances across all accounts</p>
          </div>
          <div className="quicken-card-content">
            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
              {accounts.map((account, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-4)',
                  backgroundColor: 'var(--gray-50)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--gray-200)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      marginRight: 'var(--space-3)',
                      color: 'var(--primary-navy)'
                    }}>
                      {getAccountIcon(account.type)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>
                        {account.name}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                        {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontWeight: 700,
                      color: account.balance < 0 ? 'var(--error)' : 'var(--gray-900)',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {formatCurrency(account.balance)}
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      color: account.change > 0 ? 'var(--success)' : 'var(--error)'
                    }}>
                      {account.change > 0 ? '+' : ''}{formatCurrency(account.change)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Bills */}
        <div className="quicken-card">
          <div className="quicken-card-header">
            <h2 className="quicken-card-title">
              <Calendar size={20} style={{ marginRight: 'var(--space-2)' }} />
              Upcoming Bills
            </h2>
            <p className="quicken-card-subtitle">Bills due in the next 30 days</p>
          </div>
          <div className="quicken-card-content">
            <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
              {upcomingBills.map((bill, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-3)',
                  borderLeft: `3px solid ${bill.status === 'overdue' ? 'var(--error)' : 'var(--primary-navy)'}`,
                  backgroundColor: bill.status === 'overdue' ? 'rgba(239, 68, 68, 0.05)' : 'var(--gray-50)',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      {bill.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>
                      Due {bill.dueDate}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                      {formatCurrency(bill.amount)}
                    </div>
                    <div style={{ fontSize: '0.75rem' }}>
                      {bill.status === 'overdue' ? (
                        <span className="quicken-status quicken-status-error">
                          <AlertCircle size={12} style={{ marginRight: 'var(--space-1)' }} />
                          Overdue
                        </span>
                      ) : (
                        <span className="quicken-status quicken-status-success">
                          <CheckCircle size={12} style={{ marginRight: 'var(--space-1)' }} />
                          On Time
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions and Budget Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        {/* Recent Transactions */}
        <div className="quicken-card">
          <div className="quicken-card-header">
            <h2 className="quicken-card-title">
              <CreditCard size={20} style={{ marginRight: 'var(--space-2)' }} />
              Recent Transactions
            </h2>
            <p className="quicken-card-subtitle">Latest account activity</p>
          </div>
          <div className="quicken-card-content">
            <table className="quicken-table">
              <thead className="quicken-table-header">
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="quicken-table-row">
                    <td className="quicken-table-cell">
                      <div style={{ fontWeight: 600 }}>{transaction.description}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>
                        {transaction.account}
                      </div>
                    </td>
                    <td className="quicken-table-cell">{transaction.category}</td>
                    <td className="quicken-table-cell">
                      <span style={{
                        fontWeight: 600,
                        color: transaction.amount > 0 ? 'var(--success)' : 'var(--error)',
                        fontFamily: 'var(--font-mono)'
                      }}>
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="quicken-table-cell">{transaction.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Budget Overview */}
        <div className="quicken-card">
          <div className="quicken-card-header">
            <h2 className="quicken-card-title">
              <Target size={20} style={{ marginRight: 'var(--space-2)' }} />
              Budget Overview
            </h2>
            <p className="quicken-card-subtitle">Monthly spending vs budget</p>
          </div>
          <div className="quicken-card-content">
            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
              {budgetCategories.map((category, index) => (
                <div key={index}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--space-2)'
                  }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      {category.name}
                    </span>
                    <span style={{ fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>
                      {formatCurrency(category.spent)} / {formatCurrency(category.budget)}
                    </span>
                  </div>
                  <div className="quicken-progress">
                    <div 
                      className="quicken-progress-bar"
                      style={{
                        width: `${Math.min(category.percentage, 100)}%`,
                        backgroundColor: category.percentage > 100 ? 'var(--error)' : 
                                       category.percentage > 80 ? 'var(--warning)' : 'var(--success)'
                      }}
                    />
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: category.percentage > 100 ? 'var(--error)' : 'var(--gray-600)',
                    marginTop: 'var(--space-1)'
                  }}>
                    {category.percentage}% used
                    {category.percentage > 100 && (
                      <span style={{ marginLeft: 'var(--space-2)', fontWeight: 600 }}>
                        Over budget by {formatCurrency(category.spent - category.budget)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </QuickenLayout>
  );
};

export default FinancialDashboard;