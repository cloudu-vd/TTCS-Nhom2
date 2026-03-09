const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const tenantRoutes = require("./routes/tenantRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/tenants", tenantRoutes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log("Server đang chạy tại http://localhost:5000");
});