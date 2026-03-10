const express = require('express');
const router = express.Router();

// Mock repairs data
const repairs = [
    { id: 1, vehicle_id: 1, engineer_id: 1, registration_number: 'CAB-1234', vehicle_type: 'Ambulance', hospital_name: 'Base Hospital Colombo', repair_details: 'Engine overheating problem needs fixing', engineer_name: 'Engineer John', engineer_email: 'engineer@hospital.com', engineer_signature: 'Engineer John', status: 'pending', inspection_date: '2024-01-10', created_at: '2024-01-10' },
    { id: 2, vehicle_id: 2, engineer_id: 1, registration_number: 'CAB-5678', vehicle_type: 'Van', hospital_name: 'MOH Office Gampaha', repair_details: 'Brake system needs replacement', engineer_name: 'Engineer John', engineer_email: 'engineer@hospital.com', engineer_signature: 'Engineer John', status: 'sent_to_rdhs', inspection_date: '2024-01-11', created_at: '2024-01-11' },
    { id: 3, vehicle_id: 3, engineer_id: 1, registration_number: 'WP-AB-9012', vehicle_type: 'Car', hospital_name: 'Base Hospital Kalutara', repair_details: 'Transmission issue fixed', engineer_name: 'Engineer John', engineer_email: 'engineer@hospital.com', engineer_signature: 'Engineer John', status: 'approved', inspection_date: '2024-01-12', created_at: '2024-01-12' }
];

router.get('/', (req, res) => res.json({ success: true, count: repairs.length, data: repairs }));
router.get('/status/:status', (req, res) => { const filtered = repairs.filter(r => r.status === req.params.status); res.json({ success: true, count: filtered.length, data: filtered }); });
router.get('/engineer/:engineerId', (req, res) => { const filtered = repairs.filter(r => r.engineer_id === parseInt(req.params.engineerId)); res.json({ success: true, count: filtered.length, data: filtered }); });
router.get('/:id', (req, res) => { const repair = repairs.find(r => r.id === parseInt(req.params.id)); if (!repair) return res.status(404).json({ success: false, error: 'Not found' }); res.json({ success: true, data: { ...repair, history: [{ status: 'created', officer_name: repair.engineer_name, officer_role: 'engineer', updated_at: repair.created_at, comments: 'Request initiated' }] } }); });
router.post('/', (req, res) => { const newRepair = { id: repairs.length + 1, ...req.body, created_at: new Date().toISOString() }; repairs.push(newRepair); res.status(201).json({ success: true, message: 'Created', repairId: newRepair.id, data: newRepair }); });
router.put('/:id/status', (req, res) => { const repair = repairs.find(r => r.id === parseInt(req.params.id)); if (!repair) return res.status(404).json({ success: false, error: 'Not found' }); repair.status = req.body.status || repair.status; res.json({ success: true, message: 'Updated', data: repair }); });
router.get('/stats/summary', (req, res) => { const statusCount = [{ status: 'pending', count: repairs.filter(r => r.status === 'pending').length }, { status: 'sent_to_rdhs', count: repairs.filter(r => r.status === 'sent_to_rdhs').length }, { status: 'approved', count: repairs.filter(r => r.status === 'approved').length }, { status: 'rejected', count: repairs.filter(r => r.status === 'rejected').length }]; res.json({ success: true, data: { statusCount, monthlyStats: [{ month: '2024-01', count: repairs.length, approved_count: repairs.filter(r => r.status === 'approved').length }] } }); });
router.delete('/:id', (req, res) => { const index = repairs.findIndex(r => r.id === parseInt(req.params.id)); if (index === -1) return res.status(404).json({ success: false, error: 'Not found' }); repairs.splice(index, 1); res.json({ success: true, message: 'Deleted' }); });

module.exports = router;
 
        engineer_id: 1,
        registration_number: 'CAB-1234',
        vehicle_type: 'Ambulance',
        hospital_name: 'Base Hospital Colombo',
        repair_details: 'Engine overheating problem needs fixing',
        engineer_name: 'Engineer John',
        engineer_email: 'engineer@hospital.com',
        engineer_signature: 'Engineer John',
        status: 'pending',
        inspection_date: '2024-01-10',
        created_at: '2024-01-10'
    },
    { 
        id: 2, 
        vehicle_id: 2, 
        engineer_id: 1,
        registration_number: 'CAB-5678',
        vehicle_type: 'Van',
        hospital_name: 'MOH Office Gampaha',
        repair_details: 'Brake system needs replacement',
        engineer_name: 'Engineer John',
        engineer_email: 'engineer@hospital.com',
        engineer_signature: 'Engineer John',
        status: 'sent_to_rdhs',
        inspection_date: '2024-01-11',
        created_at: '2024-01-11'
    },
    { 
        id: 3, 
        vehicle_id: 3, 
        engineer_id: 1,
        registration_number: 'WP-AB-9012',
        vehicle_type: 'Car',
        hospital_name: 'Base Hospital Kalutara',
        repair_details: 'Transmission issue fixed',
        engineer_name: 'Engineer John',
        engineer_email: 'engineer@hospital.com',
        engineer_signature: 'Engineer John',
        status: 'approved',
        inspection_date: '2024-01-12',
        created_at: '2024-01-12'
    }
];

// GET all repair requests
router.get('/', (req, res) => {
    res.json({
        success: true,
        count: repairs.length,
        data: repairs
    });
});

// GET repair requests by status
router.get('/status/:status', (req, res) => {
    const filtered = repairs.filter(r => r.status === req.params.status);
    res.json({
        success: true,
        count: filtered.length,
        data: filtered
    });
});

// GET repair requests by engineer
router.get('/engineer/:engineerId', (req, res) => {
    const filtered = repairs.filter(r => r.engineer_id === parseInt(req.params.engineerId));
    res.json({
        success: true,
        count: filtered.length,
        data: filtered
    });
});

// GET single repair request  
router.get('/:id', (req, res) => {
    const repair = repairs.find(r => r.id === parseInt(req.params.id));
    if (!repair) {
        return res.status(404).json({
            success: false,
            error: 'Repair request not found'
        });
    }
    
    res.json({
        success: true,
        data: {
            ...repair,
            history: [{
                status: 'created',
                officer_name: repair.engineer_name,
                officer_role: 'engineer',
                updated_at: repair.created_at,
                comments: 'Request initiated'
            }]
        }
    });
});

// POST create repair request
router.post('/', (req, res) => {
    const newRepair = {
        id: repairs.length + 1,
        ...req.body,
        created_at: new Date().toISOString()
    };
    repairs.push(newRepair);
    
    res.status(201).json({
        success: true,
        message: 'Repair request created successfully',
        repairId: newRepair.id,
        data: newRepair
    });
});

// PUT update repair status
router.put('/:id/status', (req, res) => {
    const repair = repairs.find(r => r.id === parseInt(req.params.id));
    if (!repair) {
        return res.status(404).json({
            success: false,
            error: 'Repair request not found'
        });
    }
    
    repair.status = req.body.status || repair.status;
    
    res.json({
        success: true,
        message: 'Repair request updated successfully',
        data: repair
    });
});

// GET repair stats/summary
router.get('/stats/summary', (req, res) => {
    const statusCount = [
        { status: 'pending', count: repairs.filter(r => r.status === 'pending').length },
        { status: 'sent_to_rdhs', count: repairs.filter(r => r.status === 'sent_to_rdhs').length },
        { status: 'approved', count: repairs.filter(r => r.status === 'approved').length },
        { status: 'rejected', count: repairs.filter(r => r.status === 'rejected').length }
    ];
    
    res.json({
        success: true,
        data: {
            statusCount,
            monthlyStats: [
                { month: '2024-01', count: repairs.length, approved_count: repairs.filter(r => r.status === 'approved').length }
            ]
        }
    });
});

// DELETE repair request
router.delete('/:id', (req, res) => {
    const index = repairs.findIndex(r => r.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({
            success: false,
            error: 'Repair request not found'
        });
    }
    
    repairs.splice(index, 1);
    res.json({
        success: true,
        message: 'Repair request deleted successfully'
    });
});

module.exports = router;

    });
});

// GET single repair request  
router.get('/:id', (req, res) => {
    const repair = repairs.find(r => r.id === parseInt(req.params.id));
    if (!repair) {
        return res.status(404).json({
            success: false,
            error: 'Repair request not found'
        });
    }
    
    res.json({
        success: true,
        data: {
            ...repair,
            history: [{
                status: 'created',
                officer_name: repair.engineer_name,
                officer_role: 'engineer',
                updated_at: repair.created_at,
                comments: 'Request initiated'
            }]
        }
    });
});

// POST create repair request
router.post('/', (req, res) => {
    const newRepair = {
        id: repairs.length + 1,
        ...req.body,
        created_at: new Date().toISOString()
    };
    repairs.push(newRepair);
    
    res.status(201).json({
        success: true,
        message: 'Repair request created successfully',
        repairId: newRepair.id,
        data: newRepair
    });
});

// PUT update repair status
router.put('/:id/status', (req, res) => {
    const repair = repairs.find(r => r.id === parseInt(req.params.id));
    if (!repair) {
        return res.status(404).json({
            success: false,
            error: 'Repair request not found'
        });
    }
    
    repair.status = req.body.status || repair.status;
    
    res.json({
        success: true,
        message: 'Repair request updated successfully',
        data: repair
    });
});

// GET repair stats/summary
router.get('/stats/summary', (req, res) => {
    const statusCount = [
        { status: 'pending', count: repairs.filter(r => r.status === 'pending').length },
        { status: 'sent_to_rdhs', count: repairs.filter(r => r.status === 'sent_to_rdhs').length },
        { status: 'approved', count: repairs.filter(r => r.status === 'approved').length },
        { status: 'rejected', count: repairs.filter(r => r.status === 'rejected').length }
    ];
    
    res.json({
        success: true,
        data: {
            statusCount,
            monthlyStats: [
                { month: '2024-01', count: repairs.length, approved_count: repairs.filter(r => r.status === 'approved').length }
            ]
        }
    });
});

// DELETE repair request
router.delete('/:id', (req, res) => {
    const index = repairs.findIndex(r => r.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({
            success: false,
            error: 'Repair request not found'
        });
    }
    
    repairs.splice(index, 1);
    res.json({
        success: true,
        message: 'Repair request deleted successfully'
    });
});

module.exports = router;
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Repair request not found'
            });
        }
        
        // Get status history
        const [history] = await db.execute(`
            SELECT 
                s.*,
                o.name as officer_name,
                o.role as officer_role
            FROM status_updates s
            LEFT JOIN officers o ON s.officer_id = o.id
            WHERE s.repair_request_id = ?
            ORDER BY s.updated_at DESC
        `, [req.params.id]);
        
        res.json({
            success: true,
            data: {
                ...rows[0],
                history: history
            }
        });
    } catch (error) {
        console.error('Error fetching repair request:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch repair request'
        });
    }
});

// POST create repair request
router.post('/', async (req, res) => {
    const { 
        vehicle_id, 
        engineer_id, 
        engineer_name,
        repair_details, 
        engineer_signature,
        registration_number,
        vehicle_type,
        hospital_name,
        inspection_date,
        inspection_findings,
        recommended_repairs,
        status,
        current_status
    } = req.body;
    
    try {
        let finalVehicleId = vehicle_id;
        
        // Validate required fields
        if (!engineer_id || !repair_details) {
            return res.status(400).json({
                success: false,
                error: 'Engineer ID and repair details are required'
            });
        }
        
        // Find or create vehicle
        if (!vehicle_id && registration_number) {
            // Check if vehicle exists
            const [existingVehicle] = await db.execute(
                'SELECT id FROM vehicles WHERE registration_number = ?',
                [registration_number]
            );
            
            if (existingVehicle.length > 0) {
                finalVehicleId = existingVehicle[0].id;
            } else {
                // Create new vehicle
                const [vehicleResult] = await db.execute(`
                    INSERT INTO vehicles 
                    (registration_number, vehicle_type, hospital_name, current_status) 
                    VALUES (?, ?, ?, ?)
                `, [registration_number, vehicle_type || 'Unknown', hospital_name || 'Unknown', 'under_repair']);
                
                finalVehicleId = vehicleResult.insertId;
            }
        }
        
        if (!finalVehicleId) {
            return res.status(400).json({
                success: false,
                error: 'Vehicle information is required'
            });
        }
        
        // Create repair request (without transaction - mysql2 doesn't support it with prepared statements)
        const inspectionDateStr = inspection_date || new Date().toISOString().split('T')[0];
        const repairStatus = status || 'inspection_completed';
        
        const [result] = await db.execute(`
            INSERT INTO repair_requests 
            (vehicle_id, engineer_id, repair_details, engineer_signature, inspection_date, status) 
            VALUES (?, ?, ?, ?, ?, ?)
        `, [finalVehicleId, engineer_id, repair_details, engineer_signature || null, inspectionDateStr, repairStatus]);
        
        // Update vehicle status to under_repair
        await db.execute(
            'UPDATE vehicles SET current_status = ? WHERE id = ?',
            ['under_repair', finalVehicleId]
        );
        
        // Record initial status
        await db.execute(
            'INSERT INTO status_updates (repair_request_id, officer_id, status, comments) VALUES (?, ?, ?, ?)',
            [result.insertId, engineer_id, repairStatus, 'Inspection report created by engineer and sent to Subject Officer']
        );
        
        res.status(201).json({
            success: true,
            message: 'Repair request created successfully',
            repairId: result.insertId,
            data: {
                id: result.insertId,
                vehicle_id: finalVehicleId,
                engineer_id,
                repair_details,
                inspection_date: inspectionDateStr,
                status: repairStatus,
                registration_number,
                vehicle_type,
                hospital_name
            }
        });
    } catch (error) {
        console.error('Error creating repair request:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create repair request: ' + error.message
        });
    }
});

// PUT update repair status
router.put('/:id/status', async (req, res) => {
    const { status, officer_id, comments } = req.body;
    const repairId = req.params.id;
    
    // Validation
    if (!status || !officer_id) {
        return res.status(400).json({
            success: false,
            error: 'Status and officer ID are required'
        });
    }
    
    const validStatuses = ['pending', 'inspection_completed', 'sent_to_officer', 'sent_to_rdhs_director', 'sent_to_rdhs', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid status value'
        });
    }
    
    try {
        // Update repair request status (no transaction)
        const [updateResult] = await db.execute(
            'UPDATE repair_requests SET status = ? WHERE id = ?',
            [status, repairId]
        );
        
        if (updateResult.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Repair request not found'
            });
        }
        
        // Record status update
        await db.execute(
            'INSERT INTO status_updates (repair_request_id, officer_id, status, comments) VALUES (?, ?, ?, ?)',
            [repairId, officer_id, status, comments || '']
        );
        
        // If approved, update vehicle status
        if (status === 'approved') {
            const [repair] = await db.execute(
                'SELECT vehicle_id FROM repair_requests WHERE id = ?',
                [repairId]
            );
            
            if (repair.length > 0 && repair[0]) {
                await db.execute(
                    'UPDATE vehicles SET current_status = ? WHERE id = ?',
                    ['repaired', repair[0].vehicle_id]
                );
            }
        }
        
        res.json({
            success: true,
            message: `Repair request ${status} successfully`
        });
    } catch (error) {
        console.error('Error updating repair status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update repair status: ' + error.message
        });
    }
});

// GET repair requests for specific engineer
router.get('/engineer/:engineerId', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT 
                r.*,
                v.registration_number,
                v.vehicle_type,
                v.hospital_name
            FROM repair_requests r
            LEFT JOIN vehicles v ON r.vehicle_id = v.id
            WHERE r.engineer_id = ?
            ORDER BY r.created_at DESC
        `, [req.params.engineerId]);
        
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching engineer repairs:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch repair requests'
        });
    }
});

// GET statistics
router.get('/stats/summary', async (req, res) => {
    try {
        const [statusCount] = await db.execute(`
            SELECT 
                status,
                COUNT(*) as count
            FROM repair_requests
            GROUP BY status
        `);
        
        const [monthlyStats] = await db.execute(`
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m') as month,
                COUNT(*) as count,
                SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_count
            FROM repair_requests
            GROUP BY DATE_FORMAT(created_at, '%Y-%m')
            ORDER BY month DESC
            LIMIT 6
        `);
        
        res.json({
            success: true,
            data: {
                statusCount,
                monthlyStats
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch statistics'
        });
    }
});

// DELETE repair request
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.execute(`
            DELETE FROM repair_requests
            WHERE id = ?
        `, [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Repair request not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Repair request deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting repair request:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete repair request'
        });
    }
});

module.exports = router;