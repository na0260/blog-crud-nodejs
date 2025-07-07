import { validationResult } from 'express-validator';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/blogs.json');

export const index = async (req, res) => {
    const blogs = await getBlogs();
    res.render('layout',{
        title: 'Blog List',
        content: 'blogs/index',
        locals: {
            blogs,
            success: req.query.success === '1' ? 'Blog saved successfully!' : null,
        }
    });
};

export const show = (req, res) => {

};

export const create = (req, res) => {
    res.render('layout', {
        title: 'Create Blog',
        content: 'blogs/create',
        locals: {
            errors: [],
            old: {},
        }
    });
};

export const store = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('layout', {
            title: 'Create Blog',
            content: 'blogs/create',
            locals: {
                errors: errors.array(),
                old: req.body
            }
        });
    }

    try {
        const blogs = await getBlogs();
        const newBlog = {
            id: Date.now(),
            title: req.body.title,
            description: req.body.description,
            createdAt: new Date(),
        };

        blogs.unshift(newBlog);
        await savePosts(blogs);
        res.redirect('/blog/list?success=1');
    }catch (error) {
        console.error('Error saving blog:', error);
        return res.status(500).render('layout', {
            title: 'Create Blog',
            content: 'blogs/create',
            locals: {
                errors: [{ msg: 'Failed to save blog. Please try again later.' }],
                old: req.body
            }
        });
    }
};

export const edit = async (req, res) => {
    const blogs = await getBlogs();
    const blog = blogs.find(b => b.id == req.params.id);

    if (!blog) {
        return res.status(404).render('errors/404');
    }

    res.render('layout', {
        title: 'Edit Blog',
        content: 'blogs/edit',
        locals: {
            blog,
            errors: [],
            old: {},
        }
    });
};

export const update = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('layout', {
            title: 'Edit Blog',
            content: 'blogs/edit',
            locals: {
                blog: { id: req.params.id, title: req.body.title, description: req.body.description },
                errors: errors.array(),
                old: req.body
            }
        });
    }

    const blogs = await getBlogs();
    const blogIndex = blogs.findIndex(b => b.id == req.params.id);

    if (blogIndex === -1) {
        return res.status(404).send('Blog not found');
    }

    blogs[blogIndex].title = req.body.title;
    blogs[blogIndex].description = req.body.description;

    await savePosts(blogs);
    res.redirect('/blog/list?success=1');
};

export const destroy = async (req, res) => {
    const blogs = await getBlogs();
    const updatedBlogs = blogs.filter(b => b.id != req.params.id);
    await savePosts(updatedBlogs);
    res.redirect('/blog/list?success=1');
};

const getBlogs = async () => {
    try {
        const data = await readFile(dataPath, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
};

const savePosts = async (blogs) => {
    await writeFile(dataPath, JSON.stringify(blogs, null, 2));
};