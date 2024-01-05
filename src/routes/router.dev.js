import express from 'express';
import { PrismaClient } from '@prisma/client'

const routerDev = express.Router();
const prisma = new PrismaClient()

// TODO : faire une page swager genre, avec un ptit MVPcss
// https://www.youtube.com/watch?v=of16K6SM_EA&ab_channel=DevTheory
routerDev.get('/', (req, res) => {
  res.render('home');
});

routerDev.get('/dbContent', (req, res) => {
  res.render('dbContent');
});

routerDev.get('/data', async (req, res) => {
    let dateTimeOldest = await prisma.number.findFirst({
        orderBy: {
          datetime: 'asc',
        },
      })
    dateTimeOldest = new Date(dateTimeOldest.datetime);
    dateTimeOldest = 
    String(dateTimeOldest.getUTCDate()).padStart(2, '0') + "/" + 
    String(dateTimeOldest.getUTCMonth() + 1).padStart(2, '0') + "/" + 
    String(dateTimeOldest.getUTCFullYear()) + " " +
    String(dateTimeOldest.getUTCHours()).padStart(2, '0') + ":" +
    String(dateTimeOldest.getUTCMinutes()).padStart(2, '0') + "." +
    String(dateTimeOldest.getUTCSeconds()).padStart(2, '0');

    let dateTimeLatest = await prisma.number.findFirst({
        orderBy: {
          datetime: 'desc',
        },
      })
    dateTimeLatest = new Date(dateTimeLatest.datetime);
    dateTimeLatest = 
    String(dateTimeLatest.getUTCDate()).padStart(2, '0') + "/" + 
    String(dateTimeLatest.getUTCMonth() + 1).padStart(2, '0') + "/" + 
    String(dateTimeLatest.getUTCFullYear()) + " " +
    String(dateTimeLatest.getUTCHours()).padStart(2, '0') + ":" +
    String(dateTimeLatest.getUTCMinutes()).padStart(2, '0') + "." +
    String(dateTimeLatest.getUTCSeconds()).padStart(2, '0');
    
    const nbrOriginServer = await prisma.number.count({
        where: {
            origin: "SERVER"
        }
    })

    const nbrOriginOrganic = await prisma.number.count({
        where: {
            origin: "ORGANIC"
        }
    })

    const allNbr = await prisma.number.findMany({orderBy: {datetime: 'desc'}})

    res.json({
        nbrValues: nbrOriginServer + nbrOriginOrganic,
        dateTimeOldest: dateTimeOldest,
        dateTimeLatest: dateTimeLatest,
        nbrOriginServer: nbrOriginServer,
        nbrOriginOrganic: nbrOriginOrganic,
        allNbr : allNbr
    });
});


export default routerDev;