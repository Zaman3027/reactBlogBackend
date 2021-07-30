import { authenticateToken } from "../middleware/authorization.js";
import pool from "../dbConfig.js";
import express from 'express';

const postRouter = express.Router();

postRouter.post("/", authenticateToken, async (req, res) => {
    try {
        const { content, context } = req.body;
        const { user_id } = req.user;
        const playload = { user_id, content, context };
        const query = await pool.query(
            "INSERT INTO post(user_id,context,content) VALUES ($1,$2,$3) RETURNING * ",
            [user_id, JSON.stringify(context), JSON.stringify(content)]
        );
        res.json({ success: true, users: query.rows[0] });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
})

postRouter.get("/", authenticateToken, async (req, res) => {
    try {
        const query = await pool.query("Select postId,context,content,postedon,U.user_name,U.user_id from users as U ,post where post.user_id = U.user_id");
        res.json({ success: true, playload: query.rows });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
})

postRouter.get("/:id", authenticateToken, async (req, res) => {
    try {
        let postId = req.params.id;
        console.log({ postId });
        const query = await pool.query(
            "Select postId,content,postedon,U.user_name,U.user_id from users as U ,post where post.user_id = U.user_id and postId=$1",
            [postId]
        );
        console.log({ success: true, playload: query.rows[0] })
        res.json({ success: true, playload: query.rows[0] });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
})



export default postRouter;