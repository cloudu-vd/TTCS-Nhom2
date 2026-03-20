const db = require("../db");

exports.createContract = async (req, res) => {
    const { tenant_id, room_id, start_date, deposit } = req.body;

    try {
        // 1. Check phòng
        const [room] = await db.query(
            "SELECT status FROM rooms WHERE id = ?",
            [room_id]
        );

        if (room.length === 0) {
            return res.status(404).json({ message: "Phòng không tồn tại" });
        }

        if (room[0].status === "occupied") {
            return res.status(400).json({ message: "Phòng đã có người thuê" });
        }

        // 2. Tạo hợp đồng
        await db.query(
            `INSERT INTO contracts 
            (tenant_id, room_id, start_date, deposit, status) 
            VALUES (?, ?, ?, ?, ?)`,
            [tenant_id, room_id, start_date, deposit, "active"]
        );

        // 3. Update phòng
        await db.query(
            "UPDATE rooms SET status = ? WHERE id = ?",
            ["occupied", room_id]
        );

        res.status(201).json({
            message: "Tạo hợp đồng + cập nhật phòng thành công!"
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.endContract = async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Lấy hợp đồng
        const [contract] = await db.query(
            "SELECT * FROM contracts WHERE id = ?",
            [id]
        );

        if (contract.length === 0) {
            return res.status(404).json({ message: "Hợp đồng không tồn tại" });
        }

        // 2. Kiểm tra đã kết thúc chưa
        if (contract[0].status === "ended") {
            return res.status(400).json({ message: "Hợp đồng đã kết thúc rồi" });
        }

        const room_id = contract[0].room_id;

        // 3. Cập nhật trạng thái hợp đồng
        await db.query(
            "UPDATE contracts SET status = ? WHERE id = ?",
            ["ended", id]
        );

        // 4. Cập nhật trạng thái phòng → trống
        await db.query(
            "UPDATE rooms SET status = ? WHERE id = ?",
            ["available", room_id]
        );

        res.status(200).json({
            message: "Kết thúc hợp đồng thành công, phòng đã được trả!"
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};