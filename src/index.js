import express from 'express';
import { config } from 'dotenv';
import router from './routes/router.js'

config();

const app = express();
const port = process.env.PORT;

app.use('/api', router);

app.listen(port, () => {
  console.log(`[server]: GET simple random : http://localhost:${port}/api/get`);
});