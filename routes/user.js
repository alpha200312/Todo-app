const express=require('express');
const router = express.Router();
const User=require("../models/User");
const bcryptjs=require("bcryptjs");

const user_jwt=require('../middleware/user_jwt');
const jwt=require('jsonwebtoken');
router.post('/login', async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {

        let user = await User.findOne({
            email: email
        });

        if(!user) {
            return res.status(400).json({
                success: false,
                msg: 'User not exists go & register to continue.'
            });
        }


        const isMatch = await bcryptjs.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({
                success: false,
                msg: 'Invalid password'
            });
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload, process.env.jwtUserSecret,
            {
                expiresIn: 360000
            }, (err, token) => {
                if(err) throw err;

                res.status(200).json({
                    success: true,
                    msg: 'User logged in',
                    token: token,
                    user: user
                });
            }
        )

    } catch(error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            msg: 'Server Error'
        })
    }
});

router.get('/',user_jwt,async (req,res,next)=>{
   try {
    const id=req.user.id;
    const user= await User.findById(id).select('-password');
    console.log(user);
    res.status(200).json({
        success:true,
        user:user
    })
    console.log("printed");
    
   } catch (error) {
    console.log(error.message);
    res.status(500).json({
        success:false,
        msg:'server error'
    })
   }
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
