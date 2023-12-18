// https://www.randomnumberapi.com/
export const randomNumberApi = async () => {
    return fetch('http://www.randomnumberapi.com/api/v1.0/random?min=0&max=999&count=1').then(async (response) => {
        let number = await response.json()
        return number[0];
    })
}

// https://csrng.net/documentation/csrng-lite/
export const csrng = async () => {
    return fetch('https://csrng.net/csrng/csrng.php?min=0&max=999').then(async (data) => {
        let response = await data.json()
        if (response[0].status === 'success') {
            return response[0].random
        }
    })
}