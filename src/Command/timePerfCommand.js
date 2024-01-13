import { Console } from 'console';
import { config } from 'dotenv';

config()

const port = process.env.PORT;

const nbrTest = 100

const timePerfCommand = async (query = "") => {

    let timeSum = 0
    let timeMax = 0
    let timeMin = 0
    let timeDeltaCollection = []

    for(let i= 1; i <= nbrTest; i++) {
        const start = Date.now()
        await fetch("http://localhost:"+port+"/api/get" + query).then(async (response) => {
            let res = await response.json()
            if(typeof res.number !== "number" || !Number.isInteger(res.number)) { die() }
        })
        const end = Date.now()

        const deltaTime = end - start
        timeSum += deltaTime
        timeDeltaCollection.push(deltaTime)
        
        if(i === 1) {
            timeMax = deltaTime
            timeMin = deltaTime
        } else {
            timeMax = deltaTime > timeMax ? deltaTime : timeMax
            timeMin = deltaTime < timeMin ? deltaTime : timeMin
        }
    }

    console.log("---- ----")
    console.log("QUERY : /api/get" + (query == "" ? "No query" : query))
    console.log("Number of query : " + nbrTest)
    console.log("MOY : " + (timeSum/timeDeltaCollection.length) + " ms")
    console.log("MIN : " + timeMin + " ms")
    console.log("MAX : " + timeMax + " ms")
}

await timePerfCommand()
await timePerfCommand("?min=1&max=10")
await timePerfCommand("?function=numberFromDb")
await timePerfCommand("?function=simpleRandom")
await timePerfCommand("?function=crossRandom")
await timePerfCommand("?function=randomLowEntropy")
await timePerfCommand("?function=randomMediumEntropy")
await timePerfCommand("?function=randomHighEntropy")
await timePerfCommand("?function=generateRandomNumberFromTimestamp")
await timePerfCommand("?function=vonNeumannRandom")
