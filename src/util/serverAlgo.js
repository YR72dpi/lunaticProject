// Simple random
export const simpleRandom = async (x = 0, y = 999) => x + Math.floor(Math.random() * (y - x))

// cross 3 random number
// [0, 65535]
export const crossRandom = async () => {

    let a = await simpleRandom(0, 15).then(number => number.toString(2));
    let q = await simpleRandom(0, 15).then(number => number.toString(2));
    let n = await simpleRandom(0, 15).then(number => number.toString(2));

    while(a.length < 8) {a = "0" + a}
    while(q.length < 8) {q = "0" + q}
    while(n.length < 8) {n = "0" + n}

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