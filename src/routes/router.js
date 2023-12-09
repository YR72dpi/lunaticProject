import express from 'express';
import logger from '../util/logger.js';
import { simpleRandom } from '../util/random.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Bienvenue sur ma route principale!');
});

router.get('/randomNumber', async (req, res) => {
    logger.info('Get randomNumber route');
    try {
        const randomNumber = await simpleRandom();
        res.json(randomNumber);
    } catch (error) {
        logger.error('Erreur dans simpleRandom:', error);
        res.status(500).send('Erreur interne du serveur');
    }
})

export default router;
