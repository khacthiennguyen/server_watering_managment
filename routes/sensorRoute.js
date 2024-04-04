const express = require('express')
const { createSensor, getAllSensor } = require('../controllers/sensorController')

//routes object 
const router = express.Router()

//routes 
router.get('/getAll',getAllSensor)

router.post('/create',createSensor)


module.exports = router