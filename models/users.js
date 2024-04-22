
const mongoose = require("mongoose");
const validator = require("validator");
// **********************************************************
const bcryptjs = require("bcryptjs")
// **********************************************************
const jwt = require("jsonwebtoken")
// **********************************************************

const UserSchema = new mongoose.Schema({

    FName: {
        type: String,
        required: true,
        trim: true
    },
    LName: {
        type: String,
        required: true,
        trim: true
    },
    Username: {
        type: String,
        required: true,
        trim: true
    },
    Password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate(value) {
            const password = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

            if (!password.test(value)) {
                throw new Error("Password must include uppercase , lowercase , numbers , speacial characters")
            }
        }
    },
    Email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error("Email is invalid")
            }
        }
    },
    Age: {
        type: Number,
        default: 18,
        trim: true,
        validate(val) {
            if (val <= 0) {
                throw new Error("Age Must Be Positive Value")
            }
        }
    },
    City: {
        type: String,
        required: true,
        trim: true
    },
    tokens: [
        {
            type: String,
            required: true,
            trim: true
        }
    ]

})

UserSchema.virtual('tasks', {
    ref: 'Task',
    localField: "_id",
    foreignField: "owner"
})

// ************************************************************* 

UserSchema.pre("save", async function () {

    const user = this                   //  اللى هيكتبها المستخدم  Document  عايده على   this
    console.log(user)

    if (user.isModified('Password')) {
        user.Password = await bcryptjs.hash(user.Password, 8)
    }

})


// ************************************************************* 

// Login 

UserSchema.statics.findByCredentials = async (UserName, pass) => {

    const user = await User.findOne({ Username: UserName })

    if (!user) {
        throw new Error("Unable To Login")
    }

    const Check_Password = await bcryptjs.compare(pass, user.Password)

    if (!Check_Password) {
        throw new Error("Unable To Login")
    }

    return user
}


// **************************************************************

// Token

UserSchema.methods.generateToken = async function () {

    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, "osama123")

    user.tokens = user.tokens.concat(token)
    await user.save()

    return token
}

// **************************************************************

// hide private data

UserSchema.methods.toJSON = function () {
    const user = this

    // convert a document to object  ==>  toObject()

    const userObject = user.toObject()

    delete userObject.Password
    delete userObject.tokens

    return userObject
}

// **************************************************************

const User = mongoose.model('User', UserSchema)

module.exports = User;