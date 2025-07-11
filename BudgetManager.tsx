import React, { useState } from 'react';
import { Plus, X, AlertTriangle } from 'lucide-react';
import { useFinanceStore } from '../store/financeStore';

export const BudgetManager: React.FC = () => {
  const { budgets, addBudget, transactions } = useFinanceStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly' as 'monthly' | 'weekly',
  });

  const categories = ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.category && formData.amount) {
      addBudget({
        ...formData,
        amount: parseFloat(formData.amount),
        id: Date.now().toString(),
      });
      setFormData({ category: '', amount: '', period: 'monthly' });
      setShowForm(false);
    }
  };

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const getBudgetSpent = (category: string) => {
    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'expense' && 
               t.category === category &&
               date.getMonth() === currentMonth &&
               date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Budget Manager</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Budget</span>
        </button>
      </div>

      {/* Budget Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Add Budget</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                <select
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value as 'monthly' | 'weekly' })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Budget List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No budgets set yet. Create your first budget to start tracking your spending!</p>
          </div>
        ) : (
          budgets.map((budget, index) => {
            const spent = getBudgetSpent(budget.category);
            const percentage = (spent / budget.amount) * 100;
            const isOverBudget = percentage > 100;
            const isNearLimit = percentage > 80;

            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{budget.category}</h3>
                  {isOverBudget && (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Spent</span>
                    <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
                      ${spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        isOverBudget ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Period: {budget.period}</span>
                    <span className={`font-medium ${
                      isOverBudget ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {percentage.toFixed(1)}%
                    </span>
                  </div>

                  {isOverBudget && (
                    <div className="mt-3 p-3 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-800">
                        ⚠️ Over budget by ${(spent - budget.amount).toFixed(2)}
                      </p>
                    </div>
                  )}

                  {isNearLimit && !isOverBudget && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        🚨 Approaching budget limit
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};