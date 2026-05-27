require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./App/routes/web/auth");
const eventRoutes = require("./App/routes/web/events");

const app = express();
app.use(express.json());
//routes
app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)
// app.use('/api/bookings', require("./App/routes/web/booking"))

 app.use(cors())
 
 
 mongoose
   .connect(process.env.MONGODB_URL)
   .then(() => console.log("mongodb connected"))
   .catch((err) => console.log("some error occured", err));

 const PORT = process.env.PORT || 4000
 app.listen(PORT,()=>{
    console.log("server is running on ", PORT);
    
 })