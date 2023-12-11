import express from 'express';
import logger from '../util/logger.js';
import { simpleRandom } from '../util/serverAlgo.js';
import { addNumber } from '../util/prismaUtils.js';
import { PrismaClient } from '@prisma/client'

const router = express.Router();
const prisma = new PrismaClient()

// TODO : faire une page swager genre, avec un ptit MVPcss
// https://www.youtube.com/watch?v=of16K6SM_EA&ab_channel=DevTheory
router.get('/', (req, res) => {
  res.send('Bienvenue sur ma route principale!');
});

/**
 *          All GET ROUTE
 */

router.get('/get', async (req, res) => {
    logger.info('[SERVER] GET /get');
    try {
        const randomNumber = await simpleRandom();
        res.json(randomNumber);
    } catch (error) {
        logger.error('Erreur dans /get:', error);
        res.status(500).send('Erreur interne du serveur');
    }
})


/**
 *          All POST ROUTE
 */

// Passer en POST et mettre un csrf
//https://www.npmjs.com/package/csrf
router.get('/give', async (req, res) => {
    logger.info('[ORGANIC] GET /give?number=x');
    let randomNumber = parseInt(req.query.number)
    if(Number.isInteger(randomNumber)) {
       try {
        addNumber(randomNumber)
        res.json({
            msg: 'ok'
        })
       } catch (error) {
            res.status(500).json({
                msg: error
            });
       }
    } else {
        res.status(500).json({
            msg: "Integer only"
        });
    }
})


export default router;