import {
  API_BASE_URL,
  NEWS_API_KEY,
  FINNHUB_BASE_URL,
  IEX_BASE_URL,
  IEX_API_KEY,
  IEX_SANDBOX_BASE_URL,
} from './config';

export const LOGIN_API = API_BASE_URL + '/login';

export const HK_NEWS_API = `${API_BASE_URL}/top-headlines?apiKey=${NEWS_API_KEY}`;

export const getNewsApiByCategory = (category, page) => {
  return `${API_BASE_URL}/top-headlines?country=hk&page=${page}&apiKey=${NEWS_API_KEY}`;
};

export const CANDLES_API = FINNHUB_BASE_URL + '/stock/candle';
export const QUOTE_API = FINNHUB_BASE_URL + '/quote';

export const getIntradayPriceApi = (ticker) =>
  IEX_BASE_URL + `/stock/${ticker}/intraday-prices`;
export const getYearPriceApi = (ticker) =>
  IEX_BASE_URL + `/stock/${ticker}/chart/1y`;
export const getAdvancedStatsApi = (ticker) =>
  IEX_SANDBOX_BASE_URL + `/stock/${ticker}/advanced-stats`;
