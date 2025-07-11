import React, { useState } from 'react';
import { Plus, X, Target, Calendar } from 'lucide-react';
import { useFinanceStore } from '../store/financeStore';

export const GoalTracker: React.FC = () => {
  const { goals, addGoal, updateGoalProgress } = useFinanceStore();
  const [showForm, setShowForm] = useState(false);
  const [showAddProgress, setShowAddProgress] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    target: '',
    deadline: '',
    description: '',
  });
  const [progressAmount, setProgressAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.target && formData.deadline) {
      addGoal({
        ...formData,
        target: parseFloat(formData.target),
        progress: 0,
        id: Date.now().toString(),
      });
      setFormData({ name: '', target: '', deadline: '', description: '' });
      setShowForm(false);
    }
  };

  const handleAddProgress = (goalId: string) => {
    if (progressAmount) {
      updateGoalProgress(goalId, parseFloat(progressAmount));
      setProgressAmount('');
      setShowAddProgress(null);
    }
  };

  const activeGoals = goals.filter(g => g.progress < g.target);
  const completedGoals = goals.filter(g => g.progress >= g.target);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Financial Goals</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Goal Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Add Financial Goal</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Emergency Fund"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="5000.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Why is this goal important to you?"
                />
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
                  Add Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Active Goals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeGoals.map((goal, index) => {
              const percentage = (goal.progress / goal.target) * 100;
              const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              const isOverdue = daysLeft < 0;

              return (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{goal.name}</h4>
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">
                        ${goal.progress.toFixed(2)} / ${goal.target.toFixed(2)}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{percentage.toFixed(1)}% complete</span>
                      <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                        <Calendar size={12} />
                        <span>
                          {isOverdue ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                        </span>
                      </div>
                    </div>

                    {goal.description && (
                      <p className="text-sm text-gray-600 mt-2">{goal.description}</p>
                    )}

                    <button
                      onClick={() => setShowAddProgress(goal.id)}
                      className="w-full mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Progress
                    </button>

                    {showAddProgress === goal.id && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            step="0.01"
                            value={progressAmount}
                            onChange={(e) => setProgressAmount(e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Amount to add"
                          />
                          <button
                            onClick={() => handleAddProgress(goal.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => setShowAddProgress(null)}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Completed Goals 🎉</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedGoals.map((goal, index) => (
              <div key={index} className="bg-green-50 rounded-xl shadow-sm border border-green-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-green-900">{goal.name}</h4>
                  <div className="text-2xl">✅</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700">Target achieved!</span>
                    <span className="font-medium text-green-900">${goal.target.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-3">
                    <div className="bg-green-600 h-3 rounded-full w-full" />
                  </div>
                  {goal.description && (
                    <p className="text-sm text-green-700 mt-2">{goal.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {goals.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No financial goals yet. Set your first goal to start your journey!</p>
        </div>
      )}
    </div>
  );
};