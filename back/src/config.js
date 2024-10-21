import { config } from 'dotenv';
import { resolve } from 'path';

// Cargar el archivo .env
config({ path: resolve('./.env') });

export const JWTSECRET = process.env.JWTSECRET;
export const JWTSECRETPASSWORD = process.env.JWTSECRETPASSW;
export const API_FRONT = process.env.API_FRONT;
export const API_BACK = process.env.API_BACK;
export const PORT_FRONT = process.env.PORT_FRONT;
export const PORT_DB = process.env.PORT_DB;
export const HOST = process.env.HOST;
export const PORT = process.env.PORT;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_USER = process.env.DB_USER;
export const DIALECT = process.env.DIALECT;
export const DATABASE = process.env.DATABASE;
export const NAME = process.env.NAME;
export const MAIL_HOST = process.env.MAIL_HOST;
export const MAIL_PORT = process.env.MAIL_PORT;
export const MAIL_USERNAME = process.env.MAIL_USERNAME;
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD;
export const MAIL_FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS;
export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
export const PAPAL_API_CLIENTE = process.env.PAPAL_API_CLIENTE;
export const PAPAL_API_SECRET = process.env.PAPAL_API_SECRET;
export const PAPAL_API = process.env.PAPAL_API;
