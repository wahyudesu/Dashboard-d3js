export interface SalesData {
  monthly: {
    sales: number[];
    revenue: number[];
    profit: number[];
  };
  labels: string[];
}

export interface ProductData {
  labels: string[];
  sales: number[];
  growth: number[];
  details: {
    [key: string]: {
      avg_price: number;
      units_sold: number;
    };
  };
}

export interface RegionData {
  labels: string[];
  values: number[];
  demographics: {
    [key: string]: {
      population: number;
      avg_income: number;
    };
  };
}

export interface ForecastData {
  monthly_forecast: number[];
  labels: string[];
}