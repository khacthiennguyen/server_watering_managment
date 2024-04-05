const moment = require('moment-timezone');
const sensorModel = require("../models/sensorModel");

// create sensor
const createSensor = async (req, res) => {
  if (!req.body.sensorId || !req.body.moisture || !req.body.location) {
    res.status(400).send({ message: "Please add moisture and location !" });
    return;
  }
  //create
  const vietnamTime = moment().tz('Asia/Ho_Chi_Minh'); // Lấy thời gian hiện tại theo múi giờ Việt Nam
  const sensor = new sensorModel({
    sensorId: req.body.sensorId,
    day: vietnamTime.format("L"), //11/04/2023
    time: vietnamTime.format("LT"), //21:07
    moisture: req.body.moisture,
    location: req.body.location,
    activate : true,
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
  sensorModel.find().sort({createdAt:-1})
    .then((data) => {
      res.send({
        success:true,
        message: 'Find all sensor successfull',
        data
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error with Find Sensor API",
      });
    });
};

module.exports = { createSensor,getAllSensor };
