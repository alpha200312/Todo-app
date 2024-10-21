// var http=require('http')

//  http.createServer(function(request,response){
//     response.writeHead(200,{
//         'Content-Type':'text/plain'
//     });
//     response.end("hello node");}
// ).listen(3000,console.log("connected to server port 3000"))  //used with http now we will make server using express

const express=require('express');
const app=express();
const color=require('color');
const morgan=require('morgan');
const dotenv=require('dotenv');
const {connectdb,data}=require('./config/db');
dotenv.config({path:"./config/config.env"});
connectdb();
app.use(express.json()) //for parsing request which is in json  format
// app.use(express.json({

// }))
app.use(morgan('dev'));   //morgan gives the detail of request running in console
 
app.use((req,res,next)=>{
    req.title=data();
   
    console.log("middleware called");
    next();
})

// app.get('/todo', (req, res) => {             //for get request res for sending response of status and json file too
//     res.status(200).json({"name":"omkar",
//         "ttile":data()
//     });;    

// });

/// to call the router and use to add it in middleware 
const router=require('./routes/user')
app.use('/todo/auth',router);








const port=process.env.PORT
app.listen(port,console.log('server running on port :'+port));