const mongoose= require('mongoose');
const connectdb=async()=>{
    const db=await mongoose.connect(process.env.MONGO);
    console.log("connection succesful "+db.connection.host);
    d=db.connection.host;

}
const data=()=>d;

module.exports={connectdb,data};
