import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { TransactionForm } from './components/TransactionForm';
import { BudgetManager } from './components/BudgetManager';
import { GoalTracker } from './components/GoalTracker';
import { AIInsights } from './components/AIInsights';
import { Navigation } from './components/Navigation';
import { useFinanceStore } from './store/financeStore';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { transactions, budgets, goals } = useFinanceStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <TransactionForm />;
      case 'budgets':
        return <BudgetManager />;
      case 'goals':
        return <GoalTracker />;
      case 'insights':
        return <AIInsights />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-6">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                AI Finance Advisor
              </h1>
              <p className="text-gray-600 mt-1">
                Your intelligent financial companion
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Balance</p>
                <p className="text-xl font-bold text-green-600">
                  ${transactions.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </header>

        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="mt-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;