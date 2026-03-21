const express = require("express");
const mysql = require("mysql2/promise");
const app = express();

app.use(express.json());

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "hantoan2k5",
  database: "quanli_tro"
});

app.get("/", (req, res) => {
  res.send("Boarding House API running...");
});

app.get("/prices", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM prices ORDER BY id DESC LIMIT 1"
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Chưa có dữ liệu" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post("/prices", async (req, res) => {
  try {
    const { dien, nuoc } = req.body;

    if (!dien || !nuoc) {
      return res.status(400).json({
        message: "Thiếu dữ liệu"
      });
    }

    const [result] = await db.query(
      "INSERT INTO prices (dien, nuoc) VALUES (?, ?)",
      [dien, nuoc]
    );

    res.json({
      message: "Cập nhật giá thành công",
      id: result.insertId
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

app.post("/invoice", async (req, res) => {
  try {
    const { room_id, tenant_id, dien_sudung, nuoc_sudung, month, year } = req.body;

    if (!room_id || !tenant_id || !month || !year) {
      return res.status(400).json({
        message: "Thiếu dữ liệu"
      });
    }

    const [rooms] = await db.query(
      "SELECT * FROM rooms WHERE id = ?",
      [room_id]
    );

    if (rooms.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy phòng"
      });
    }

    const [prices] = await db.query(
      "SELECT * FROM prices ORDER BY id DESC LIMIT 1"
    );

    if (prices.length === 0) {
      return res.status(404).json({
        message: "Chưa có giá điện nước"
      });
    }

    const room = rooms[0];
    const price = prices[0];

    const tien_dien = (dien_sudung || 0) * price.dien;
    const tien_nuoc = (nuoc_sudung || 0) * price.nuoc;
    const tien_phong = room.price;
    const tong_tien = tien_phong + tien_dien + tien_nuoc;

    const [result] = await db.query(
      `INSERT INTO invoices 
      (room_id, tenant_id, month, year, room_price, dien_sudung, gia_dien, tien_dien, nuoc_sudung, gia_nuoc, tien_nuoc, tien_phong, tong_tien)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        room_id,
        tenant_id,
        month,
        year,
        room.price,
        dien_sudung || 0,
        price.dien,
        tien_dien,
        nuoc_sudung || 0,
        price.nuoc,
        tien_nuoc,
        tien_phong,
        tong_tien
      ]
    );

    res.json({
      message: "Tạo hóa đơn thành công",
      invoice_id: result.insertId,
      tong_tien
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/invoices", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM invoices ORDER BY created_at DESC"
    );

    res.json(rows);

  } catch (err) {
    res.status(500).json(err);
  }
});

app.put("/invoices/:id/pay", async (req, res) => {
  try {
    const id = req.params.id;

    const [result] = await db.query(
      "UPDATE invoices SET status = 'paid' WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Không tìm thấy hóa đơn"
      });
    }

    res.json({
      message: "Đã thanh toán"
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

app.listen(4000, () => {
  console.log("🚀 Server running on http://localhost:4000");
});