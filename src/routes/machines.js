const express = require('express');
const router = express.Router();
const MachineController = require('../controllers/MachineController');
const adminauth = require('../middleware/adminAuth');

/**
 * Private routes
 */
router.get('/api/admin/machines',adminauth,MachineController.getAllMachines);

router.post('/api/admin/machines',adminauth, MachineController.createMachine);

router.get('/api/admin/machines/:id',adminauth, MachineController.getMachineByID);

router.put('/api/admin/machines/:id',adminauth,MachineController.updateMachineById);

router.delete('/api/admin/machines/:id',adminauth, MachineController.deleteMachineByID);

module.exports = router;