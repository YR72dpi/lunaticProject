import express from 'express';
import { config } from 'dotenv';
import router from './routes/router.js'
import routerDev from './routes/router.dev.js'
import { dbConnectionTest } from './utils/prismaUtils.js'
import logger from './utils/logger.js';


config();

const app = express();
const port = process.env.PORT;

app.use('/api', router);
app.get("/", async (req, res) => res.redirect(process.env.ENV === "dev" ? "dev" :"/api/get"))

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
