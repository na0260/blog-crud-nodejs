import blogRoutes from "./blog.routes.js";
import express from "express";

const router = express.Router();
router.get('/dashboard', (req, res) => {
    res.render('layout', {
        title: 'Admin Dashboard',
        content: 'index',
    });
});

router.use('/blog', blogRoutes);

export default router;