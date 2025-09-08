import {  PrismaClient } from '@prisma/client';
import express, { Response,Request } from 'express';
import dotenv from "dotenv";
import AuthRoute from "./routes/auth.route";
import userRoute from "./routes/user.route"
import AttendanceRouter from './routes/attendance.route';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { MenuRouter } from './routes/sidebar.routes';
import cors from "cors"

dotenv.config();
const app = express();
export const prisma=new PrismaClient();
console.log("cors",process.env.ORIGIN as string);
const corsOptions = {
    origin:process.env.ORIGIN as string | '*' , // Allow requests only from this origin
    credentials: true, //access-control-allow-credentials:true
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}));

app.get('/',(req:Request,res:Response)=>{
    res.send("server is running");
})
app.use('/',AuthRoute);

app.use("/",userRoute);
app.use("/",AttendanceRouter);
app.use("/",MenuRouter);




const startServer = async (): Promise<void> => {
    try {
        // await connectRedis();
        // await suggestionRepository.createIndex();
        // await catchRepository.createIndex();

        app.listen(process.env.PORT,() => {
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    } };
  
startServer();
// app.listen(process.env.PORT,() => {
//     console.log(`Server is running on port ${process.env.PORT}`);
// })
