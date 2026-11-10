require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 5000;


// Mongodb Connection

mongoose.connect(process.env.MONGO_URI)
 .then(() =>{
    console.log("MongoDB Connected");
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    });
 })
 .catch((err)=>{
    console.error("Database connection failed:", err.message);
    process.exit(1);
 }); 