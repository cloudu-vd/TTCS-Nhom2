const db = require("../db");

// GET ALL
exports.getAllTenants = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM tenants");
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
};

// CREATE
exports.createTenant = async (req, res) => {
    const { full_name, phone, cccd, address } = req.body;

    try {
        const sql = `
            INSERT INTO tenants (full_name, phone, cccd, address)
            VALUES (?, ?, ?, ?)
        `;

        await db.query(sql, [full_name, phone, cccd, address]);

        res.json({ message: "Thêm khách thành công" });
    } catch (err) {
        res.status(500).json(err);
    }
};

// UPDATE
exports.updateTenant = async (req, res) => {
    const id = req.params.id;
    const { full_name, phone, cccd, address } = req.body;

    try {
        const sql = `
            UPDATE tenants 
            SET full_name=?, phone=?, cccd=?, address=? 
            WHERE id=?
        `;

        await db.query(sql, [full_name, phone, cccd, address, id]);

        res.json({ message: "Cập nhật thành công" });
    } catch (err) {
        res.status(500).json(err);
    }
};

// DELETE
exports.deleteTenant = async (req, res) => {
    const id = req.params.id;

    try {
        await db.query("DELETE FROM tenants WHERE id=?", [id]);
        res.json({ message: "Xóa thành công" });
    } catch (err) {
        res.status(500).json(err);
    }
};