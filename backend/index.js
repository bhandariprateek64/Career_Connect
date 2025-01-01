import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectdb from './utils/database.js';
import userRouter from './routes/user.route.js';
dotenv.config({});
const app = express();
//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//Routes
app.use('/', userRouter);
const corsOptions = {
  origin: 'http//localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;
connectdb()
  .then(() => {
    console.log('DB CONNECTED SUCESSFULLY');
    app.listen(PORT, () => {
      console.log(`Server is listening at ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('ERROR IN CONNECTING DB:', error);
  });
