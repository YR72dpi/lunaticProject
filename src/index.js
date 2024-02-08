import express from 'express';
import { config } from 'dotenv';
import router from './routes/router.js'
import routerDev from './routes/router.dev.js'
import { dbConnectionTest } from './utils/prismaUtils.js'
import logger from './utils/logger.js';
import cluster from 'node:cluster';
import * as os from "os";

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log(`Master process ${process.pid} is running`);
  console.log("numCPUs : " + numCPUs)
  for (let i = 0; i < numCPUs; i++) {
    console.log("Fork " + i)
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker process ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });

} else {

  config();

  const app = express();
  const port = process.env.PORT;

  app.use('/api', router);
  app.get("/", async (req, res) => res.redirect(process.env.ENV === "dev" ? "dev" : "/api/get"))

  if (process.env.ENV === "develop") {
    app.set("views", "views")
    app.set("view engine", "ejs")
    app.use(express.static('public'));
    app.use('/dev', routerDev);
  }

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

}
