const express = require('express'); // importing framework
const axios = require('axios');
const app = express();
const PORT = 3000; //on port number 3000.. sever will run on localhost:3000

const TIMEOUT = 500;  //milliseconds

app.get('/numbers', async (req, res) => { //get method
    const urls = req.query.url;// print request and find urls from query
    if (!urls || urls.length === 0) {
        return res.json({ "numbers": [] });// if no urls then empty array
    }
    //For each provided URL, it calls the fetchNumbers function which makes an HTTP request to that URL and returns the numbers (or an empty array if there's an error or timeout).
    const promises = urls.map(url => fetchNumbers(url));
    const allNumbers = await Promise.all(promises); //waits for all the HTTP requests to complete and returns an array of numbers arrays.
    //This code first merges all the numbers into a single array.
    
    let numbers = [];
    allNumbers.forEach(arr => {
        numbers = numbers.concat(arr);
    });

    //It then removes duplicates using a Set and sorts the numbers in ascending order.
    numbers = [...new Set(numbers)].sort((a, b) => a - b);

    res.json({ "numbers": numbers });//sending response
});
//This is an asynchronous function that tries to fetch numbers from a given URL.
//If successful, it returns the numbers; otherwise, in case of an error or if the request times out, it returns an empty array.
async function fetchNumbers(url) {
    try {
        const response = await axios.get(url, { timeout: TIMEOUT });
        return response.data.numbers || [];
    } catch (error) {
        return [];
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
