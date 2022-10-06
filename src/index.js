const express = require('express')
const https = require('https');
const NODE_ENV = require('./config');
const app = express()
const port = NODE_ENV.PORT || 3000

const weatherApiEndpoint = NODE_ENV.W_API_ENDPOINT,
    weatherApiKey = NODE_ENV.W_API_KEY,
    apiKey = NODE_ENV.API_KEY
const unit = "M"

app.get('/current', (request, response) => {
    if (request.query.key != apiKey) {
        response.status(401).send('Unauthorized')
        return
    }
    if(!(request.query.lat && request.query.lon)){
        response.status(400).send('lat or lon is missing,')
        return
    }

    const url = `https://${weatherApiEndpoint}/current?lat=${request.query.lat}&lon=${request.query.lon}&key=${weatherApiKey ?? ''}&units=${request.query.unit ?? unit}`

    let resData = {}

    https.get(url, res => {
        let data = []
        res.on('data', chunk => {
            data.push(chunk)
        });

        res.on('end', () => {
            const result = JSON.parse(Buffer.concat(data).toString())
            const weatherData = result?.data[0]
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