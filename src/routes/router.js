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
} from '../randomSrc/randomServer.js';
import {
    randomNumberApi,
    csrng,
    timestampAntropyRandom
} from '../randomSrc/randomAPI.js';
import {
    numberFromDb
} from '../randomSrc/randomDB.js'

const functionCollection = {
    // From database
    numberFromDb,

    // From server random
    simpleRandom,
    crossRandom,
    randomLowEntropy,
    randomMediumEntropy,
    randomHighEntropy,
    generateRandomNumberFromTimestamp,
    vonNeumannRandom,

    // From external source (fetch)
    // randomNumberApi,
    // csrng,
    // timestampAntropyRandom
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
            let functionCollectionName = Object.keys(functionCollection)
            functionSelected = functionCollectionName[await simpleRandom(0, functionCollectionName.length)]
        }

        let randomNumber;
        while (randomNumber === undefined) {
            randomNumber = await functionCollection[functionSelected]()
        }

        if(
            req.query.min !== undefined
            && req.query.max !== undefined
            && req.query.min < req.query.max
        ) {
            let min = parseInt(req.query.min)
            let max = parseInt(req.query.max)
            // console.log(min + " " + max)
            while(randomNumber < min || randomNumber > max || randomNumber === undefined) {
                if(req.query.function !== undefined && req.query.function !== "") {
                    functionSelected = req.query.function
                } else {
                    let functionCollectionName = Object.keys(functionCollection)
                    functionSelected = functionCollectionName[await simpleRandom(0, functionCollectionName.length)]
                }
                // console.log(functionSelected)
                randomNumber = await functionCollection[functionSelected]()
                // console.log(randomNumber)
                // console.log("----------------------------------------------")
            }
        }

        logger.info('[SERVER] GET /get : ' + functionSelected);
        res.json({
            number: parseInt(randomNumber),
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
                msg: 'ok',
                given: req.query.number
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
        logger.info('[ORGANIC] GET /giveMany?numbers=x-y-z');

        const randomNumber = req.query.numbers.split("-");
            console.log(randomNumber)
        let onlyIntegerGiven = true;
        randomNumber.forEach(async (number) => {
            number = parseInt(number)
            if (Number.isInteger(number)) {
                await addOrganicNumber(number);
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