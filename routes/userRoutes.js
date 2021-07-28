import pool from "../dbConfig.js";
import express from 'express';
import bcrypt from 'bcrypt';
import { authenticateToken } from "../middleware/authorization.js";

const userRouter = express.Router();


userRouter.get('/', authenticateToken, async (req, res) => {
    try {
        //const { user_id, user_name, user_email} = req.user;
        console.log(req.user);
        if (req.user) {
            const user = await pool.query('select * from users');
            res.json({ success: true, users: user.rows });
        }

    } catch (error) {
        console.log(error.message);
        //res.status(500).json({ success: false, message: error.message });
    }
});

userRouter.post('/', async (req, res) => {
    const { name, email, password } = req.body;
    console.log({ name, email, password });
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = await pool.query('INSERT INTO users (user_name,user_email,user_password) VALUES ($1,$2,$3) RETURNING *',
            [name, email, hashedPassword]);
        res.json({ success: true, users: query.rows });
    } catch (error) {
        console.log(error.message);
        res.sendStatus(500);
    }
})

userRouter.delete('/', async (req, res) => {
    const { email } = req.body;
    try {
        const query = await pool.query('delete from users where user_email = $1',
            [email]);
        res.json(query.rows);
    } catch (error) {
        console.log(error.message);
        res.sendStatus(500);
    }
})


export default userRouter;
