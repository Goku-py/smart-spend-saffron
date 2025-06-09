import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  DollarSign,
  CreditCard,
  TrendingUp,
  Building,
  Wallet
} from 'lucide-react';
import QuickenLayout from './QuickenLayout';

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'loan';
  balance: number;
  institution: string;
  accountNumber: string;
  isActive: boolean;
  lastUpdated: string;
}

const AccountManagement: React.FC = () => {
  const [showBalances, setShowBalances] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const accounts: Account[] = [
    {
      id: '1',
      name: 'Primary Checking',
      type: 'checking',
      balance: 12450.32,
      institution: 'Chase Bank',
      accountNumber: '****1234',
      isActive: true,
      lastUpdated: '2024-01-09'
    },
    {
      id: '2',
      name: 'Emergency Savings',
      type: 'savings',
      balance: 28300.00,
      institution: 'Bank of America',
      accountNumber: '****5678',
      isActive: true,
      lastUpdated: '2024-01-09'
    },
    {
      id: '3',
      name: 'Travel Rewards Card',
      type: 'credit',
      balance: -2340.50,
      institution: 'Capital One',
      accountNumber: '****9012',
      isActive: true,
      lastUpdated: '2024-01-08'
    },
    {
      id: '4',
      name: '401(k) Investment',
      type: 'investment',
      balance: 87340.50,
      institution: 'Fidelity',
      accountNumber: '****3456',
      isActive: true,
      lastUpdated: '2024-01-05'
    },
    {
      id: '5',
      name: 'Auto Loan',
      type: 'loan',
      balance: -18750.00,
      institution: 'Wells Fargo',
      accountNumber: '****7890',
      isActive: true,
      lastUpdated: '2024-01-01'
    }
  ];

  const formatCurrency = (amount: number) => {
    if (!showBalances) return '****';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking': return <DollarSign size={24} />;
      case 'savings': return <TrendingUp size={24} />;
      case 'credit': return <CreditCard size={24} />;
      case 'investment': return <TrendingUp size={24} />;
      case 'loan': return <Building size={24} />;
      default: return <Wallet size={24} />;
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'checking': return 'var(--primary-navy)';
      case 'savings': return 'var(--success)';
      case 'credit': return 'var(--warning)';
      case 'investment': return 'var(--info)';
      case 'loan': return 'var(--error)';
      default: return 'var(--gray-600)';
    }
  };

  const getTotalByType = (type: string) => {
    return accounts
      .filter(account => account.type === type)
      .reduce((sum, account) => sum + account.balance, 0);
  };

  const accountTypes = [
    { type: 'checking', label: 'Checking Accounts', total: getTotalByType('checking') },
    { type: 'savings', label: 'Savings Accounts', total: getTotalByType('savings') },
    { type: 'credit', label: 'Credit Cards', total: getTotalByType('credit') },
    { type: 'investment', label: 'Investment Accounts', total: getTotalByType('investment') },
    { type: 'loan', label: 'Loans', total: getTotalByType('loan') }
  ];

  return (
    <QuickenLayout>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-8)'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            color: 'var(--gray-900)', 
            margin: 0,
            marginBottom: 'var(--space-2)'
          }}>
            Account Management
          </h1>
          <p style={{ color: 'var(--gray-600)', margin: 0 }}>
            Manage all your financial accounts in one place
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button
            className="quicken-btn quicken-btn-ghost"
            onClick={() => setShowBalances(!showBalances)}
          >
            {showBalances ? <EyeOff className="quicken-btn-icon" /> : <Eye className="quicken-btn-icon" />}
            {showBalances ? 'Hide' : 'Show'} Balances
          </button>
          <button
            className="quicken-btn quicken-btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="quicken-btn-icon" />
            Add Account
          </button>
        </div>
      </div>

      {/* Account Type Summary */}
      <div className="quicken-summary-grid" style={{ marginBottom: 'var(--space-8)' }}>
        {accountTypes.map((accountType) => (
          <div key={accountType.type} className="quicken-card quicken-summary-card">
            <div className="quicken-card-content">
              <div className="quicken-summary-value" style={{
                color: getAccountTypeColor(accountType.type)
              }}>
                {formatCurrency(accountType.total)}
              </div>
              <div className="quicken-summary-label">{accountType.label}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginTop: 'var(--space-2)' }}>
                {accounts.filter(acc => acc.type === accountType.type).length} account(s)
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Accounts List */}
      <div className="quicken-card">
        <div className="quicken-card-header">
          <h2 className="quicken-card-title">
            <Wallet size={20} style={{ marginRight: 'var(--space-2)' }} />
            All Accounts
          </h2>
          <p className="quicken-card-subtitle">
            {accounts.length} accounts • Last updated today
          </p>
        </div>
        <div className="quicken-card-content">
          <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
            {accounts.map((account) => (
              <div
                key={account.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-5)',
                  backgroundColor: 'var(--gray-50)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--gray-200)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setSelectedAccount(account)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--white)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--gray-50)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    marginRight: 'var(--space-4)',
                    color: getAccountTypeColor(account.type),
                    backgroundColor: 'var(--white)',
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--gray-200)'
                  }}>
                    {getAccountIcon(account.type)}
                  </div>
                  <div>
                    <div style={{ 
                      fontWeight: 600, 
                      color: 'var(--gray-900)',
                      marginBottom: 'var(--space-1)'
                    }}>
                      {account.name}
                    </div>
                    <div style={{ 
                      fontSize: '0.875rem', 
                      color: 'var(--gray-600)',
                      marginBottom: 'var(--space-1)'
                    }}>
                      {account.institution} • {account.accountNumber}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                      Last updated: {account.lastUpdated}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontWeight: 700,
                      fontSize: '1.25rem',
                      color: account.balance < 0 ? 'var(--error)' : 'var(--gray-900)',
                      fontFamily: 'var(--font-mono)',
                      marginBottom: 'var(--space-1)'
                    }}>
                      {account.balance < 0 && account.type !== 'loan' ? '-' : ''}
                      {formatCurrency(account.balance)}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--gray-600)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {account.type.replace('_', ' ')}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button
                      className="quicken-btn quicken-btn-ghost"
                      style={{ padding: 'var(--space-2)' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle edit
                      }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="quicken-btn quicken-btn-ghost"
                      style={{ 
                        padding: 'var(--space-2)',
                        color: 'var(--error)'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle delete
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Account Details Modal */}
      {selectedAccount && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="quicken-card" style={{
            width: '90%',
            maxWidth: '600px',
            margin: 0
          }}>
            <div className="quicken-card-header">
              <h2 className="quicken-card-title">Account Details</h2>
              <button
                className="quicken-btn quicken-btn-ghost"
                style={{ position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)' }}
                onClick={() => setSelectedAccount(null)}
              >
                ×
              </button>
            </div>
            <div className="quicken-card-content">
              <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                <div>
                  <label className="quicken-label">Account Name</label>
                  <div style={{ fontWeight: 600 }}>{selectedAccount.name}</div>
                </div>
                <div>
                  <label className="quicken-label">Institution</label>
                  <div>{selectedAccount.institution}</div>
                </div>
                <div>
                  <label className="quicken-label">Account Number</label>
                  <div>{selectedAccount.accountNumber}</div>
                </div>
                <div>
                  <label className="quicken-label">Current Balance</label>
                  <div style={{
                    fontWeight: 700,
                    fontSize: '1.5rem',
                    color: selectedAccount.balance < 0 ? 'var(--error)' : 'var(--success)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {formatCurrency(selectedAccount.balance)}
                  </div>
                </div>
                <div>
                  <label className="quicken-label">Account Type</label>
                  <div style={{ textTransform: 'capitalize' }}>
                    {selectedAccount.type.replace('_', ' ')}
                  </div>
                </div>
                <div>
                  <label className="quicken-label">Status</label>
                  <span className={`quicken-status ${selectedAccount.isActive ? 'quicken-status-success' : 'quicken-status-error'}`}>
                    {selectedAccount.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
            <div className="quicken-card-footer">
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <button className="quicken-btn quicken-btn-primary">
                  <Edit className="quicken-btn-icon" />
                  Edit Account
                </button>
                <button className="quicken-btn quicken-btn-secondary">
                  View Transactions
                </button>
                <button 
                  className="quicken-btn quicken-btn-ghost"
                  style={{ color: 'var(--error)', marginLeft: 'auto' }}
                >
                  <Trash2 className="quicken-btn-icon" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </QuickenLayout>
  );
};

export default AccountManagement;