import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
}

interface Budget {
  id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'weekly';
}

interface Goal {
  id: string;
  name: string;
  target: number;
  progress: number;
  deadline: string;
  description: string;
}

interface FinanceStore {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  addTransaction: (transaction: Transaction) => void;
  addBudget: (budget: Budget) => void;
  addGoal: (goal: Goal) => void;
  updateGoalProgress: (goalId: string, amount: number) => void;
}

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set) => ({
      transactions: [],
      budgets: [],
      goals: [],
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [...state.transactions, transaction],
        })),
      addBudget: (budget) =>
        set((state) => ({
          budgets: [...state.budgets, budget],
        })),
      addGoal: (goal) =>
        set((state) => ({
          goals: [...state.goals, goal],
        })),
      updateGoalProgress: (goalId, amount) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === goalId
              ? { ...goal, progress: Math.min(goal.progress + amount, goal.target) }
              : goal
          ),
        })),
    }),
    {
      name: 'finance-store',
    }
  )
);