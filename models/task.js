
const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    Title : {
        type : String,
        required : true,
        trim : true
    }, 
    Description : {
        type : String,
        required : true,
        trim : true
    },
    Completed : {
        type : Boolean,
        default : false,
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    }
})

const Task = mongoose.model('Task' , TaskSchema)

module.exports = Task
