import express from 'express';
import { config } from 'dotenv';
import router from './routes/router.js'
import { dbConnectionTest } from './util/prismaUtils.js'
import logger from './util/logger.js';


config();

const app = express();
const port = process.env.PORT;

app.use('/api', router);

const server = app.listen(port, () => {
  console.log(`[server]: GET simple random : http://localhost:${port}/api/get`);
});

// database connection teste
if (!(await dbConnectionTest())) {
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  })
}
