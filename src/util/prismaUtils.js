import { PrismaClient } from '@prisma/client'
import logger from '../util/logger.js';

const prisma = new PrismaClient()

export const addNumber = async (number) => {
    try {
        await prisma.number.create({
            data: {
                origin: 'ORGANIC',
                number: number,
            },
        })
        return true
    } catch (error) {
        logger.error('Error in addNumber:', error);
        throw new Error('Not Saved');
    }
}