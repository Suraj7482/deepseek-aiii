import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_PASSWORD; // Renamed for clarity

export default { JWT_SECRET };