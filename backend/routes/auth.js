const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }
        
        try {
            // Try database first
            const [rows] = await db.execute(
                'SELECT id, name, email, role FROM officers WHERE email = ? AND password = ?',
                [email.toLowerCase(), password]
            );
            
            if (rows.length > 0) {
                const user = rows[0];
                console.log('✅ Login successful (DB):', user.email);
                return res.json({
                    success: true,
                    message: 'Login successful',
                    user: user,
                    token: `demo-token-${user.id}-${Date.now()}`
                });
            }
        } catch (dbError) {
            console.log('⚠️ Database not available, falling back to mock data');
        }
        
        // Fallback to mock data
        const users = [
            { id: 1, name: 'Engineer John', email: 'engineer@hospital.com', password: 'password123', role: 'engineer' },
            { id: 2, name: 'Subject Officer', email: 'officer@rdhs.com', password: 'password123', role: 'subject_officer' },
            { id: 3, name: 'RDHS Manager', email: 'rdhs@health.gov', password: 'password123', role: 'rdhs' },
            { id: 4, name: 'System Admin', email: 'admin@system.com', password: 'admin123', role: 'admin' }
        ];
        
        const user = users.find(u => 
            u.email.toLowerCase() === email.toLowerCase() && 
            u.password === password
        );
        
        if (user) {
            const { password: _, ...userWithoutPassword } = user;
            console.log('✅ Login successful (Mock):', user.email);
            res.json({
                success: true,
                message: 'Login successful',
                user: userWithoutPassword,
                token: `demo-token-${user.id}-${Date.now()}`
            });
        } else {
            console.log('❌ Login failed for:', email);
            res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Login failed'
        });
    }
});

// GET current user profile
router.get('/profile', async (req, res) => {
    const { userId } = req.query;
    
    if (!userId) {
        return res.status(400).json({
            success: false,
            error: 'User ID is required'
        });
    }
    
    try {
        const [rows] = await db.execute(
            'SELECT id, name, email, role FROM officers WHERE id = ?',
            [userId]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        
        const user = rows[0];
        
        // Get user statistics based on role (mock data for now)
        let stats = {};
        
        if (user.role === 'engineer') {
            stats = {
                total_requests: 3,
                pending_requests: 1,
                approved_requests: 1
            };
        } else if (user.role === 'subject_officer') {
            stats = {
                reviewed_requests: 2,
                forwarded_requests: 1
            };
        } else if (user.role === 'rdhs') {
            stats = {
                total_decisions: 1,
                approved_requests: 1,
                rejected_requests: 0
            };
        } else {
            // For admin, get total users count
            const [userCount] = await db.execute('SELECT COUNT(*) as count FROM officers');
            stats = {
                total_users: userCount[0].count
            };
        }
        
        res.json({
            success: true,
            user: user,
            stats: stats
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get profile'
        });
    }
});

// GET all users (for admin)
router.get('/users', async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT id, name, email, role, created_at FROM officers ORDER BY created_at DESC'
        );
        
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get users'
        });
    }
});

// POST create user
router.post('/users', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }
        
        // Check if email already exists
        const [existing] = await db.execute(
            'SELECT id FROM officers WHERE email = ?',
            [email.toLowerCase()]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Email already exists'
            });
        }
        
        const [result] = await db.execute(
            'INSERT INTO officers (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email.toLowerCase(), password, role]
        );
        
        res.json({
            success: true,
            message: 'User created successfully',
            userId: result.insertId
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create user'
        });
    }
});

// PUT update user
router.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body;
        
        if (!name || !email || !role) {
            return res.status(400).json({
                success: false,
                error: 'Name, email, and role are required'
            });
        }
        
        // Check if email already exists for another user
        const [existing] = await db.execute(
            'SELECT id FROM officers WHERE email = ? AND id != ?',
            [email.toLowerCase(), id]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Email already exists'
            });
        }
        
        let query, params;
        if (password) {
            query = 'UPDATE officers SET name = ?, email = ?, password = ?, role = ? WHERE id = ?';
            params = [name, email.toLowerCase(), password, role, id];
        } else {
            query = 'UPDATE officers SET name = ?, email = ?, role = ? WHERE id = ?';
            params = [name, email.toLowerCase(), role, id];
        }
        
        const [result] = await db.execute(query, params);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        
        res.json({
            success: true,
            message: 'User updated successfully'
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update user'
        });
    }
});

// DELETE user
router.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [result] = await db.execute(
            'DELETE FROM officers WHERE id = ?',
            [id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete user'
        });
    }
});

module.exports = router;