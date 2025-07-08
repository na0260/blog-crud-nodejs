import {users} from '../data/users.js'
import bcrypt from "bcrypt";

export const login = (req, res) => {
    if (!req.session.user) {
        res.render('auth/login', {
            locals: {
                errors: [],
                old: {}
            }
        });
    }
    else {
        res.redirect('/admin/dashboard');
    }
}

export const authenticate = async (req, res) => {
    const {email, password} = req.body;
    const user = users.find(u => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).render('auth/login', {
            locals: {
                errors: [{msg: 'Invalid email or password'}],
                old: {email}
            }
        });
    }

    req.session.user = user;
    res.redirect('/admin/dashboard');

};

export const logout = (req, res) => {
    req.session.destroy(()=>{
        res.redirect('/login');
    });
};