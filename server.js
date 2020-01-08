const express = require('express');
const hbs = require('express-handlebars');
const request = require('request');

const keys = require('./keys.json');

const APP_PORT = process.env.PORT | 3000;

const app = express();
app.engine('hbs', hbs());
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
const GOOGLE_MAP_API_URL = "https://maps.googleapis.com/maps/api/staticmap";
const NEWS_API_URL = "https://newsapi.org/v2/top-headlines";

const makeInvocation = function(url){
    return ((params)=>
        new Promise((resolve, reject)=>{
            request.get(url, ('qs' in params ? params: {qs: params} ),
            (err, h, body)=>{
                if(err)
                    return reject(err);

                if(h.headers['content-type'].startsWith('application/json'))
                    return resolve(JSON.parse(body));
                resolve(body);
            })
        }));
}

const getWeather = makeInvocation(WEATHER_API_URL);
const getMap = makeInvocation(GOOGLE_MAP_API_URL);
const getNews = makeInvocation(NEWS_API_URL);


app.get('/map', (req,resp)=>{
    console.log("getting the map ...");
    const coord = {
        lat: parseFloat(req.query.lat),
        lon: parseFloat(req.query.lon)
    }

    const params = {
        center: `${coord.lat},${coord.lon}`,
        zoom: 15,
        size: '300x300',
        format: 'png',
        marker: `size:mid|color:orange|label:A|${coord.lat},${coord.lon}`,
        key: keys.map
    }

    getMap({qs: params, encoding: null})
        .then((result)=>{
            console.log(result);
            resp.status(200);
            resp.type('image/png');
            resp.send(result);
        }).catch(error=>{
            console.log(error);
            resp.status(400).send(error);
        })
});

app.get('/information', (req, resp)=>{
    const cityName = req.query.cityName;

    const params = {
        q: cityName,
        units: 'metric',
        appid: keys.weather
    }

    getWeather(params)
    .then(result => {
           // NOTE: countryCode holds the 2 character country code
        const countryCode = result.sys.country.toLowerCase();

        //TODO 2/3: Add query parameters for News API
        //Use the exact query parameter names as keys
        //The 2 character country code is found in countryCode variable
        //API key is in keys.news
        const params = {
            country: countryCode,
            category: 'technology',
            apiKey: keys.news
        }
        return (Promise.all([ result, getNews(params) ]));
    })
    .then(result => {
        resp.status(200);
        resp.format({
            'text/html': () => {
                resp.type('text/html');
                resp.render('information', {
                    layout: false,
                    city: cityName.toUpperCase(),
                    weather: result[0].weather,
                    temperature: result[0].main,
                    coord: result[0].coord,
                    news: result[1].articles
                })
            },
            'application/json': () => {
                const respond = {
                    temperature: result[0].main,
                    coord: result[0].coord,
                    city: cityName,
                    weather: result[0].weather.map(v => {
                        return {
                            main: v.main,
                            description: v.description,
                            icon: `http://openweathermap.org/img/w/${v.icon}.png`
                        }
                    })
                }
                resp.json(respond)
            },
            'default': () => {
                resp.status(406);
                resp.type('text/plain');
                resp.send(`Cannot produce the requested representation: ${req.headers['accept']}`);
            }
        })
    })
    .catch(error => {
        resp.status(400); 
        resp.type('text/plain'); 
        resp.send(error); 
        return;
    })
})

app.get(/.*/, express.static(__dirname + '/public'));

app.listen(APP_PORT, ()=>{
    console.log(`App server started on ${APP_PORT}`);
})