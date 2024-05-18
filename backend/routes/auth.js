const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser= require('../middleware/fetchuser');

const JWT_SECRET = 'sandykumargamedev';

//Route 1:create a user using post "/api/auth"
router.post('/createuser', [
    body('name', 'Enter a valid name.').isLength({ min: 3 }),
    body('email', 'Enter a valid email.').isEmail(),
    body('password', 'Password must be minimum 5 character.').isLength({ min: 5 }),
],  async (req, res) => {
    let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
           return res.status(400).json({sucess, errors: errors.array() });
        }
        try{
            //check whether the user with this email exists already
            let user = await User.findOne({email: req.body.email});
            if(user)
            {
               return res.status(400).json({success, error: "Sorry a user with email already exist."})
            }

            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);

            user = await User.create({
               name: req.body.name,
               email: req.body.email,
               password: secPass,
            });
            const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);

        // res.json(user)
        success = true;
        res.json({success, authtoken});

        } catch(error)
        {
           console.log(error.message);
           res.status(500).send("Some error occured");
        }
    })

//Route 2:Authentication a User using post "/api/auth/login".No login required
router.post('/login',[
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    let success = false
    //If there are errors, return bad reqest and the errors
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors: errors.array()});
    }

    const{email, password}= req.body;
    try{
        let user = await User.findOne({email});
        if(!user)
        {
            success = true;
            return res.status(400).json({success, error: "Please try to login with correct credentials"});
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare)
        {
            success = false;
            return res.status(400).json({success, error: "Please try to login with credentials"})
        }

        const data = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success ,authtoken});
    } catch(error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//Route3: Get loggedin user details using post "/api/auth/login".No login required
router.post ('/getuser', fetchuser, async(req, res) => {

    try{
      userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user);
    }   catch(error) {
            console.log(error.message);
            res.status(500).send("Internal Server Error");
        }
})
module.exports = router