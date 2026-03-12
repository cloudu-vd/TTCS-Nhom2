const db = require('../config/db'); 
// --- QUẢN LÝ PHÒNG ---

exports.getAllRooms = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM rooms");
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addRoom = async (req, res) => {
    const { room_number, room_type, price_per_month, description } = req.body;
    try {
        const sql = "INSERT INTO rooms (room_number, room_type, price_per_month, status, description) VALUES (?, ?, ?, 0, ?)";
        const [result] = await db.query(sql, [room_number, room_number, room_type, price_per_month, description]);
        res.status(201).json({ message: "Thêm phòng thành công!", id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- QUẢN LÝ THIẾT BỊ  ---

exports.getRoomEquipments = async (req, res) => {
    const { room_id } = req.params;
    try {
        const [rows] = await db.query("SELECT * FROM equipments WHERE room_id = ?", [room_id]);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateEquipmentStatus = async (req, res) => {
    const { id, condition_status } = req.body;
    try {
        await db.query("UPDATE equipments SET condition_status = ? WHERE id = ?", [condition_status, id]);
        res.status(200).json({ message: "Cập nhật tình trạng thiết bị thành công!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};