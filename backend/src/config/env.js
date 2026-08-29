import dotenv from 'dotenv';

dotenv.config();

export const env = {
  uri: process.env.COGNODB_URI,
  username: process.env.COGNODB_USERNAME,
  password: process.env.COGNODB_PASSWORD,
  port: Number(process.env.PORT) || 5000
};

export function validateEnv() {
  const missing = ['COGNODB_URI', 'COGNODB_USERNAME', 'COGNODB_PASSWORD']
    .filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Missing environment variables: ${missing.join(', ')}`);
}
