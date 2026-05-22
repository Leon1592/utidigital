const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const { authorize } = require('../middleware/authMiddleware');

router.post('/', authorize('Admin'), userController.createUser);
router.get('/', userController.getUsers);
router.delete('/:id', authorize('Admin'), userController.deleteUser);

module.exports = router;