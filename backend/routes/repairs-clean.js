const express = require('express');
const router = express.Router();

const repairs = [
    { id: 1, vehicle_id: 1, engineer_id: 1, registration_number: 'CAB-1234', vehicle_type: 'Ambulance', hospital_name: 'Base Hospital Colombo', repair_details: 'Engine overheating problem needs fixing', engineer_name: 'Engineer John', engineer_email: 'engineer@hospital.com', engineer_signature: 'Engineer John', status: 'pending', inspection_date: '2024-01-10', created_at: '2024-01-10' },
    { id: 2, vehicle_id: 2, engineer_id: 1, registration_number: 'CAB-5678', vehicle_type: 'Van', hospital_name: 'MOH Office Gampaha', repair_details: 'Brake system needs replacement', engineer_name: 'Engineer John', engineer_email: 'engineer@hospital.com', engineer_signature: 'Engineer John', status: 'sent_to_rdhs', inspection_date: '2024-01-11', created_at: '2024-01-11' },
    { id: 3, vehicle_id: 3, engineer_id: 1, registration_number: 'WP-AB-9012', vehicle_type: 'Car', hospital_name: 'Base Hospital Kalutara', repair_details: 'Transmission issue fixed', engineer_name: 'Engineer John', engineer_email: 'engineer@hospital.com', engineer_signature: 'Engineer John', status: 'approved', inspection_date: '2024-01-12', created_at: '2024-01-12' }
];

router.get('/', (req, res) => res.json({ success: true, count: repairs.length, data: repairs }));
router.get('/status/:status', (req, res) => { const filtered = repairs.filter(r => r.status === req.params.status); res.json({ success: true, count: filtered.length, data: filtered }); });
router.get('/engineer/:engineerId', (req, res) => { const filtered = repairs.filter(r => r.engineer_id === parseInt(req.params.engineerId)); res.json({ success: true, count: filtered.length, data: filtered }); });
router.get('/stats/summary', (req, res) => { const statusCount = [{ status: 'pending', count: repairs.filter(r => r.status === 'pending').length }, { status: 'sent_to_rdhs', count: repairs.filter(r => r.status === 'sent_to_rdhs').length }, { status: 'approved', count: repairs.filter(r => r.status === 'approved').length }, { status: 'rejected', count: repairs.filter(r => r.status === 'rejected').length }]; res.json({ success: true, data: { statusCount, monthlyStats: [{ month: '2024-01', count: repairs.length, approved_count: repairs.filter(r => r.status === 'approved').length }] } }); });
router.get('/:id', (req, res) => { const repair = repairs.find(r => r.id === parseInt(req.params.id)); if (!repair) return res.status(404).json({ success: false, error: 'Not found' }); res.json({ success: true, data: { ...repair, history: [{ status: 'created', officer_name: repair.engineer_name, officer_role: 'engineer', updated_at: repair.created_at, comments: 'Request initiated' }] } }); });
router.post('/', (req, res) => { const newRepair = { id: repairs.length + 1, ...req.body, created_at: new Date().toISOString() }; repairs.push(newRepair); res.status(201).json({ success: true, message: 'Created', repairId: newRepair.id, data: newRepair }); });
router.put('/:id/status', (req, res) => { const repair = repairs.find(r => r.id === parseInt(req.params.id)); if (!repair) return res.status(404).json({ success: false, error: 'Not found' }); repair.status = req.body.status || repair.status; res.json({ success: true, message: 'Updated', data: repair }); });
router.delete('/:id', (req, res) => { const index = repairs.findIndex(r => r.id === parseInt(req.params.id)); if (index === -1) return res.status(404).json({ success: false, error: 'Not found' }); repairs.splice(index, 1); res.json({ success: true, message: 'Deleted' }); });

module.exports = router;
