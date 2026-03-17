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
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json(err);
  }
});


app.get("/prices/electricity", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT dien FROM prices ORDER BY id DESC LIMIT 1"
    );

    res.json({
      electricity_price: rows[0].dien
    });

  } catch (err) {
    res.status(500).json(err);
  }
});



app.get("/prices/water", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT nuoc FROM prices ORDER BY id DESC LIMIT 1"
    );

    res.json({
      water_price: rows[0].nuoc
    });

  } catch (err) {
    res.status(500).json(err);
  }
});


app.post("/invoices", async (req, res) => {

  try {

    const {
      room_id,
      tenant_id,
      month,
      year,
      room_price,
      dien_sudung,
      nuoc_sudung
    } = req.body;
    const [price] = await db.query(
      "SELECT dien, nuoc FROM prices ORDER BY id DESC LIMIT 1"
    );

    const gia_dien = price[0].dien;
    const gia_nuoc = price[0].nuoc;

    const tien_dien = dien_sudung * gia_dien;
    const tien_nuoc = nuoc_sudung * gia_nuoc;

    const tien_phong = room_price;

    const tong_tien = tien_phong + tien_dien + tien_nuoc;

    const sql = `
      INSERT INTO invoices
      (room_id, tenant_id, month, year, room_price,
       dien_sudung, gia_dien, tien_dien,
       nuoc_sudung, gia_nuoc, tien_nuoc,
       tien_phong, tong_tien)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      room_id,
      tenant_id,
      month,
      year,
      room_price,
      dien_sudung,
      gia_dien,
      tien_dien,
      nuoc_sudung,
      gia_nuoc,
      tien_nuoc,
      tien_phong,
      tong_tien
    ]);

    res.json({
      message: "Invoice created",
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

    await db.query(
      "UPDATE invoices SET status = 'paid' WHERE id = ?",
      [id]
    );

    res.json({
      message: "Invoice marked as paid"
    });

  } catch (err) {
    res.status(500).json(err);
  }

});

app.post("/prices", async (req, res) => {
  try {

    const { dien, nuoc } = req.body;

    const sql = `
      INSERT INTO prices (dien, nuoc)
      VALUES (?, ?)
    `;

    const [result] = await db.query(sql, [dien, nuoc]);

    res.json({
      message: "Price updated successfully",
      id: result.insertId
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
