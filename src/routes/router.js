import express from 'express';
import logger from '../utils/logger.js';
import { addOrganicNumber } from '../utils/prismaUtils.js';
import { PrismaClient } from '@prisma/client'
import {
    simpleRandom,
    crossRandom,
    randomLowEntropy,
    randomMediumEntropy,
    randomHighEntropy,
    generateRandomNumberFromTimestamp,
    vonNeumannRandom,
    timestampAntropyRandom
} from '../randomSrc/randomServer.js';
import {
    randomNumberApi,
    csrng
} from '../randomSrc/randomAPI.js';
import {
    numberFromDb
} from '../randomSrc/randomDB.js'

const functionCollection = {
    simpleRandom,
    crossRandom,
    randomNumberApi,
    csrng,
    randomLowEntropy,
    randomMediumEntropy,
    randomHighEntropy,
    generateRandomNumberFromTimestamp,
    numberFromDb,
    vonNeumannRandom,
    timestampAntropyRandom
}


const router = express.Router();
const prisma = new PrismaClient()

/** 
 * Randomly choose function in "functionCollection" :
 * http://localhost:8080/api/get
 * Choose a spécific function :
 * http://localhost:8080/api/get?function=crossRandom
 */
router.get('/get', async (req, res) => {
    try {
        let functionSelected;
        if(req.query.function !== undefined && req.query.function !== "") {
            functionSelected = req.query.function
        } else {
            const functionCollectionName = Object.keys(functionCollection)
            functionSelected = functionCollectionName[await simpleRandom(0, functionCollectionName.length)]
        }

        const randomNumber = await functionCollection[functionSelected]()

        logger.info('[SERVER] GET /get : ' + functionSelected);
        res.json({
            number: randomNumber,
            origin: functionSelected
        });
    } catch (error) {
        logger.error('Erreur dans /get:', error);
        res.status(500).send('Erreur interne du serveur');
    }
})

// TODO : Passer en POST et mettre un csrf
//https://www.npmjs.com/package/csrf
router.get('/give', async (req, res) => {
    try {
        logger.info('[ORGANIC] GET /give?number=x');

        const randomNumber = parseInt(req.query.number);

        if (Number.isInteger(randomNumber)) {
            await addOrganicNumber(randomNumber);
            res.json({
                msg: 'ok'
            });
        } else {
            res.status(400).json({
                msg: "Integer only"
            });
        }
    } catch (error) {
        logger.error('Error in /give:', error);
        res.status(500).json({
            msg: 'Internal Server Error'
        });
    }
})

router.get('/giveMany', async (req, res) => {
    try {
        logger.info('[ORGANIC] GET /giveMany?number=x-y-z');

        const randomNumber = req.query.number.split("-");

        let onlyIntegerGiven = true;
        randomNumber.forEach(async (number) => {
            number = parseInt(number)
            if (Number.isInteger(number)) {
                await addNumber(number);
            } else {
                onlyIntegerGiven = false;
            }
        });

        if(onlyIntegerGiven) {
            res.json({
                msg: 'ok'
            });
        }else {
            res.status(400).json({
                msg: "Integer only"
            });
        }

    } catch (error) {
        logger.error('Error in /give:', error);
        res.status(500).json({
            msg: 'Internal Server Error'
        });
    }
})


export default router;