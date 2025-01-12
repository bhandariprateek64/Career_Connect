import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectdb from './utils/database.js';
import userRouter from './routes/user.route.js';
import companyRouter from './routes/comapny.route.js';
import jobRouter from './routes/job.route.js';
import applicationRouter from './routes/application.route.js';
import path from 'path';
dotenv.config({});
const _dirname = path.resolve();
const app = express();
//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: 'https://career-connect-grdh.onrender.com',
  credentials: true,
};
app.use(cors(corsOptions));

//Routes
app.use('/api/v1/application', applicationRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/company', companyRouter);
app.use('/api/v1/job', jobRouter);
app.use(express.static(path.join(_dirname, '/frontend/dist')));
app.get('*', (_, res) => {
  res.sendFile(path.resolve(_dirname, 'frontend', 'dist', 'index.html'));
});
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
