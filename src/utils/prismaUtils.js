import { PrismaClient } from '@prisma/client'
import logger from '../utils/logger.js';

const prisma = new PrismaClient()

export const addOrganicNumber = async (number) => {
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

export const dbConnectionTest = async () => {
    logger.info("DB Connection Test : START");
    try {
        await prisma.$connect();
        logger.info('Connected to the database');
    } catch (error) {
        logger.error('Error connecting to the database :', error);
        return false;
    } finally {
        await prisma.$disconnect();
        logger.info("DB Connection Test : END");
    }

    return true
}