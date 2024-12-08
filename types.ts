export interface ExpenseType {
    id: number;
    name: string;
    amount: number;
    percentage: number;
    userId: string;
}

export interface CourseType {
  id: number;
  name: string;
  imageCode: string;
  imageUrl: string;
  category: string;
  enrolled?: boolean;
  featured?: boolean;
  duration?: string;
  completed?: boolean;
  chapters?: ChapterType[];
}

export interface ChapterType {
  id: number;
  title: string;
  videoUrl?: string;
}

interface NewsItem {
  id: number;
  title: string;
  date: string;
  source: string;
  url: string;
  summary: string;
}

interface Fundamentals {
  profitMargin: string;
  operatingMargin: string;
  returnOnEquity: string;
  returnOnAssets: string;
  revenueGrowth: string;
  earningsGrowth: string;
  currentRatio: string;
  quickRatio: string;
  dividendYield: string;
  priceToBook: string;
}

export interface StockType {
  id: number;
  name: string;
  full_name: string;
  industry: string;
  description: string;
  financial_details: Financialdetails;
  performance: Performance;
  about: string;
  stock_link: string;
  price: string;
  status: string;
  Share_Vest_Featured?: boolean;
  fundamentals: Fundamentals;
  news: NewsItem[];
}

interface Performance {
  stock_performance: string;
  growth_potential: string;
}

interface Financialdetails {
  debt_to_assets_ratio: string;
  non_compliant_income_ratio: string;
  market_cap: string;
}

