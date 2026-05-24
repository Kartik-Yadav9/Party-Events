const express= require("express")
const dotenv= require("dotenv")
const cors= require("cors")
const mongoose= require("mongoose")
const authRoutes = require("./App/routes/web/auth")
 dotenv.config()

const app = express();

//routes
app.use('/api/auth', authRoutes )

 app.use(cors())
 app.use(express.json())
 
 mongoose
   .connect(process.env.MONGODB_URL)
   .then(() => console.log("mongodb connected"))
   .catch((err) => console.log("some error occured", err));

 const PORT = process.env.PORT || 4000
 app.listen(PORT,()=>{
    console.log("server is running on ", PORT);
    
 })