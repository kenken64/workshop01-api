## Step by step
```
mkdir workshop1-api
cd workshop1-api
npm init 
````

Change only the entry point to server.js

```
npm i express express-handlebars request uuid --save
```

## Worksheet 1

1. a. Answer is on the day1_a_http.pdf page 13 and 16

   b. Get return the body or payload but HEAD only return the metadata which is the HEADERS. 

2. When a resource hyperlink is click and when a URL is accessed. Sometimes there is ajax polling that happens when the landing page is accessed without user manually trigger an event on the website e.g. charting app

3. a. <b>By duplication</b>
   The API app itself must be dockerize. I will replicate the warehouse and inventory service with many similar api process  depending on the resource sizing and requirement based ont he estimated volume. Likely put into service cluster service (Kubernetes) 

   b. <b>By functional decomposition</b> Assume there isn't any authentication for both of this services. I will split the warehouse service as a standalone api service and inventory service as another service. Whenever a stock is updated on the warehouse both service communicate using some sort of messaging service as the event driven architecture.

   c. <b>By data partitioning</b> I will go with sharding the invesntory table there is where the product price and quantity of the warehouse is kept. I forsee heavy query will be hitting thie api endpoint the most.

   Its going to be range based sharding

   <img src="DB_image_3_cropped.png">
 
4. a. 

* Via the apiKey querystring parameter.
* Via the X-Api-Key HTTP header.
* Via the Authorization HTTP header. Bearer optional, do not base 64 encode.

b. Right after getting the response if the result is more than 30 records the program will truncate it.

```
https://newsapi.org/v2/top-headlines?apiKey=ecc8081a11e24c1490722c9da1564fe5&sources=reuters&q=Technology
```

```
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('ecc8081a11e24c1490722c9da1564fe5');
// To query /v2/top-headlines
// All options passed to topHeadlines are optional, but you need to include at least one of them
newsapi.v2.topHeadlines({
  sources: 'reuters',
  q: '',
  category: 'technology',
  language: 'en',
  country: 'us'
}).then(response => {
  console.log(response);
  /*
    {
      status: "ok",
      articles: [...]
    }
  */
});

```


c. If you don't append your API key correctly, or your API key is invalid, you will receive a 401 - Unauthorized HTTP error.

d. By default we cache the results of each request you make for 5 minutes or 100 further requests, whichever happens first. If you make the same request again, for example if you have multiple users or multiple clients, we'll serve the cached result and it won't count against your monthly requests. This is useful if you're hooking the API into your app directly (although this isn't recommended because it exposes your API key). 

https://newsapi.org/docs/caching