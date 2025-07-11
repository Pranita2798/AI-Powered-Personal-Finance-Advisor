import React from 'react';
import { useFinanceStore } from '../store/financeStore';

export const SpendingChart: React.FC = () => {
  const { transactions } = useFinanceStore();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Get last 6 months of data
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - i, 1);
    months.push({
      name: date.toLocaleDateString('en-US', { month: 'short' }),
      month: date.getMonth(),
      year: date.getFullYear(),
    });
  }

  const chartData = months.map(month => {
    const monthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === month.month && date.getFullYear() === month.year;
    });

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      month: month.name,
      income,
      expenses,
    };
  });

  const maxValue = Math.max(...chartData.map(d => Math.max(d.income, d.expenses)));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Monthly Overview</h3>
      <div className="space-y-4">
        {chartData.map((data, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">{data.month}</span>
              <span className="text-gray-600">
                Income: ${data.income.toFixed(0)} | Expenses: ${data.expenses.toFixed(0)}
              </span>
            </div>
            <div className="flex space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-green-500 h-full transition-all duration-500"
                  style={{ width: `${(data.income / maxValue) * 100}%` }}
                />
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-red-500 h-full transition-all duration-500"
                  style={{ width: `${(data.expenses / maxValue) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
        <div className="flex justify-center space-x-6 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Income</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Expenses</span>
          </div>
        </div>
      </div>
    </div>
  );
};