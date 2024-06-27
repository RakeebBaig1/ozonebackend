const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")


const generateToken = (id)=>{
    return jwt.sign(
        {id}, process.env.JWT_SECRET, {expiresIn: '2d'})
}

const tokenParameters = {
    path: '/',
    expires: new Date(Date.now() + 1000 * 86400),
    httpOnly: true,
    // secure: true,
    // sameSite: 'none'
}

//register user
module.exports.registerUser = asyncHandler( async(req, res, next)=>{

    console.log("register")
    const { name, email, password, username  } = req.body
    if(!name || !email || !password || !username)
    {
        res.status(400)
        throw new Error('Please add all fields')
    }
    
    if(password.length < 6)
    {
        res.status(400)
        throw new Error("Password must be upto 6 characters")
    }

    //check if user exists
    const user = await User.findOne({ $or: [{ email }, { username }] });
    console.log("user", user)
    if(user)
    {
        res.status(400)
        throw new Error('User with this email or username already exists')
    }

    const newUser = await User.create({
        name, email, password, username
    })

    const token = generateToken(newUser._id)

    if(newUser)
    {
        const { _id, name, email, username } = newUser

        res.cookie("token", token, tokenParameters )

        res.status(201).json({
            msg: "user created successfully",
            _id, name, email, username, token
        })
    }

})

//login user
module.exports.loginUser = asyncHandler( async(req, res, next)=>{
    const { username, password } = req.body
    console.log("req", req.body)

    if(!username || !password)
    {
        res.status(400)
        throw new Error("Please fill in all fields")
    }
    const user = await User.findOne({username})
    if(!user)
    {
        res.status(400)
        throw new Error('User with this username not found')
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)

    console.log("password match", isPasswordMatch)
    
    if(user && isPasswordMatch)
    {
        const token = generateToken(user._id)
        const { _id, name, email, username } = user
        
        console.log("user", user)
        res.cookie("token", token, tokenParameters)
        res.status(200).json({_id, name, email, username, token})
    }
    else{
        res.status(404)
        throw new Error('Invalid credentials')
    }
})

module.exports.logoutUser = asyncHandler(async(req, res, next)=>{
    console.log("logout")
    res.cookie("token", "", {
        maxAge: 1,
        path: "/",
        expires: new Date(0),
        httpOnly: true
    })
    res.status(200).json({
        message: "Suucessfully LoggedOut"
})
})