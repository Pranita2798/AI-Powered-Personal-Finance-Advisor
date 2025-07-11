import React from 'react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useFinanceStore } from '../store/financeStore';

export const RecentTransactions: React.FC = () => {
  const { transactions } = useFinanceStore();

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h3>
      <div className="space-y-4">
        {recentTransactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No transactions yet. Add your first transaction!</p>
        ) : (
          recentTransactions.map((transaction, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <ArrowDownCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};