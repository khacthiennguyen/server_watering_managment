const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const http = require("http"); // Import thêm module http
const SensorSocketServiceClass = require("./services/sensorService");

//dotenv
dotenv.config();

//mongodb connection
connectDB();

//rest object
const app = express();

//create server
const server = http.createServer(app); // Tạo server HTTP từ Express app

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to watering app",
  });
});
app.use("/api/v1/auth", require("./routes/userRoutes"));
app.use("/api/v1/sensor", require("./routes/sensorRoute"));

//port
const PORT = process.env.PORT || 8090;

//listen
server.listen(PORT, () => {
  console.log(`Server running ${PORT}`.bgGreen.white);
});

//Socket service server
const io = require("socket.io")(server); // Truyền server HTTP vào socket.io() để lắng nghe kết nối từ client
global._io = io;
const sensorSocketService = new SensorSocketServiceClass(io);
// Handling connections
io.on("connection", (socket) => {
  sensorSocketService.connection(socket);
});
