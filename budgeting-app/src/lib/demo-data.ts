export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: "expense" | "income";
}

export interface BudgetCategory {
  name: string;
  budgeted: number;
  spent: number;
  color: string;
  icon: string;
}

export const categories: BudgetCategory[] = [
  { name: "Housing", budgeted: 1500, spent: 1500, color: "#7B61FF", icon: "Home" },
  { name: "Food & Dining", budgeted: 600, spent: 482, color: "#FF6B9D", icon: "UtensilsCrossed" },
  { name: "Transportation", budgeted: 300, spent: 215, color: "#00B4D8", icon: "Car" },
  { name: "Entertainment", budgeted: 200, spent: 167, color: "#FF9F43", icon: "Gamepad2" },
  { name: "Shopping", budgeted: 250, spent: 198, color: "#A8FF00", icon: "ShoppingBag" },
  { name: "Subscriptions", budgeted: 100, spent: 85, color: "#00D632", icon: "Repeat" },
  { name: "Health", budgeted: 150, spent: 45, color: "#FF4757", icon: "Heart" },
  { name: "Savings", budgeted: 500, spent: 500, color: "#00D632", icon: "PiggyBank" },
];

export const recentTransactions: Transaction[] = [
  { id: "1", description: "Whole Foods Market", amount: -67.42, category: "Food & Dining", date: "2026-03-13", type: "expense" },
  { id: "2", description: "Spotify Premium", amount: -10.99, category: "Subscriptions", date: "2026-03-13", type: "expense" },
  { id: "3", description: "Paycheck - Direct Deposit", amount: 2850.00, category: "Income", date: "2026-03-12", type: "income" },
  { id: "4", description: "Uber Ride", amount: -24.50, category: "Transportation", date: "2026-03-12", type: "expense" },
  { id: "5", description: "Amazon Purchase", amount: -45.99, category: "Shopping", date: "2026-03-11", type: "expense" },
  { id: "6", description: "Movie Tickets", amount: -32.00, category: "Entertainment", date: "2026-03-11", type: "expense" },
  { id: "7", description: "Gas Station", amount: -52.30, category: "Transportation", date: "2026-03-10", type: "expense" },
  { id: "8", description: "Chipotle", amount: -14.25, category: "Food & Dining", date: "2026-03-10", type: "expense" },
  { id: "9", description: "Nike Store", amount: -129.99, category: "Shopping", date: "2026-03-09", type: "expense" },
  { id: "10", description: "Gym Membership", amount: -45.00, category: "Health", date: "2026-03-09", type: "expense" },
];

export const monthlySpending = [
  { month: "Oct", spent: 2800, budget: 3600 },
  { month: "Nov", spent: 3100, budget: 3600 },
  { month: "Dec", spent: 3900, budget: 3600 },
  { month: "Jan", spent: 2950, budget: 3600 },
  { month: "Feb", spent: 3200, budget: 3600 },
  { month: "Mar", spent: 3192, budget: 3600 },
];

export const stats = {
  totalBudget: 3600,
  totalSpent: 3192,
  totalIncome: 5700,
  savingsRate: 24,
  streak: 12,
  netWorth: 14250,
  netWorthChange: 8.3,
};

export interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
  color: string;
  icon: string;
  deadline: string;
}

export const goals: Goal[] = [
  { id: "1", name: "Emergency Fund", target: 10000, saved: 6500, color: "#00D632", icon: "Shield", deadline: "2026-09-01" },
  { id: "2", name: "New Car", target: 25000, saved: 8200, color: "#7B61FF", icon: "Car", deadline: "2027-06-01" },
  { id: "3", name: "Vacation Fund", target: 5000, saved: 3100, color: "#00B4D8", icon: "Plane", deadline: "2026-12-01" },
  { id: "4", name: "Investment Portfolio", target: 15000, saved: 4750, color: "#FF9F43", icon: "TrendingUp", deadline: "2027-01-01" },
  { id: "5", name: "New Laptop", target: 2500, saved: 2500, color: "#A8FF00", icon: "Laptop", deadline: "2026-04-01" },
  { id: "6", name: "Side Business", target: 8000, saved: 1200, color: "#FF6B9D", icon: "Rocket", deadline: "2027-03-01" },
];

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  category: "savings" | "spending" | "streak" | "milestone";
  color: string;
}

export const achievements: Achievement[] = [
  { id: "1", name: "First Steps", description: "Create your first budget", icon: "Footprints", earned: true, earnedDate: "2025-10-01", category: "milestone", color: "#7B61FF" },
  { id: "2", name: "Penny Pincher", description: "Stay under budget for 1 month", icon: "Coins", earned: true, earnedDate: "2025-11-01", category: "spending", color: "#00D632" },
  { id: "3", name: "On a Roll", description: "7-day logging streak", icon: "Flame", earned: true, earnedDate: "2025-11-15", category: "streak", color: "#FF9F43" },
  { id: "4", name: "Stacker", description: "Save $1,000 total", icon: "Layers", earned: true, earnedDate: "2025-12-20", category: "savings", color: "#00B4D8" },
  { id: "5", name: "Big Saver", description: "Save $5,000 total", icon: "Vault", earned: true, earnedDate: "2026-02-10", category: "savings", color: "#00D632" },
  { id: "6", name: "Budget Boss", description: "Stay under budget for 3 months", icon: "Crown", earned: true, earnedDate: "2026-01-31", category: "spending", color: "#A8FF00" },
  { id: "7", name: "Two Weeks Strong", description: "14-day logging streak", icon: "Zap", earned: false, category: "streak", color: "#FF9F43" },
  { id: "8", name: "Goal Crusher", description: "Complete a savings goal", icon: "Target", earned: true, earnedDate: "2026-03-01", category: "savings", color: "#FF6B9D" },
  { id: "9", name: "Wealthy Mind", description: "Save $10,000 total", icon: "Brain", earned: false, category: "savings", color: "#7B61FF" },
  { id: "10", name: "Iron Discipline", description: "30-day logging streak", icon: "Medal", earned: false, category: "streak", color: "#FF4757" },
  { id: "11", name: "Six Figure Saver", description: "Reach $100,000 net worth", icon: "Trophy", earned: false, category: "milestone", color: "#FFD700" },
  { id: "12", name: "No Spend Day", description: "Go a full day with $0 spent", icon: "Ban", earned: true, earnedDate: "2026-03-05", category: "spending", color: "#00B4D8" },
];

export const allTransactions: Transaction[] = [
  ...recentTransactions,
  { id: "11", description: "Netflix", amount: -15.99, category: "Subscriptions", date: "2026-03-08", type: "expense" },
  { id: "12", description: "Starbucks", amount: -6.75, category: "Food & Dining", date: "2026-03-08", type: "expense" },
  { id: "13", description: "Electric Bill", amount: -142.00, category: "Housing", date: "2026-03-07", type: "expense" },
  { id: "14", description: "Freelance Payment", amount: 850.00, category: "Income", date: "2026-03-07", type: "income" },
  { id: "15", description: "Target", amount: -67.84, category: "Shopping", date: "2026-03-06", type: "expense" },
  { id: "16", description: "Dentist Visit", amount: -45.00, category: "Health", date: "2026-03-06", type: "expense" },
  { id: "17", description: "Rent Payment", amount: -1500.00, category: "Housing", date: "2026-03-05", type: "expense" },
  { id: "18", description: "PlayStation Plus", amount: -17.99, category: "Subscriptions", date: "2026-03-05", type: "expense" },
  { id: "19", description: "Parking Fee", amount: -12.00, category: "Transportation", date: "2026-03-04", type: "expense" },
  { id: "20", description: "Grocery Outlet", amount: -89.32, category: "Food & Dining", date: "2026-03-04", type: "expense" },
  { id: "21", description: "Concert Tickets", amount: -120.00, category: "Entertainment", date: "2026-03-03", type: "expense" },
  { id: "22", description: "Transfer to Savings", amount: -500.00, category: "Savings", date: "2026-03-03", type: "expense" },
  { id: "23", description: "Paycheck - Direct Deposit", amount: 2850.00, category: "Income", date: "2026-02-26", type: "income" },
  { id: "24", description: "Car Insurance", amount: -156.00, category: "Transportation", date: "2026-02-25", type: "expense" },
  { id: "25", description: "Apple Music", amount: -10.99, category: "Subscriptions", date: "2026-02-24", type: "expense" },
];
