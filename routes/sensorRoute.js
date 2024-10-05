const express = require("express");
const {
  createSensor,
  getAllSensor,
  deActivateSensor,
  activateSensor,
  getAllUniqueSensors,
  disableAutoWater,
  enableAutoWater,
  watering,
  stopWatering,
  getAnalystic,
} = require("../controllers/sensorController");

//routes object
const router = express.Router();

//routes
router.get("/getAll", getAllSensor);
router.get("/getallUnique", getAllUniqueSensors);
router.get("/getAnalystic", getAnalystic);

router.post("/create", createSensor);

router.post("/watering/:sensorId", watering);

router.post("/stopWatering/:sensorId", stopWatering);

router.put("/deactivate/:sensorId", deActivateSensor);

router.put("/activate/:sensorId", activateSensor);

router.put("/disableAutoWater/:sensorId", disableAutoWater);

router.put("/enableAutoWater/:sensorId", enableAutoWater);




module.exports = router;
