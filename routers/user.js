
const express = require("express");
const User = require("../models/users");
const auth = require("../middleware/auth");

const router = express.Router();

router.post('/users', (req, res) => {
    // console.log(req.body);

    const user = new User(req.body)
    user.save()

        .then((user) => (res.status(200).send(user)))
        .catch((e) => (res.status(400).send(e)))
})

// *****************************************************
// Get

router.get('/users',auth,(req, res) => {
    User.find({}).then((users) => {
        res.status(200).send(users)
    }).catch((e) => {
        res.status(500).send(e)
    })
})

// *****************************************************

router.get('/users/:id',auth, (req, res) => {
    const _id = req.params.id;
    User.findById(_id).then((users) => {
        if (!users) {
            return res.status(404).send("User Not Found")
        }
        res.status(200).send(users)
    }).catch((e) => {
        res.status(500).send(e)
    })
})

// *****************************************************

// patch

router.patch('/users/:id' ,auth, async(req , res) => {
    try{
        const updatas = Object.keys(req.body) 

        const _id = req.params.id;

        // ******************

        // const user = await User.findByIdAndUpdate(_id , req.body , {
        //     new : true,
        //     runValidators : true
        // })

        // ******************

        const user = await User.findById(_id)

        if(!user){
            return res.status(404).send("User Not Found")
        }

        updatas.forEach((ele) => (user[ele] = req.body[ele]))

        await user.save()

        res.status(200).send(user)
    }
    catch(error){
        res.status(500).send(error)
    }
})

// *****************************************************

// Delete

router.delete('/users/:id' ,auth, async(req , res) => {
    try{
        const _id = req.params.id;
        const user = await User.findByIdAndDelete(_id)
        if(!user){
            return res.status(404).send("User Not Found")
        }
        res.status(200).send(user)
    }
    catch(error){
        res.status(500).send(error)
    }
})

// **********************************************************************************************************

// Login

router.post('/login' , async (req , res) =>{
    try{

        const user = await User.findByCredentials(req.body.Username , req.body.Password)
        
        const token = await user.generateToken()
        res.status(200).send({ user , token})

    }catch(e){
        res.status(400).send(e.message)
    }
})

// **********************************************************************************************************

// Token

router.post('/users' , async (req , res) => {
    try{
        const user = new User(req.body)
        const token = await user.generateToken()
        
        await user.save()
        res.status(200).send({ user , token})

    }catch(e){
        res.status(200).send(e.message)
    }
})

// **********************************************************************************************************

// profile

router.get('/profile' ,auth, async (req , res) => {
    res.status(200).send(req.user)
})

// **********************************************************************************************************

// logout

router.delete('/logout' ,auth, async (req , res) => {
    try{
        req.user.tokens = req.user.tokens.filter((ele) =>{
            return ele !== req.token
        })
        await res.user.save()
        res.send()

    }catch(e){
        res.status(500).send(e.message)
    }

})

// **********************************************************************************************************

// logOutAll

router.delete('/logoutAll',auth, async (req , res) => {
    try{
        req.user.tokens =[]
        await req.user.save()
        res.send()

    }catch(e){
        res.status(500).send(e.message)
    }
})


// **********************************************************************************************************


module.exports = router;
