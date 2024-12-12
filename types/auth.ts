export interface UserExpenses {
  investment: string;
  housing: string;
  food: string;
  saving: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  expenses?: UserExpenses;
  createdAt: string;
} 