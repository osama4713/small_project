
// ************************************************************************************************************

// const  jwt = require ('jsonwebtoken')

// const mytoken = ()=>{
//     const token = jwt.sign({_id : "123456789" } , "osama123" )
//     console.log(token)

//     const tokenVerify = jwt.verify(token , "osama123")
//     console.log(tokenVerify)
// }
// mytoken()

// ************************************************************************************************************

require('../db/mongoose')
const UserRouter = require("../routers/user")
const TaskRouter = require("../routers/task")
const express = require("express");


const app = express();

const port = process.env.PORT || 3000;

app.use(express.json())                 //  هاااااااااااااااااااااااااااااام

app.use(UserRouter)
app.use(TaskRouter)

// ************************************************************************************************************

// relations 

// const Task = require('../models/task');

// const relationsfun = async () => {
//     const task = await Task.findById("661cca190887fc29441c5ac7")

//     await task.populate('owner')

//     console.log(task)
//     console.log(task.owner)
// } 

// relationsfun()

// ************************************************************************************************************

app.listen(port , () => {console.log("all done successful")})

