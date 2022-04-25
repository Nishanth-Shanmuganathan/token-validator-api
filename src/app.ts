import { ErrorTypes } from './enums/errorTypes';
import mongoose from 'mongoose';
import express, { json } from 'express';
import cors from 'cors';
import appRouter from './routes/routes';

const app = express();

app.use(cors())
app.use(json())

app.use("", (res, req, next) => {
  console.log(res.method + " - " + res.path);
  next()
})

app.use('/api/v1', appRouter);

app.use("", (error, req, res, next) => {
  if (error?.name === ErrorTypes.MONGOOSE) {
    res.status(422).json({ error: (Object.values(error.errors)[0] as any)?.message })
  }
  res.status(400).json({ error: error.message })
})

mongoose.connect(process.env.DB_LINK)
  .then(res => {
    app.listen(process.env.PORT)
      .on("listening", () => {
        console.clear()
        console.log("\x1b[32m%s\x1b[0m", `Database connection established`);
        console.log("\x1b[32m%s\x1b[0m", `Express is listening at http://localhost:${process.env.PORT}`);
      })
      .on('error', err => {
        console.clear()
        console.log("\x1b[31m%s\x1b[0m", "Unable to start server because of the following error: ")
        console.log(err)
      });
  })
  .catch(err => {
    console.log(err)
  })
