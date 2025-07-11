import React from 'react';
import { BarChart3, CreditCard, Target, TrendingUp, Bot } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'budgets', label: 'Budgets', icon: TrendingUp },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'insights', label: 'AI Insights', icon: Bot },
  ];

  return (
    <nav className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex flex-wrap gap-2 p-4">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === id
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Icon size={18} />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};