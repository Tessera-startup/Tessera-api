import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';
import dotenv from 'dotenv'
import { Server } from 'socket.io';
import { clusterApiUrl } from '@solana/web3.js';
import { requestTestToken } from '../src/helpers/solana.helpers';


const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
dotenv.config()

const app = express();
app.use(cors({
  // credentials: true,
  origin:'*'
}));

app.use('/qrcodes', express.static('qrcodes'));
app.use('/events', express.static('events'));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());


const server = http.createServer(app)
const io = new Server(server);



server.listen(8080, ()=>{
  // requestTestToken("7H99eDCrfhJergBgHCusuQSV2UfYc5rvfdKAUKHnBSA4")
 

  console.log("server running");
})


//DB CONNECTION
const MONGODB_PASSWORD: string = process.env.MONGO_DB_PASSWORD || ""

const MONOGO_URL = `mongodb+srv://viktor007:${MONGODB_PASSWORD}@cluster0.ytncu2a.mongodb.net/?retryWrites=true&w=majority`


mongoose.Promise = Promise;
mongoose.connect(MONOGO_URL);
//DB CONNECTION 
mongoose.connection.on('connected', ()=>{
  console.log("CONNNECTED");
})
// DB SUCCESS
mongoose.connection.on('error', (error: Error) => console.log(error));
app.use('/', router());