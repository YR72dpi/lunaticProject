import { PrismaClient } from '@prisma/client'
import { simpleRandom } from '../randomSrc/randomServer.js';

const prisma = new PrismaClient()

const x = 100;

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
    } catch (e) {
        console.log(e)
    }
}

for (let i = 1; i <= x; i++) { 
    startUpCollection()
    console.log("[START UP] : Add a random number on data (" + i + " / " + x + ")")
}