import * as crypto from 'node:crypto'
import seedRandom from 'seed-random';
import { config } from 'dotenv';

config()

// Simple random
export const simpleRandom = async (x = 0, y = 999) => x + Math.floor(Math.random() * (y - x))

// cross 3 random number
// [0, 65535]
export const crossRandom = async (min = 0, max = 15) => {

  let a = await simpleRandom(min, max).then(number => number.toString(2));
  let q = await simpleRandom(min, max).then(number => number.toString(2));
  let n = await simpleRandom(min, max).then(number => number.toString(2));

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
export const randomLowEntropy = async (min = null, max = null) => {
  min = parseInt(min) <= 0 ? 1 : min;
  let seed = await simpleRandom(min, max);
  do {
    
    let a = await simpleRandom(min, max);
    let c = await simpleRandom(min, max);
    
      let q = await simpleRandom(min, max)
      let p = await simpleRandom(min, max)

      let m = q ** p;

      seed = (a * seed + c) % m;
    } while (seed < min && seed > max)

    return seed;
}

// chatGPT
export const randomMediumEntropy = async (min = null, max = null) => {
    let w = await simpleRandom(min, max);
    
    do {
      let x = await simpleRandom(min, max);
      let y = await simpleRandom(min, max);
      let z = await simpleRandom(min, max);

      const t = x ^ (x << 11);
      x = y;
      y = z;
      z = w;
      w = (w ^ (w >>> 19)) ^ (t ^ (t >>> 8));
    } while (w < min && w > max)

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
export const generateRandomNumberFromTimestamp = async (min = null, max = null) => {
  // Utilisez le timestamp comme graine pour la génération aléatoire
  const randomGenerator = seedRandom(Date.now());
  // Générez un nombre aléatoire entre 0 et 1

  let randomNumber;
  if(min !== null && max !== null) {
    randomNumber = randomGenerator() * (max - min) + min 
  } else {
    randomNumber = randomGenerator() * 10 ** 16;
  }
  return parseInt(randomNumber);
}

export const vonNeumannRandom = async (min = 0, max = 99999, seed = null, length = 3) =>{
  let currentSeed;
  if (seed === null) {
      do {
          currentSeed = await simpleRandom(min, max);
      } while (currentSeed < min || currentSeed > max);
  } else {
      currentSeed = seed.toString();
  }

  let result = '';

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
  console.log(await vonNeumannRandom(0, 250))