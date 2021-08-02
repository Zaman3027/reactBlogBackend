import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../dbConfig.js';
import jwtTokens from '../utils/jwtHelper.js'


const authRouter = express.Router();

authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log({ email, password });
        const query = await pool.query('Select * from users where user_email = $1', [email]);
        if (query.rows.length > 0) {
            let user = query.rows[0];
            const {user_email,user_name,user_id} = user;
            console.log(user);
            let isMatch = await bcrypt.compare(password, user.user_password);
            if (!isMatch) {
                res.status(401).json({ message: "Not valid password" });
            } else {
                let tokens = jwtTokens(user);
                res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
                res.json({ success: true, token: tokens, user : {user_id,user_name,user_email}});
            }
        } else {
            return res.status(401).json({ message: "Email is Incorrect" });
        }
    } catch (error) {
        res.status(401).json({ message: error.message });
    }

})

export default authRouter;
