export const API_BASE_URL = 'http://newsapi.org/v2';
export const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
export const IEX_BASE_URL = 'https://cloud.iexapis.com/v1';
export const IEX_SANDBOX_BASE_URL = 'https://sandbox.iexapis.com/stable';
export const TDA_BASE_URL = 'https://api.tdameritrade.com/v1';

export const NEWS_API_KEY = 'cf74bbcf13fb4c998cc9c487c6acfc85';
export const FINNHUB_API_KEY = 'bsdev0vrh5r8dht9873g';
export const IEX_API_KEY = 'pk_9c3fe20063a14458a236fbba151b3523';
export const IEX_SANDBOX_API_KEY = 'Tsk_9b260400520a4d23abfe1ef6cb0d3feb';
export const TDA_CLIENT_ID = 'BUBO593GYIXB8RUB13COZ1BMBB79WJTJ';
export const TDA_AUTH_HOST = 'https://nextjs-td-auth.vercel.app';

export const TDA_AUTH_URL = TDA_AUTH_HOST + '/auth';
export const TDA_LOGIN_URL = `https://auth.tdameritrade.com/auth?response_type=code&redirect_uri=${encodeURIComponent(TDA_AUTH_URL)}&client_id=${TDA_CLIENT_ID}%40AMER.OAUTHAP`;
