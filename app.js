import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import blogRoutes from './routes/blog.routes.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('layout', {
        title: 'Home',
        content: 'index',
    });
});

app.use('/blog', blogRoutes);

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
});
