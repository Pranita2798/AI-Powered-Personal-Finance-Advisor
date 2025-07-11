import React from 'react';
import { Bot, TrendingUp, AlertTriangle, Lightbulb, Target } from 'lucide-react';
import { useFinanceStore } from '../store/financeStore';

export const AIInsights: React.FC = () => {
  const { transactions, budgets, goals } = useFinanceStore();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate category spending
  const categorySpending = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const topSpendingCategory = Object.entries(categorySpending)
    .sort(([,a], [,b]) => b - a)[0];

  // Generate AI insights
  const insights = [
    {
      type: 'spending-pattern',
      icon: TrendingUp,
      title: 'Spending Pattern Analysis',
      description: monthlyExpenses > monthlyIncome 
        ? `You're spending $${(monthlyExpenses - monthlyIncome).toFixed(2)} more than you earn this month. Consider reviewing your expenses.`
        : `Great job! You're saving $${(monthlyIncome - monthlyExpenses).toFixed(2)} this month.`,
      color: monthlyExpenses > monthlyIncome ? 'text-red-600' : 'text-green-600',
      bgColor: monthlyExpenses > monthlyIncome ? 'bg-red-50' : 'bg-green-50',
    },
    {
      type: 'category-insight',
      icon: Lightbulb,
      title: 'Category Insights',
      description: topSpendingCategory 
        ? `Your highest spending category is "${topSpendingCategory[0]}" with $${topSpendingCategory[1].toFixed(2)} this month.`
        : 'No expense data available for category analysis.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      type: 'budget-alert',
      icon: AlertTriangle,
      title: 'Budget Alerts',
      description: budgets.length > 0 
        ? `You have ${budgets.length} active budget${budgets.length > 1 ? 's' : ''} set. Monitor your spending to stay on track.`
        : 'Consider setting up budgets to better control your spending.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      type: 'goals-progress',
      icon: Target,
      title: 'Goal Progress',
      description: goals.length > 0 
        ? `You have ${goals.filter(g => g.progress < g.target).length} active goal${goals.filter(g => g.progress < g.target).length !== 1 ? 's' : ''} in progress. Keep up the momentum!`
        : 'Setting financial goals can help you stay motivated and organized.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const recommendations = [
    {
      title: 'Emergency Fund Priority',
      description: 'Build an emergency fund covering 3-6 months of expenses before focusing on other goals.',
      priority: 'high',
    },
    {
      title: 'Automate Savings',
      description: 'Set up automatic transfers to your savings account to make saving effortless.',
      priority: 'medium',
    },
    {
      title: 'Review Subscriptions',
      description: 'Regularly review and cancel unused subscriptions to reduce recurring expenses.',
      priority: 'medium',
    },
    {
      title: 'Track Daily Expenses',
      description: 'Log small daily expenses to get a complete picture of your spending habits.',
      priority: 'low',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Bot className="w-8 h-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Financial Insights</h2>
          <p className="text-gray-600">Personalized analysis and recommendations</p>
        </div>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((insight, index) => (
          <div key={index} className={`${insight.bgColor} rounded-xl border-2 border-transparent hover:border-opacity-50 hover:border-current p-6 transition-all duration-200`}>
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                <insight.icon className={`w-5 h-5 ${insight.color}`} />
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold ${insight.color} mb-2`}>{insight.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Smart Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <span>Smart Recommendations</span>
        </h3>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                rec.priority === 'high' ? 'bg-red-500' : 
                rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
              }`} />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{rec.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                  rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                  rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {rec.priority} priority
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Health Score */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Financial Health Score</h3>
        <div className="flex items-center space-x-6">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
                strokeDasharray="75, 100"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">75</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-lg font-semibold text-gray-900">Good Financial Health</p>
            <p className="text-sm text-gray-600 mt-1">
              Your financial habits are on track. Keep monitoring your expenses and working towards your goals.
            </p>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Spending Control</span>
                <span className="font-medium text-green-600">Good</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Goal Progress</span>
                <span className="font-medium text-blue-600">On Track</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Budget Adherence</span>
                <span className="font-medium text-yellow-600">Fair</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};