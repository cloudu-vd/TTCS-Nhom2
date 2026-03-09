const db = require("../db");

exports.getAllTenants = (req, res) => {

    db.query("SELECT * FROM tenants", (err, result) => {

        if (err) {
            res.status(500).json(err);
        } else {
            res.json(result);
        }

    });

};

exports.createTenant = (req, res) => {

    const { full_name, phone, cccd, address } = req.body;

    const sql = `
        INSERT INTO tenants (full_name, phone, cccd, address)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [full_name, phone, cccd, address], (err, result) => {

        if (err) {
            res.status(500).json(err);
        } else {
            res.json({ message: "Thêm khách thành công" });
        }

    });

};

exports.updateTenant = (req, res) => {

    const id = req.params.id;

    const { full_name, phone, cccd, address } = req.body;

    const sql = `
        UPDATE tenants
        SET full_name=?, phone=?, cccd=?, address=?
        WHERE id=?
    `;

    db.query(sql, [full_name, phone, cccd, address, id], (err, result) => {

        if (err) {
            res.status(500).json(err);
        } else {
            res.json({ message: "Cập nhật thành công" });
        }

    });

};

exports.deleteTenant = (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM tenants WHERE id=?",
        [id],
        (err, result) => {

            if (err) {
                res.status(500).json(err);
            } else {
                res.json({ message: "Xóa thành công" });
            }

        }
    );

};