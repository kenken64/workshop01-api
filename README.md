## Step by step for Workshop 01
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

   b. GET return the body and HEADERS but HEAD only return the the HEADERS without the payload. 

2. When a resource hyperlink is click and when a URL is accessed. Sometimes there is ajax polling that happens when the landing page is accessed without user manually trigger an event on the website e.g. charting app

3. a. <b>By duplication</b>
   The API app itself must be dockerize. I will replicate the warehouse and inventory service with many similar api process  depending on the resource sizing and requirement based on the estimated volumetric sizing. Likely put into service cluster e.g. (Kubernetes) 

   b. <b>By functional decomposition</b> I will split the warehouse service as a standalone api service and inventory service as another service. Whenever a stock is updated on the warehouse both service communicate using some sort of messaging service as the event driven architecture. Most of the time when a point of sales app query the warehouse information likely it is going to be cache. A company can only have limited of warehouse within the same region.

   c. <b>By data partitioning</b> I will go with sharding the inventory table there is where the product name , price and quantity are kept. I forsee heavy query will be hitting the inventory api endpoint whenever a customer walk into the retail store to buy an item. Assume the company have multiple warehouse location.

   Its going to be range based sharding

   <img src="DB_image_3_cropped.png">
 
4. a. 

* Via the apiKey querystring parameter.
* Via the X-Api-Key HTTP header.
* Via the Authorization HTTP header. Bearer optional, do not base 64 encode.

4. b. Right after getting the response if the result is more than 30 records the program will truncate the result to meet the 30 records requirement.

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

d. By default newsapi cache the results of each request you make for 5 minutes or 100 further requests, whichever happens first. If you make the same request again, for example if you have multiple users or multiple clients, we'll serve the cached result and it won't count against your monthly requests. This is useful if you're hooking the API into your app directly (although this isn't recommended because it exposes your API key). 

https://newsapi.org/docs/caching


if you accidentally check in sensitive information

https://help.github.com/en/github/authenticating-to-github/removing-sensitive-data-from-a-repository