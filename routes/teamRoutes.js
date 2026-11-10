const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const auth = require('../middleware/auth-middleware');
const admin = require('../middleware/admin-middleware');

router.get('/', teamController.getAllMembers);
router.get('/:id', teamController.getMemberById);

// protected
router.post('/', auth, admin, teamController.createMember);
router.put('/:id', auth, admin, teamController.updateMember);
router.delete('/:id', auth, admin, teamController.deleteMember);

module.exports = router;