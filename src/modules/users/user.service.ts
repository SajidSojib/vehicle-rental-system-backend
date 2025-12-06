import { pool } from "../../config/db";
import bcrypt from "bcrypt";

const getAllUsers = async () => {
  const result = pool.query(`SELECT id, name, email, phone, role FROM users`);
  return result;
};

const updateUser = async(userId: number, payload: Record<string, unknown>, modifiedBy: string) => {
    if(payload?.password){
        const hashedPassword = await bcrypt.hash(payload.password as string, 12);
        payload.password = hashedPassword;
    }
    if(modifiedBy !== "admin"){
        delete payload.role;
    }

    const fields = Object.keys(payload);
    const values = Object.values(payload);
    const stringPair = fields.map((field, index) => `${field} = $${index + 1}`);

    const result = pool.query(`UPDATE users SET ${stringPair.join(", ")} WHERE id = $${fields.length + 1} RETURNING *`, [...values, userId]);
    return result;
}

const deleteUser = async(userId: number) => {
    const result = pool.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [userId]);
    return result;
}



export const userServices = {
    getAllUsers,
    updateUser,
    deleteUser
}