import { PNG } from 'pngjs';
import { config } from 'dotenv';
import * as fs from 'fs'

import cluster from 'node:cluster';
import * as os from "os";

const generateImage = async () => {

    const start = Date.now();


    const numCPUs = os.cpus().length;

    config()

    const port = process.env.PORT;
    const imageColor = false;
    const width = 32;
    const height = 32;

    const totalPixel = width * height;
    let pixelGenerated = 0

    const png = new PNG({ width, height });

    if (cluster.isMaster) {
        console.log(`Master process ${process.pid} is running`);
        console.log("numCPUs : " + numCPUs)
        for (let i = 0; i < numCPUs; i++) {
            console.log("Fork " + i)
            cluster.fork();
        }
        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker process ${worker.process.pid} died. Restarting...`);
            cluster.fork();
        });

    } else {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (width * y + x) << 2;

                pixelGenerated++
                console.clear()
                console.log(String(pixelGenerated + "px / " + totalPixel + "px"))


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
    }

    const filename = 'image_' + (imageColor ? "color_" : "nocolor_") + width + 'x' + height  + "_"  + Date.now()  + '.png';

    // Save the image to a file
    const outputStream = fs.createWriteStream(filename);
    png.pack().pipe(outputStream);
    outputStream.on('finish', () => {
        console.log('Image saved to file');
        console.log("as : " + filename)
    });

    const millis = Date.now() - start;

    console.log(`seconds elapsed = ${Math.floor(millis / 1000)}`);

}


await generateImage();


