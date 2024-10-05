class SensorSocketService {
  constructor(io) {
    this.io = io;
  }

  connection(socket) {
    console.log(`New connection: ${socket.id}`.bgGreen);

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`.bgRed);
    });

    socket.on("SENSORDATA", (data) => {
      console.log("Received SENSORDATA:", data);
      this.io.emit("SENSORDATA-SERVER", data);
    });
  }
}

module.exports = SensorSocketService;