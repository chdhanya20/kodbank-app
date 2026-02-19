import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'mykodnestsecurekey123456789123456789';
const INITIAL_BALANCE = 100000;
const TOKEN_EXPIRY = '7d';

router.post('/register', async (req, res) => {
  try {
    const { uid, uname, password, email, phone } = req.body;
    const role = 'Customer';

    if (!uid || !uname || !password || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'uid, uname, password, email, and phone are required',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO KodUser (uid, username, email, password, balance, phone, role)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [uid, uname, email, hashedPassword, INITIAL_BALANCE, phone, role]
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please login.',
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Username or UID already exists',
      });
    }
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }

    const [rows] = await db.query(
      'SELECT uid, username, password, role FROM KodUser WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
    }

    const token = jwt.sign(
      {
        sub: user.username,
        role: user.role,
        uid: user.uid,
      },
      JWT_SECRET,
      { algorithm: 'HS256', expiresIn: TOKEN_EXPIRY }
    );

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    await db.query(
      'INSERT INTO UserToken (token, uid, expiry) VALUES (?, ?, ?)',
      [token, user.uid, expiryDate]
    );

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      })
      .status(200)
      .json({
        success: true,
        message: 'Login successful',
      });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

router.post('/logout', async (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    try {
      await db.query('DELETE FROM UserToken WHERE token = ?', [token]);
    } catch (e) {
      console.error('Logout token cleanup:', e);
    }
  }
  res.clearCookie('token').json({ success: true });
});

export default router;
