const express= require("express")
const dotenv= require("dotenv")
const cors= require("cors")
const mongoose= require("mongoose")
 dotenv.config()

const app = express();
mongoose.connect(process.env.MONGODB_URL).then(()=>console.log("mongodb connected")
).catch((err)=>console.log("some error occured", err)
)


 app.use(cors())

 const PORT = process.env.PORT || 4000
 app.listen(PORT,()=>{
    console.log("server is running on ", PORT);
    
 })