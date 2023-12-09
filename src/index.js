import express from 'express';
import { config } from 'dotenv';
import { simpleRandom } from './util/random.js';

config();

const app = express();
const port = process.env.PORT;


app.get('/api/get', async (req, res) => {
  res.send(String(await simpleRandom()));
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});