import { pool } from "../../config/db";
import bcrypt from "bcrypt";

const signUp = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;
  const hashedPassword = await bcrypt.hash(password as string, 12);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, hashedPassword, phone, role]
  );
  delete result.rows[0].password;
  return result;
};

const signIn = async (payload: Record<string, unknown>) => {
  const { email, password } = payload;
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  if (result.rows.length === 0) {
    throw new Error("User not found with this email");
  }

  const isMatch = await bcrypt.compare(password as string, result.rows[0].password);
  if (!isMatch) {
    throw new Error("Invalid password");
  }
  delete result.rows[0].password;
  return result;
};


export const authServices = {
  signUp,
  signIn
};