import { simpleRandom } from "../randomSrc/randomServer.js"
import logger from '../utils/logger.js';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const x = process.env.START_NUMBER_QUANTITY;

/**
 * Put x random for start the service
 */

const startUpCollection = async () => {
    const randomNumber = await simpleRandom();
    try {
        await prisma.number.create({
            data: {
              origin: 'SERVER',
              number: randomNumber,
            },
          })
    } catch (error) {
        logger.error("Error in startUpCollection : ", error)
    }
}

for (let i = 1; i <= x; i++) { 
    startUpCollection()
    console.log("[START UP] : Add a random number on data (" + i + " / " + x + ")")
}