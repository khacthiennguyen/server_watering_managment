const moment = require("moment-timezone");
const sensorModel = require("../models/sensorModel");
const SensorSocketService = require("../services/sensorService").default;

//create
// Lấy thời gian hiện tại theo múi giờ Việt Nam
const vietnamTime = moment().tz("Asia/Ho_Chi_Minh"); 

// create sensor
const createSensor = async (req, res) => {
  if (!req.body.sensorId || !req.body.moisture || !req.body.location) {
    res.status(400).send({ message: "Please add moisture and location !" });
    return;
  }
  // //create
  const vietnamTime = moment().tz("Asia/Ho_Chi_Minh"); // Lấy thời gian hiện tại theo múi giờ Việt Nam
  const sensor = new sensorModel({
    sensorId: req.body.sensorId,
    day: vietnamTime.format("DD/MM/YYYY"),
    time: vietnamTime.format("HH:mm"),
    moisture: req.body.moisture,
    location: req.body.location,
    activate: true,
    autowater: true,
  });
  // Save đối tượng cảm biến đó vào trong db
  sensor
    .save(sensor)
    .then((data) => {
      res.status(201).send({
        success: true,
        message: "Add sensor successfully !",
        data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error create sensor API",
      });
    });
};

const getAllSensor = async (req, res) => {
  sensorModel
    .find()
    .sort({ createdAt: -1 })
    .then((data) => {
      res.send({
        success: true,
        message: "Find all sensor successfull",
        data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error with Find Sensor API",
      });
    });
};

const getAnalystic = async (req, res) => {
  try {
    const { frequency } = req.query;
    const startDate = moment(vietnamTime)
      .subtract(Number(frequency), "d")
      .toDate(); // Format ngày

      // $gte: dayjs().subtract(Number(frequency),'d').toDate(),

    const data = await sensorModel.find({
      day: { $gte: startDate },
    });

    res.status(200).send({
      success: true,
      message: "Find analyst data successful",
      data: data,
      // endate: endDate,
      startDate: startDate,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to find analyst data",
      error: error,
    });
  }
};

const getAllUniqueSensors = async (req, res) => {
  try {
    const uniqueSensors = await sensorModel.aggregate([
      { $group: { _id: "$sensorId", latestEntry: { $last: "$$ROOT" } } },
      { $replaceRoot: { newRoot: "$latestEntry" } },
      { $sort: { sensorId: 1 } },
    ]);
    if (uniqueSensors.length > 0) {
      res.send({
        success: true,
        message: "Successfully retrieved all unique sensors.",
        data: uniqueSensors,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "No sensors found.",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error retrieving unique sensors.",
    });
  }
};

const deActivateSensor = async (req, res) => {
  try {
    const sensorId = req.params.sensorId;
    const sensorExists = await sensorModel.findOne({ sensorId: sensorId });
    if (!sensorExists) {
      return res.status(400).send({
        success: false,
        message: "Sensor not found",
      });
    }
    const result = await sensorModel.updateMany(
      { sensorId: sensorId },
      { activate: false }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).send({ message: "No sensors were deActivate" });
    }
    _io.emit("DEACTIVESENSOR", "OFF" + sensorId);
    // // Flag to track whether DEACTIVESENSOR event was emitted successfully
    // let deactivationSuccessful = false;
    // // Listen for DEACTIVESENSOR event acknowledgment
    // _io.on("DEACTIVESENSOR", (ack) => {
    //   if (ack === "ACK") {
    //     deactivationSuccessful = true;
    //     console.log("DEACTIVESENSOR emit success.");
    //   }
    // });
    // // Timeout after 5 seconds if acknowledgment not received
    // setTimeout(() => {
    //   if (!deactivationSuccessful) {
    //     console.log("DEACTIVESENSOR event was not acknowledged.");
    //   }
    // }, 5000);

    res
      .status(200)
      .send({ message: `Deactive Sensor ${sensorId} successfully` });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error with deActivate Sensor API",
    });
  }
};

const activateSensor = async (req, res) => {
  try {
    const sensorId = req.params.sensorId;
    const sensorExists = await sensorModel.findOne({ sensorId: sensorId });
    if (!sensorExists) {
      res.status(400).send({
        success: false,
        message: "Sensor not found",
      });
    }
    const result = await sensorModel.updateMany(
      { sensorId: sensorId },
      { activate: true }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).send({ message: "No sensors were Activate" });
    }
    _io.emit("ACTIVESENSOR", "ON" + sensorId);
    res.status(200).send({ message: `Active Sensor ${sensorId} successfully` });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error with Activate Sensor API",
    });
  }
};

const disableAutoWater = async (req, res) => {
  try {
    const sensorId = req.params.sensorId;
    const sensorExists = await sensorModel.findOne({ sensorId: sensorId });
    if (!sensorExists) {
      return res.status(400).send({
        success: false,
        message: "Sensor not found",
      });
    }
    const result = await sensorModel.updateMany(
      { sensorId: sensorId },
      { autowater: false }
    );
    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .send({ message: "No sensors were disableAutoWater" });
    }
    _io.emit("OFFAUTO", "OFFAUTO" + sensorId);
    res
      .status(200)
      .send({ message: `disableAutoWater Sensor ${sensorId} successfully` });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error with disableAutoWater Sensor API",
    });
  }
};

const enableAutoWater = async (req, res) => {
  try {
    const sensorId = req.params.sensorId;
    const sensorExists = await sensorModel.findOne({ sensorId: sensorId });
    if (!sensorExists) {
      res.status(400).send({
        success: false,
        message: "Sensor not found",
      });
    }
    const result = await sensorModel.updateMany(
      { sensorId: sensorId },
      { autowater: true }
    );
    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .send({ message: "No sensors were enableAutoWater" });
    }
    _io.emit("ONAUTO", "ONAUTO" + sensorId);
    res
      .status(200)
      .send({ message: `enableAutoWater Sensor ${sensorId} successfully` });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error with enableAutoWater Sensor API",
    });
  }
};

const watering = async (req, res) => {
  try {
    const sensorId = req.params.sensorId;
    _io.emit("WATERING", "WATERING" + sensorId);
    res
      .status(200)
      .send({ message: `Watering Sensor ${sensorId} successfully` });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error with Watering Sensor API",
    });
  }
};

const stopWatering = async (req, res) => {
  try {
    const sensorId = req.params.sensorId;
    _io.emit("STOPWATERING", "STOPWATERING" + sensorId);
    res
      .status(200)
      .send({ message: `STOPWATERING Sensor ${sensorId} successfully` });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error with STOPWATERING Sensor API",
    });
  }
};

module.exports = {
  createSensor,
  getAllSensor,
  getAnalystic,
  getAllUniqueSensors,
  deActivateSensor,
  activateSensor,
  enableAutoWater,
  disableAutoWater,
  watering,
  stopWatering,
};
