import { PrismaClient } from '@prisma/client'
import logger from '../util/logger.js';

const prisma = new PrismaClient()

// Simple random
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
        logger.error('Erreur dans /give:', error);
        throw new Error('Not Saved');
    }
}