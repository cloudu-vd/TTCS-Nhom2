const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// Đường dẫn lấy danh sách tất cả các phòng
// URL: GET http://localhost:4000/api/rooms
router.get('/', roomController.getAllRooms);

// Đường dẫn thêm phòng mới
// URL: POST http://localhost:4000/api/rooms/add
router.post('/add', roomController.addRoom);

module.exports = router;