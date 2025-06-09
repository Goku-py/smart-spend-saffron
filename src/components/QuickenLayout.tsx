import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  CreditCard, 
  Target, 
  BarChart3, 
  Bell, 
  User, 
  TrendingUp,
  Wallet,
  Settings,
  Menu,
  X,
  Search,
  Plus
} from 'lucide-react';
import '../styles/quicken-theme.css';

interface QuickenLayoutProps {
  children: React.ReactNode;
}

const QuickenLayout: React.FC<QuickenLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/accounts', label: 'Accounts', icon: Wallet },
    { path: '/transactions', label: 'Transactions', icon: CreditCard },
    { path: '/budgets', label: 'Budgets', icon: Target },
    { path: '/investments', label: 'Investments', icon: TrendingUp },
    { path: '/reports', label: 'Reports', icon: BarChart3 },
    { path: '/bills', label: 'Bills & Reminders', icon: Bell, badge: 3 },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <div className="quicken-layout">
      {/* Mobile Menu Button */}
      <button
        className="quicken-mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 1001,
          background: 'var(--primary-navy)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-2)',
          display: 'none',
          cursor: 'pointer'
        }}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`quicken-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="quicken-logo">
          <div className="quicken-logo-icon">
            $
          </div>
          <div className="quicken-logo-text">
            FinanceTracker
          </div>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="quicken-nav">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.path} className="quicken-nav-item">
                  <a
                    href={item.path}
                    className={`quicken-nav-link ${isActivePath(item.path) ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                  >
                    <IconComponent className="quicken-nav-icon" />
                    {item.label}
                    {item.badge && (
                      <span className="quicken-nav-badge">{item.badge}</span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Quick Actions in Sidebar */}
        <div style={{ marginTop: 'var(--space-8)', paddingTop: 'var(--space-6)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button 
            className="quicken-btn quicken-btn-secondary"
            style={{ 
              width: '100%', 
              backgroundColor: 'var(--secondary-blue)',
              border: 'none',
              color: 'white'
            }}
            onClick={() => navigate('/transactions/new')}
          >
            <Plus className="quicken-btn-icon" />
            Add Transaction
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="quicken-main">
        {/* Top Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-8)',
          background: 'white',
          padding: 'var(--space-4) var(--space-6)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {/* Search */}
          <div className="quicken-search" style={{ marginBottom: 0, maxWidth: '400px', flex: 1 }}>
            <Search className="quicken-search-icon" />
            <input
              type="text"
              placeholder="Search transactions, accounts, or categories..."
              className="quicken-search-input"
            />
          </div>

          {/* User Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <button className="quicken-btn quicken-btn-ghost">
              <Bell size={16} />
            </button>
            <button className="quicken-btn quicken-btn-primary">
              <Plus size={16} />
              Quick Add
            </button>
          </div>
        </div>

        {/* Page Content */}
        {children}
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            display: 'none'
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <style jsx>{`
        @media (max-width: 1024px) {
          .quicken-mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default QuickenLayout;