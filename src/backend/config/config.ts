
interface Config {
  port: number;
  nodeEnv: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  BASE_URL: string;
  SESSION_SECRET: string;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
  COCKROACH_DB_USER: string;
  COCKROACH_DB_PASSWORD: string;
  COCKROACH_DB_NAME: string;
  COCKROACH_DB_URL: string;
  APP_DATA_SOURCE_TYPE: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '',
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || '',
  BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
  SESSION_SECRET: process.env.SESSION_SECRET || '',
  DATABASE_HOST: process.env.DATABASE_HOST || '',
  DATABASE_PORT: Number(process.env.DATABASE_PORT) || 3306,
  DATABASE_USER: process.env.DATABASE_USER || '',
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || '',
  DATABASE_NAME: process.env.DATABASE_NAME || '',
  COCKROACH_DB_USER: process.env.COCKROACH_DB_USER || '',
  COCKROACH_DB_PASSWORD: process.env.COCKROACH_DB_PASSWORD || '',
  COCKROACH_DB_NAME: process.env.COCKROACH_DB_NAME || '',
  COCKROACH_DB_URL: process.env.COCKROACH_DB_URL || '',
  APP_DATA_SOURCE_TYPE: process.env.APP_DATA_SOURCE_TYPE || 'mysql',
};

export default config;