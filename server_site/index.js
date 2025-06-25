import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import dbCon from "./Utils/database.js";

import router from "./routes/routers.js";
import bodyParser from "body-parser";


const app = express();



const allowedOrigins = ['https://job-hunt-ekpz.onrender.com'];
app.use(cors({
  origin: allowedOrigins, 
  credentials: true, 
}));


app.use(express.json());
app.use(bodyParser.json());
app.use(express.static("images"));
app.use(express.urlencoded({ extended: true }));



dbCon();


app.use('/api', router);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});