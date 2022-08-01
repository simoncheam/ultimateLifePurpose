import * as dotenv from 'dotenv';

dotenv.config();

export const database_config = {

   database: process.env.DB_NAME,
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD
};

export const jwt_config = {

   secret: process.env.JWT_SECRET,
   expiration: process.env.JWT_EXPIRATION,
   tempSecret: process.env.JWT_TEMP,
   tempExpiration: process.env.JWT_TEMP_EXPIRATION
};

export const sendgrid_config = {

   apiKey: process.env.SENDGRID_API_KEY
}

export const URL_BASE = `https://ultimate-life-purpose.herokuapp.com`
export const DEV_URL_BASE = `http://localhost:3000`

export default {


   jwt_config,
   database_config,
   sendgrid_config
};