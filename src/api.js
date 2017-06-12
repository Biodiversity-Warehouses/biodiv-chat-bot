const fetch = require("node-fetch")


class Api {


  constructor(){
    this.BACKEND_URL = "https://biodiversity.hs-bremen.de/muscheln/"
  }

  login(username, password){
    return fetch(this.BACKEND_URL + "users/login", {
      method: 'POST',
      body: '{"username":"bdw","passwordHash":"d4225149709e3690fe0a2838e679d7085b92956aca8b38f502a006f95851bef1"}',
      headers: {
        "Host": "biodiversity.hs-bremen.de",
        "Connection": "keep-alive",
        "Content-Length": 100,
        "Pragma": "no-cache",
        "Cache-Control": "no-cache",
        "Origin": "https://biodiversity.hs-bremen.de",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
        "Content-Type": "application/json;charset=UTF-8",
        "Accept": "application/json, text/plain, */*",
        "username": "@username",
        "currentlocale": "en_US",
        "passwordHash": "@passwordHash",
        "Referer": "https://biodiversity.hs-bremen.de/muscheln/",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.8,de;q=0.6",
      }

    }).then((res)=>res.json())
  }
  reportFinding(accessToken){
    return fetch(this.BACKEND_URL + "reportsighting/save", {
      method: 'POST',
      body: '{"sightingid":-1,"species":[{"speciesid":5,"count":1,"comment":"test","classified":false}],"sourcetypeid":7,"locationlat":53.055419,"locationlng":8.783491,"locationinac":"0","locationcomment":"test","detailsevqualiid":1,"detailsevmethodid":6,"detailsdatefrom":"2017-06-12T22:00:00.000Z","detailsdatefromaccurancy":3,"detailsdateto":"2017-06-12T22:00:00.000Z","detailsdatetoaccurancy":3,"detailscomment":"","rights":[{"id":1,"name":"app.sighting.details.report.right.publish.name","description":"app.sighting.details.report.right.publish.desc","position":1,"default":false,"value":true},{"id":2,"name":"app.sighting.details.report.right.coords.name","description":"app.sighting.details.report.right.coords.desc","position":2,"default":false},{"id":3,"name":"app.sighting.details.report.right.export.name","description":"app.sighting.details.report.right.export.desc","position":3,"default":false}],"reference":"test","addprops":{"waterbodytype":"","depthFrom":"","depthTo":"","width":"","height":"","length":""},"isdraft":false}',
      headers: {
          "Accept":"application/json, text/plain, */*",
         "accesstoken":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImJkdyIsInVzZXJpZCI6MiwidGltZXN0YW1wIjoiMjAxNy0wNi0xMlQxMDoyNjoyNS44MzFaIiwiaWF0IjoxNDk3MjYzMTg1LCJleHAiOjE0OTcyNzAzODV9.XVxPZ0SEmzbeNUdnFmgSo1RDD1VIxRP-ww62F4aHnwo",
         "addprops":"@addprops",
         "Content-Type":"application/json;charset=UTF-8",
         "currentlocale":"en_US",
         "detailscomment":"@detailscomment",
         "detailsdatefrom":"@detailsdatefrom",
         "detailsdatefromaccurancy":"@detailsdatefromaccurancy",
         "detailsdateto":"@detailsdateto",
         "detailsdatetoaccurancy":"@detailsdatetoaccurancy",
         "detailsevmethodid":"@detailsevmethodid",
         "detailsevqualiid":"@detailsevqualiid",
         "isdraft":"@isdraft",
         "locationcomment":"@locationcomment",
         "locationinac":"@locationinac",
         "locationlat":"@locationlat",
         "locationlng":"@locationlng",
         "Origin":"https//biodiversity.hs-bremen.de",
         "reference":"@reference",
         "Referer":"https//biodiversity.hs-bremen.de/muscheln/",
         "rights":"@rights",
         "sightingid":"@sightingid",
         "species":"@species",
         "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
      }

    })


  }
  getSpeciesList(accessToken){

    return fetch(this.BACKEND_URL + "reportsighting/species", {
      method: 'GET',
      headers: {
        "Accept":"application/json, text/plain, */*",
        "accesstoken":accessToken,
        "Content-Type":"application/json;charset=UTF-8",
        "currentlocale":"en_US",
        "Origin":"https//biodiversity.hs-bremen.de",
        "reference":"@reference",
        "Referer":"https//biodiversity.hs-bremen.de/muscheln/",
        "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
      }

    }).then((res)=>res.json())


  }
}

module.exports = Api;