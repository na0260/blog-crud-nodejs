import bcrypt from 'bcrypt';

const hashedPassword = await bcrypt.hash('password123', 10);

export const users = [
    {
        id: 1,
        username: 'admin',
        email: 'admin@mail.com',
        password: hashedPassword,
    }
];