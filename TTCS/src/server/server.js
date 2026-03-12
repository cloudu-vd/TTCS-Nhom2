const express = require("express");
const app = express();
const roomRoutes = require('../routes/roomRoute'); 

app.use(express.json());

// Sử dụng route cho module phòng
app.use('/api/rooms', roomRoutes);

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});