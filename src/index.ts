import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';
import dotenv from 'dotenv'
dotenv.config()

const app = express();
app.use(cors({
  credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app)
server.listen(8080, ()=>{
  console.log("server running");
})


//DB CONNECTION
const MONGODB_PASSWORD: string = process.env.MONGO_DB_PASSWORD || ""

const MONOGO_URL = "mongodb+srv://viktor007:Legacy123@cluster0.ytncu2a.mongodb.net/?retryWrites=true&w=majority"
mongoose.Promise = Promise;
mongoose.connect(MONOGO_URL);
//DB CONNECTION 
mongoose.connection.on('connected', ()=>{
  console.log("CONNNECTED");
})
// DB SUCCESS
mongoose.connection.on('error', (error: Error) => console.log(error));
app.use('/', router());