const mongoose = require("mongoose");
const sensorSchema = new mongoose.Schema(
  {
    sensorId: {
      type: String,
      required: [true],
    },
    day: {
      type: String,
      required: [true],
    },
    time: {
      type: String,
      required: [true],
    },
    moisture: {
      type: String,
      required: [true],
    },
    location: {
      type: String,
      required: [true],
    },
    activate: {
      type: String,
      required: [true],
    },
    autowater: {
      type: String,
      required: [true],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("sensor", sensorSchema);
