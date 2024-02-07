import { PrismaClient } from '@prisma/client'
import { simpleRandom } from './randomServer.js'
import logger from '../utils/logger.js';
import { config } from 'dotenv';

config()

const prisma = new PrismaClient()
const x = process.env.START_NUMBER_QUANTITY/2

export const numberFromDb = async (min = null, max = null) => {
    try {
        let numberCollection = await prisma.number.findMany()
        numberCollection = Object.entries(numberCollection)
        
        if (numberCollection.length > x) {
            let randomNumber;
            let id;
            do {
                let selectionNumber = await simpleRandom(0, numberCollection.length-1)

                id = numberCollection[selectionNumber][1].id
                randomNumber = numberCollection[selectionNumber][1].number
            } while(randomNumber < min && randomNumber > max)

            await prisma.number.delete({
                where: {
                    id: id,
                },
            })

            return randomNumber;

        } else {
            logger.log("info", "[SERVER] Not enough numbers in the database. Adding " + String(x))

            for (let i = 0; i <= x; i++) { 
                let randomNumber = await simpleRandom()
                await prisma.number.create({
                    data: {
                        origin: 'SERVER',
                        number: randomNumber,
                    },
                })
                logger.log("info", "[SERVER] : Add a random number on data (" + String(i) + " / " + String(x) + ")")
            }

            return await numberFromDb()
        }
    } catch (error) {
        logger.error('Error in numberFromDb:', error);
    }
}