const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();

// Allow all connections from office network
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicle');
const repairRoutes = require('./routes/repairs-clean');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/repairs', repairRoutes);

// Test users data
const users = [
    { id: 1, name: 'Engineer John', email: 'engineer@hospital.com', password: 'password123', role: 'engineer' },
    { id: 2, name: 'Subject Officer', email: 'officer@rdhs.com', password: 'password123', role: 'subject_officer' },
    { id: 3, name: 'RDHS Manager', email: 'rdhs@health.gov', password: 'password123', role: 'rdhs' },
    { id: 4, name: 'System Admin', email: 'admin@system.com', password: 'admin123', role: 'admin' }
];

// Vehicles data
const vehicles = [
    { id: 1, registration_number: 'CAB-1234', vehicle_type: 'Ambulance', hospital_name: 'Base Hospital Colombo', current_status: 'operational', created_at: '2024-01-01' },
    { id: 2, registration_number: 'CAB-5678', vehicle_type: 'Van', hospital_name: 'MOH Office Gampaha', current_status: 'under_repair', created_at: '2024-01-02' },
    { id: 3, registration_number: 'WP-AB-9012', vehicle_type: 'Car', hospital_name: 'Base Hospital Kalutara', current_status: 'repaired', created_at: '2024-01-03' },
    { id: 4, registration_number: 'CAB-9011', vehicle_type: 'Ambulance', hospital_name: 'Base Hospital Kandy', current_status: 'operational', created_at: '2024-01-04' }
];

// Repair requests data
const repairs = [
    { 
        id: 1, 
        vehicle_id: 1, 
        engineer_id: 1,
        registration_number: 'CAB-1234',
        vehicle_type: 'Ambulance',
        hospital_name: 'Base Hospital Colombo',
        repair_details: 'Engine overheating problem needs fixing',
        engineer_name: 'Engineer John',
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
        engineer_signature: 'Engineer John',
        status: 'approved',
        inspection_date: '2024-01-12',
        created_at: '2024-01-12'
    }
];

// Test route
app.get('/', (req, res) => {
    res.json({ 
        message: '✅ Vehicle Repair System API is running!',
        version: '1.0.0',
        endpoints: {
            auth: ['POST /api/auth/login', 'GET /api/auth/officers'],
            vehicles: ['GET /api/vehicles', 'GET /api/vehicles/search/:reg'],
            repairs: ['GET /api/repairs', 'GET /api/repairs/stats/summary']
        }
    });
});

// API Connection Test endpoint
app.get('/api', (req, res) => {
    res.json({ 
        success: true,
        message: '✅ Backend API Connected',
        status: 'running'
    });
});

// ========== AUTH ROUTES ==========
app.post('/api/auth/login', (req, res) => {
    console.log('📨 Login request:', req.body.email);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: 'Email and password are required'
        });
    }
    
    const user = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
    );
    
    if (user) {
        const { password: _, ...userWithoutPassword } = user;
        
        res.json({
            success: true,
            message: 'Login successful',
            user: userWithoutPassword,
            token: 'test-token-' + Date.now()
        });
    } else {
        res.status(401).json({
            success: false,
            error: 'Invalid email or password'
        });
    }
});

app.get('/api/auth/officers', (req, res) => {
    const officersWithoutPassword = users.map(({ password, ...rest }) => rest);
    res.json({
        success: true,
        count: officersWithoutPassword.length,
        data: officersWithoutPassword
    });
});

app.get('/api/auth/users', (req, res) => {
    const usersWithoutPassword = users.map(({ password, ...rest }) => rest);
    res.json({
        success: true,
        count: usersWithoutPassword.length,
        data: usersWithoutPassword
    });
});

app.post('/api/auth/users', (req, res) => {
    const newUser = {
        id: users.length + 1,
        ...req.body
    };
    // Ensure role is set
    if (!newUser.role) newUser.role = 'engineer';
    
    users.push(newUser);
    res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
});

app.put('/api/auth/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    const updatedUser = { ...users[userIndex], ...req.body };
    if (!req.body.password) {
        updatedUser.password = users[userIndex].password; // Keep old password if not provided
    }
    
    users[userIndex] = updatedUser;
    
    const { password, ...userWithoutPassword } = updatedUser;
    res.json({
        success: true,
        message: 'User updated successfully',
        user: userWithoutPassword
    });
});

app.delete('/api/auth/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    users.splice(userIndex, 1);
    res.json({
        success: true,
        message: 'User deleted successfully'
    });
});

// ========== VEHICLE ROUTES ==========
app.get('/api/vehicles', (req, res) => {
    res.json({
        success: true,
        count: vehicles.length,
        data: vehicles
    });
});

app.get('/api/vehicles/search/:regNumber', (req, res) => {
    const filtered = vehicles.filter(v => 
        v.registration_number.toLowerCase().includes(req.params.regNumber.toLowerCase())
    );
    res.json({
        success: true,
        count: filtered.length,
        data: filtered.length > 0 ? filtered[0] : null
    });
});

app.post('/api/vehicles', (req, res) => {
    const newVehicle = {
        id: vehicles.length + 1,
        ...req.body,
        created_at: new Date().toISOString().split('T')[0]
    };
    vehicles.push(newVehicle);
    res.status(201).json({
        success: true,
        message: 'Vehicle added successfully',
        vehicleId: newVehicle.id
    });
});

app.put('/api/vehicles/:id', (req, res) => {
    const vehicleId = parseInt(req.params.id);
    const vehicleIndex = vehicles.findIndex(v => v.id === vehicleId);
    
    if (vehicleIndex === -1) {
        return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }
    
    vehicles[vehicleIndex] = { ...vehicles[vehicleIndex], ...req.body };
    res.json({
        success: true,
        message: 'Vehicle updated successfully',
        data: vehicles[vehicleIndex]
    });
});

app.delete('/api/vehicles/:id', (req, res) => {
    const vehicleId = parseInt(req.params.id);
    const vehicleIndex = vehicles.findIndex(v => v.id === vehicleId);
    
    if (vehicleIndex === -1) {
        return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }
    
    vehicles.splice(vehicleIndex, 1);
    res.json({
        success: true,
        message: 'Vehicle deleted successfully'
    });
});

// ========== REPAIR ROUTES ==========
app.get('/api/repairs', (req, res) => {
    res.json({
        success: true,
        count: repairs.length,
        data: repairs
    });
});

app.get('/api/repairs/status/:status', (req, res) => {
    const filtered = repairs.filter(r => r.status === req.params.status);
    res.json({
        success: true,
        count: filtered.length,
        data: filtered
    });
});

app.get('/api/repairs/engineer/:engineerId', (req, res) => {
    const engineerRepairs = repairs.filter(r => r.engineer_id === parseInt(req.params.engineerId));
    res.json({
        success: true,
        count: engineerRepairs.length,
        data: engineerRepairs
    });
});

app.post('/api/repairs', (req, res) => {
    const { 
        vehicle_id, 
        engineer_id, 
        repair_details,
        registration_number,
        vehicle_type,
        hospital_name,
        engineer_name,
        engineer_signature,
        inspection_date,
        inspection_findings,
        recommended_repairs,
        status
    } = req.body;
    
    // Find or create vehicle
    let vehicle = vehicle_id ? vehicles.find(v => v.id === vehicle_id) : vehicles.find(v => v.registration_number === registration_number);
    let finalVehicleId = vehicle_id;
    
    if (!vehicle && registration_number) {
        // Create new vehicle if it doesn't exist
        finalVehicleId = Math.max(...vehicles.map(v => v.id), 0) + 1;
        vehicle = {
            id: finalVehicleId,
            registration_number,
            vehicle_type: vehicle_type || 'Unknown',
            hospital_name: hospital_name || 'Unknown',
            current_status: 'under_repair',
            created_at: new Date().toISOString().split('T')[0]
        };
        vehicles.push(vehicle);
    } else if (!vehicle) {
        return res.status(400).json({
            success: false,
            error: 'Vehicle information is required (vehicle_id or registration_number)'
        });
    } else {
        finalVehicleId = vehicle.id;
    }
    
    if (!engineer_id || !repair_details) {
        return res.status(400).json({
            success: false,
            error: 'Engineer ID and repair details are required'
        });
    }
    
    const engineer = users.find(u => u.id === engineer_id);
    
    const newRepair = {
        id: repairs.length + 1,
        vehicle_id: finalVehicleId,
        engineer_id,
        registration_number: vehicle.registration_number,
        vehicle_type: vehicle.vehicle_type,
        hospital_name: vehicle.hospital_name,
        repair_details,
        inspection_findings: inspection_findings || '',
        recommended_repairs: recommended_repairs || '',
        engineer_name: engineer_name || engineer?.name || 'Unknown Engineer',
        engineer_signature: engineer_signature || '',
        status: status || 'inspection_completed',
        inspection_date: inspection_date || new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString()
    };
    
    repairs.push(newRepair);
    
    // Update vehicle status
    vehicle.current_status = 'under_repair';
    
    res.status(201).json({
        success: true,
        message: 'Repair request created successfully',
        repairId: newRepair.id,
        data: newRepair
    });
});

app.get('/api/repairs/:id', (req, res) => {
    const repairId = parseInt(req.params.id);
    const repair = repairs.find(r => r.id === repairId);
    
    if (!repair) {
        return res.status(404).json({ success: false, error: 'Repair request not found' });
    }
    
    // Generate mock history if not present
    const history = repair.history || [
        {
            status: 'created',
            officer_name: repair.engineer_name,
            officer_role: 'engineer',
            updated_at: repair.created_at,
            comments: 'Request initiated'
        }
    ];

    // If status changed and no history recorded (mock data scenario), add current status
    if (repair.status !== 'pending' && history.length === 1) {
        history.push({
            status: repair.status,
            officer_name: 'Subject Officer',
            officer_role: 'subject_officer',
            updated_at: new Date().toISOString(),
            comments: `Status updated to ${repair.status}`
        });
    }

    res.json({
        success: true,
        data: {
            ...repair,
            history
        }
    });
});

app.put('/api/repairs/:id/status', (req, res) => {
    const repairId = parseInt(req.params.id);
    const { status, officer_id, comments, officer_comments, director_comments } = req.body;
    
    const repair = repairs.find(r => r.id === repairId);
    
    if (!repair) {
        return res.status(404).json({
            success: false,
            error: 'Repair request not found'
        });
    }
    
    const oldStatus = repair.status;
    repair.status = status;
    
    // Store comments based on who is updating
    if (officer_comments) {
        repair.officer_comments = officer_comments;
    }
    if (director_comments) {
        repair.director_comments = director_comments;
    }
    
    // Add to history
    if (!repair.history) {
        repair.history = [{
            status: 'created',
            officer_name: repair.engineer_name,
            officer_role: 'engineer',
            updated_at: repair.created_at,
            comments: 'Initial Request'
        }];
    }
    
    // Find officer name if possible
    const officer = users.find(u => u.id === officer_id);
    
    repair.history.push({
        status: status,
        officer_name: officer ? officer.name : 'System User',
        officer_role: officer ? officer.role : 'admin',
        updated_at: new Date().toISOString(),
        comments: comments || officer_comments || director_comments || `Status changed to ${status}`
    });
    
    // If approved, update vehicle status
    if (status === 'approved') {
        const vehicle = vehicles.find(v => v.registration_number === repair.registration_number);
        if (vehicle) {
            vehicle.current_status = 'repaired';
        }
    }
    
    res.json({
        success: true,
        message: `Repair request ${status} successfully`,
        data: repair
    });
});

app.get('/api/repairs/stats/summary', (req, res) => {
    const statusCount = [
        { status: 'pending', count: repairs.filter(r => r.status === 'pending').length },
        { status: 'sent_to_rdhs', count: repairs.filter(r => r.status === 'sent_to_rdhs').length },
        { status: 'approved', count: repairs.filter(r => r.status === 'approved').length },
        { status: 'rejected', count: repairs.filter(r => r.status === 'rejected').length }
    ];
    
    const monthlyStats = [
        { month: '2024-01', count: repairs.length, approved_count: repairs.filter(r => r.status === 'approved').length }
    ];
    
    res.json({
        success: true,
        data: {
            statusCount,
            monthlyStats
        }
    });
});

// 404 handler
app.get('/', (req, res) => {
  res.send('Backend API running');
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend Server running on port ${PORT}`);
    console.log(`🔗 Local Access: http://localhost:${PORT}/`);
    console.log(`🔗 Network Access: http://192.168.1.38:${PORT}/`);
    console.log('\n📊 Available Data:');
    console.log(`   👤 Users: ${users.length} accounts`);
    console.log(`   🚗 Vehicles: ${vehicles.length} vehicles`);
    console.log(`   🔧 Repairs: ${repairs.length} repair requests`);
    console.log('\n🔑 Test Logins:');
    users.forEach(u => console.log(`   📧 ${u.email} / ${u.password} (${u.role})`));
});