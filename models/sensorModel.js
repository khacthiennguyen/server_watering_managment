const mongoose = require("mongoose")
 const sensorSchema = new mongoose.Schema({
    sensorId:{
        type:String,
        required: [true],

    },
    day:{
        type:String,
        required: [true],
    },
    time:{
        type:String,
        required: [true],
    },
    moisture:{
        type:String,
        required: [true],

    },
    location:{
        type:String,
        required: [true],
    },
<<<<<<< HEAD
    activate:{
        type:String,
        required: [true],
    }
=======
  activate:{
   type:String,
        required: [true],
  }
>>>>>>> 4b9b9a368a58a4a7e8f75e5f360720e76a1b7f67

 },{timestamps:true})

 module.exports = mongoose.model('sensor',sensorSchema)
