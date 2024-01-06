import * as crypto from 'node:crypto'
import seedRandom from 'seed-random';
import { config } from 'dotenv';

config()

// Simple random
export const simpleRandom = async (x = 0, y = 999) => x + Math.floor(Math.random() * (y - x))

// cross 3 random number
// [0, 65535]
export const crossRandom = async () => {

    let a = await simpleRandom(0, 15).then(number => number.toString(2));
    let q = await simpleRandom(0, 15).then(number => number.toString(2));
    let n = await simpleRandom(0, 15).then(number => number.toString(2));

    while (a.length < 8) { a = "0" + a }
    while (q.length < 8) { q = "0" + q }
    while (n.length < 8) { n = "0" + n }

    let splited_a = a.split('')
    let splited_q = q.split('')
    let splited_n = n.split('')

    let output = "";

    let newBinToAdd = ""
    for (let i = 0; i < splited_a.length; i++) {
        newBinToAdd += splited_a[i] ^ splited_q[i]
    }
    output += newBinToAdd

    newBinToAdd = ""
    for (let i = 0; i < splited_q.length; i++) {
        newBinToAdd += splited_n[i] ^ output[i]
    }
    output += newBinToAdd

    return parseInt(output, 2)
}

// chatGPT
export const randomLowEntropy = async () => {
    let seed = await simpleRandom(10000, 99999);
    const a = await simpleRandom(1000000000, 9999999999);
    const c = await simpleRandom(10000, 99999);

    let q = await simpleRandom(1, 9)
    let p = await simpleRandom(10, 99)

    const m = q ** p;
    seed = (a * seed + c) % m;
    return seed;
}

// chatGPT
export const randomMediumEntropy = async () => {
    let w = await simpleRandom(10000000, 99999999);
    let x = await simpleRandom(100000000, 999999999);
    let y = await simpleRandom(100000000, 999999999);
    let z = await simpleRandom(100000000, 999999999);

    const t = x ^ (x << 11);
    x = y;
    y = z;
    z = w;
    w = (w ^ (w >>> 19)) ^ (t ^ (t >>> 8));

    return Math.abs(w);
}

// chatGPT
export const randomHighEntropy = async (x = 0, y = 999) => {
  const buffer = crypto.randomBytes(4);
  const calcul = (buffer.readUInt32LE(0) / 0xFFFFFFFF) * 10 ** 14;
  const rangeCalcul = y - x;
  const randomValue = x + Math.floor(calcul * rangeCalcul);
  return randomValue;
}

// chatGPT
export const generateRandomNumberFromTimestamp = async () => {
  // Utilisez le timestamp comme graine pour la génération aléatoire
  const randomGenerator = seedRandom(Date.now());
  // Générez un nombre aléatoire entre 0 et 1
  const randomNumber = randomGenerator() * 10 ** 16;
  return randomNumber;
}

export const vonNeumannRandom = async (seed = null, length = 3) =>{
    let result = '';
    let currentSeed = seed === null ? await simpleRandom() : seed.toString();
  
    for (let i = 0; i < length; i++) {
      // Square the current seed
      currentSeed = (parseInt(currentSeed) ** 2).toString();
  
      // Extract the middle digits
      const middleIndex = Math.floor(currentSeed.length / 2);
      const middleDigits = currentSeed.slice(middleIndex - 1, middleIndex + 1);
  
      // Append the middle digits to the result
      result += middleDigits;
    }
  
    // Convert the result to a number and scale it between 0 and 1
    // const scaledResult = parseInt(result) / Math.pow(10, result.length);
    const scaledResult = parseInt(result);
  
    return scaledResult;
  }

export const timestampAntropyRandom = async () => {

    const before = Date.now()
    await fetch(process.env.FETCH_TIMESTAMP)
    const random = await simpleRandom().then(number => number)
    const after = Date.now()
    
    const deltaTimestamp = after - before
    const result = random * deltaTimestamp
    return result
}

console.log(await timestampAntropyRandom())