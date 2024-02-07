import { PNG } from 'pngjs';
import { config } from 'dotenv';
import * as fs from 'fs'

config()

const port = process.env.PORT;
const imageColor = false;
const width = 50;
const height = 50;


const totalPixel = width * height;
let pixelGenerated = 0

const png = new PNG({ width, height });

for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        const idx = (width * y + x) << 2;

        pixelGenerated++
        console.clear()
        console.log(String(pixelGenerated + " / " + totalPixel))


        let pixelRed, pixelGreen, pixelBlue;
        if (imageColor) {
            pixelRed = await fetch("http://localhost:" + port + "/api/get?min=0&max=255").then(async (response) => {
                let res = await response.json()
                if (typeof res.number !== "number" || !Number.isInteger(res.number)) { die() }
                return res.number
            })
            pixelGreen = await fetch("http://localhost:" + port + "/api/get?min=0&max=255").then(async (response) => {
                let res = await response.json()
                if (typeof res.number !== "number" || !Number.isInteger(res.number)) { die() }
                return res.number
            })
            pixelBlue = await fetch("http://localhost:" + port + "/api/get?min=0&max=255").then(async (response) => {
                let res = await response.json()
                if (typeof res.number !== "number" || !Number.isInteger(res.number)) { die() }
                return res.number
            })
        } else {
            const pixel = await fetch("http://localhost:" + port + "/api/get?min=0&max=255").then(async (response) => {
                let res = await response.json()
                if (typeof res.number !== "number" || !Number.isInteger(res.number)) { die() }
                return res.number
            })

            pixelRed = pixel
            pixelGreen = pixel
            pixelBlue = pixel
        }

        png.data[idx] = pixelRed;     // Red channel
        png.data[idx + 1] = pixelGreen;   // Green channel
        png.data[idx + 2] = pixelBlue;   // Blue channel
        png.data[idx + 3] = 255; // Alpha channel (fully opaque)
    }
}

// Save the image to a file
const outputStream = fs.createWriteStream('image.png');
png.pack().pipe(outputStream);
outputStream.on('finish', () => {
    console.log('Image saved to file');
});