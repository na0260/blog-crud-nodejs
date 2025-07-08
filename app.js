import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import session from 'express-session';
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import {isAuthenticated} from "./middlewares/auth.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false,
}));

app.use((req, res, next) => {
    res.locals.authUser = req.session.user || null;
    next();
});

app.use('/', authRoutes);
app.use('/admin',isAuthenticated,adminRoutes);

app.use((req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ error: 'API route not found' });
    }

    res.status(404).render('errors/404', {
        title: '404 - Page Not Found',
        content: null,
    });
});

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
});
