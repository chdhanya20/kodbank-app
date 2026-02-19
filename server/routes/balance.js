import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import db from '../db.js';

const router = express.Router();

router.get('/balance', verifyToken, async (req, res) => {
  try {
    const username = req.user.sub;

    const [rows] = await db.query(
      'SELECT balance FROM KodUser WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      balance: parseFloat(rows[0].balance),
    });
  } catch (err) {
    console.error('Balance fetch error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch balance' });
  }
});

export default router;
