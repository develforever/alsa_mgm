
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
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '',
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || '',
  BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
  SESSION_SECRET: process.env.SESSION_SECRET || 'app-secret',
  DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
  DATABASE_PORT: Number(process.env.DATABASE_PORT) || 3306,
  DATABASE_USER: process.env.DATABASE_USER || 'user',
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || 'user_password',
  DATABASE_NAME: process.env.DATABASE_NAME || 'alsa',
};

export default config;