const express = require('express')
const https = require('https');
const app = express()
const port = process.env.PORT || 80

const apiEndpoint = process.env.API_ENDPOINT,
    apiKey = process.env.API_KEY
const lat = 13.2778737997884,
    long = 100.93188285044253,
    unit = "M"

app.get('/', (request, response) => {
    const url = `https://${apiEndpoint}/current?lat=${lat}&lon=${long}&key=${apiKey}&units=${unit}`

    let resData = {}

    https.get(url, res => {
        let data = []
        res.on('data', chunk => {
            data.push(chunk)
        });

        res.on('end', () => {
            const result = JSON.parse(Buffer.concat(data).toString())
            const weatherData = result.data[0]
            if (weatherData) {
                resData = {
                    temp: weatherData.temp,
                    app_temp: weatherData.app_temp,
                    aqi: weatherData.aqi,
                    weather_icon: weatherData.weather.icon
                }
            }
            response.send(resData)
        });
    }).on('error', err => {
        console.log('Error: ', err.message)
        response.status(500).send(err.message)
    });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})