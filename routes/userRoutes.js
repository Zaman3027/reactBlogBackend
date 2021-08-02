import pool from "../dbConfig.js";
import express from 'express';
import bcrypt from 'bcrypt';
import { authenticateToken } from "../middleware/authorization.js";

const userRouter = express.Router();


userRouter.get('/', authenticateToken, async (req, res) => {
    try {
        res.status(200).json(req.user);

    } catch (error) {
        console.log(error.message);
    }
});

userRouter.post('/', async (req, res) => {
    const { name, email, password } = req.body;
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

userRouter.get('/:id', authenticateToken, async (req, res) => {
    try {
        let userId = req.params.id;
        const query = await pool.query('SELECT * FROM users where user_id = $1',
            [userId]);
        const { user_id, user_name, user_email } = query.rows[0];
        res.json({ user_id, user_name, user_email });
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
});


export default userRouter;
