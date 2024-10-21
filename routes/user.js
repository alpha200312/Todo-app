const express=require('express');
const router = express.Router();
const User=require("../models/User");
const bcryptjs=require("bcryptjs");

const user_jwt=require('../middleware/user_jwt');
const jwt=require('jsonwebtoken');

router.get('/',user_jwt,async (req,res,next)=>{
    const id=req.user.id;
    const user= await User.findById(id);
    console.log(user);
    console.log("printed");
    next();
    
    
    
})
router.post('/register', async (req, res, next) => {
   console.log("just entered the register")
   const { username, email, password } = req.body;

   try {
       
       let user_exist = await User.findOne({ email: email });

       if(user_exist) {
         
           return res.status(400).json({
               success: false,
               msg: 'User already exists'
           });
       }
       
       let user = new User();

       user.username = username;
       user.email = email;

       const salt = await bcryptjs.genSalt(10);
       user.password = await bcryptjs.hash(password, salt);

       let size = 200;
       user.avatar = "https://gravatar.com/avatar/?s="+size+'&d=retro';


       await user.save();
       console.log("user saved");

       const payload = {
           user: {
               id: user.id
           }
       }


       jwt.sign(payload, process.env.jwtUserSecret, {
           expiresIn: 360000
       }, (err, token) => {
           if(err) throw err;
           
           res.status(200).json({
               success: true,
               token: token
           });
       });

       console.log("user registered")

   } catch(err) {
       console.log(err);
       res.status(402).json({
           success: false,
           message: 'Something error occured'
       })
   }
});

module.exports=router;
