import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle } from 'lucide-react';
import { useFinanceStore } from '../store/financeStore';
import { SpendingChart } from './SpendingChart';
import { RecentTransactions } from './RecentTransactions';

export const Dashboard: React.FC = () => {
  const { transactions, budgets, goals } = useFinanceStore();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = transactions.reduce((sum, t) => 
    sum + (t.type === 'income' ? t.amount : -t.amount), 0
  );

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const budgetUsed = (monthlyExpenses / totalBudget) * 100;

  const activeGoals = goals.filter(g => g.progress < g.target);
  const completedGoals = goals.filter(g => g.progress >= g.target);

  const stats = [
    {
      title: 'Total Balance',
      value: `$${totalBalance.toFixed(2)}`,
      icon: DollarSign,
      color: totalBalance >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: totalBalance >= 0 ? 'bg-green-100' : 'bg-red-100',
    },
    {
      title: 'Monthly Income',
      value: `$${monthlyIncome.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Monthly Expenses',
      value: `$${monthlyExpenses.toFixed(2)}`,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Budget Used',
      value: `${budgetUsed.toFixed(1)}%`,
      icon: budgetUsed > 90 ? AlertTriangle : Target,
      color: budgetUsed > 90 ? 'text-red-600' : 'text-green-600',
      bgColor: budgetUsed > 90 ? 'bg-red-100' : 'bg-green-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart />
        <RecentTransactions />
      </div>

      {/* Goals Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Goals Progress</h3>
        <div className="space-y-4">
          {activeGoals.slice(0, 3).map((goal, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{goal.name}</h4>
                <div className="mt-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((goal.progress / goal.target) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div className="ml-4 text-right">
                <p className="text-sm text-gray-600">${goal.progress.toFixed(2)} / ${goal.target.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{((goal.progress / goal.target) * 100).toFixed(1)}%</p>
              </div>
            </div>
          ))}
          {completedGoals.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-green-600 font-medium">
                🎉 {completedGoals.length} goal{completedGoals.length > 1 ? 's' : ''} completed!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};