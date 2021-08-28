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
        const query = await pool.query("Select postId,context,content,postedon,U.user_name,U.user_id from users as U ,post where post.user_id = U.user_id ORDER BY postedon ASC");
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

postRouter.get("/user/:id", authenticateToken, async (req, res) => {
    try {
        let userId = req.params.id;
        const query = await pool.query(
            " Select postId,context,content,postedon,U.user_name,U.user_id from users as U ,post where post.user_id = $1 and post.user_id = U.user_id;",
            [userId]
        );
        res.json({ success: true, playload: query.rows });
    } catch (error) {
        console.log({ line: 60, ere: error.message });
        res.status(500).json({ message: error.message });
    }
})

postRouter.delete("/:id", authenticateToken, async (req, res) => {
    try {
        let postId = req.params.id;
        if (req.user_id === req.body.user_id)
            return res.status(401).json({ message: "You are not valid user" });
        const query = await pool.query(
            " Delete from post where post.postId=$1",
            [postId]
        );
        res.status(200).json(query.rows);
    } catch (error) {
        console.log({ line: 60, ere: error.message });
        res.status(500).json({ message: error.message });
    }
});


postRouter.get("/like/:id", authenticateToken, async (req, res) => {
    try {
        let postId = req.params.id;
        const { user_id } = req.user;
        const likeCountQuery = await pool.query("Select count(*) from likescount where postid = $1 and likecount = 1 ", [postId]);
        const userLike = await pool.query("Select likeCount from likescount where postid = $1 and user_id = $2", [postId, user_id]);
        const playload = {
            userLike: false,
            likeCount: likeCountQuery.rows[0].count
        };
        if (userLike.rows.length === 0) {
            playload.userLike = false;
        } else {
            playload.userLike = userLike.rows[0] && userLike.rows[0].likecount === 1;
        }
        console.log({ playload });
        res.status(200).json({ playload });
    } catch (error) {
        console.log({ error });
        res.status(500).json({ message: error.message });
    }
});

postRouter.post("/like/:id", authenticateToken, async (req, res) => {
    try {
        let postId = req.params.id;
        const { user_id } = req.user;
        const likeval = req.body.like ? 1 : 0;
        const isThere = await pool.query(
            "Select likesCount from likesCount where user_id = $1 and postid = $2",
            [user_id, postId]);
        let query;
        if (isThere.rows.length > 0) {
            query = await pool.query("update likesCount set likecount = $1 where user_id = $2 and postid = $3 RETURNING *",
                [likeval, user_id, postId]
            );
        } else {
            query = await pool.query(
                "INSERT INTO likesCount (user_id,postid,likecount) values ($1,$2,$3) RETURNING *",
                [user_id, postId, likeval]);
        }

        const rest = query.rows[0];
        console.log({ rest });
        res.status(200).json(query.rows[0]);
    } catch (error) {
        console.log({ error });
        res.status(500).json({ message: error.error });
    }
});




export default postRouter;
