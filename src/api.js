const fetch = require("node-fetch")
const SHA256 = require("crypto-js/sha256");

class Api {


  constructor(backendUrl, currentLocal) {
    this.BACKEND_URL = backendUrl
    this.currentlocale = currentLocal
  }

  login(username, password) {
    let body = '{"username":"' + username + '","passwordHash":"' + SHA256(password) + '"}'
    console.log("Start login", body)
    return fetch(this.BACKEND_URL + "users/login", {
      method: 'POST',
      body: body,
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
        "currentlocale": this.currentlocale,
        "passwordHash": "@passwordHash",
        "Referer": "https://biodiversity.hs-bremen.de/muscheln/",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.8,de;q=0.6",
      }

    })
        .then((res) => res.json())
  }

  reportFinding(accessToken, speciesid, count, locationlat, locationlng, date) {
    return fetch(this.BACKEND_URL + "reportsighting/save", {
      method: 'POST',
      body: '{"sightingid":-1,"species":[{"speciesid":' + speciesid + ',"count":' + count + ',"comment":"test","classified":false}],"sourcetypeid":7,"locationlat":' + locationlat + ',"locationlng":' + locationlng + ',"locationinac":"0","locationcomment":"test","detailsevqualiid":1,"detailsevmethodid":6,"detailsdatefrom":' + date.toISOString() + ',"detailsdatefromaccurancy":3,"detailsdateto":"2017-06-12T22:00:00.000Z","detailsdatetoaccurancy":3,"detailscomment":"","rights":[{"id":1,"name":"app.sighting.details.report.right.publish.name","description":"app.sighting.details.report.right.publish.desc","position":1,"default":false,"value":true},{"id":2,"name":"app.sighting.details.report.right.coords.name","description":"app.sighting.details.report.right.coords.desc","position":2,"default":false},{"id":3,"name":"app.sighting.details.report.right.export.name","description":"app.sighting.details.report.right.export.desc","position":3,"default":false}],"reference":"test","addprops":{"waterbodytype":"","depthFrom":"","depthTo":"","width":"","height":"","length":""},"isdraft":false}',
      headers: {
        "Accept": "application/json, text/plain, */*",
        "accesstoken": accessToken,
        "addprops": "@addprops",
        "Content-Type": "application/json;charset=UTF-8",
        "currentlocale": this.currentlocale,
        "detailscomment": "@detailscomment",
        "detailsdatefrom": "@detailsdatefrom",
        "detailsdatefromaccurancy": "@detailsdatefromaccurancy",
        "detailsdateto": "@detailsdateto",
        "detailsdatetoaccurancy": "@detailsdatetoaccurancy",
        "detailsevmethodid": "@detailsevmethodid",
        "detailsevqualiid": "@detailsevqualiid",
        "isdraft": "@isdraft",
        "locationcomment": "@locationcomment",
        "locationinac": "@locationinac",
        "locationlat": "@locationlat",
        "locationlng": "@locationlng",
        "Origin": "https//biodiversity.hs-bremen.de",
        "reference": "@reference",
        "Referer": "https//biodiversity.hs-bremen.de/muscheln/",
        "rights": "@rights",
        "sightingid": "@sightingid",
        "species": "@species",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
      }

    })


  }

  getSpeciesList(accessToken) {

    let body = JSON.stringify({
      criteria: "commonname", order: "ASC",
      filter: {
        speciesIds: [], bioOrderIds: [], bioFamilyIds: [], reporterIds: []
      },
      limit: 20,
      offset: 0,
      order: {
        criteria: "commonname", order: "ASC"
      }
    })
    return fetch(this.BACKEND_URL + "filter/results", {
      method: 'POST',
      body: body,
        headers: {
          "Accept": "application/json, text/plain, */*",
          "accesstoken": accessToken,
          "Content-Type": "application/json;charset=UTF-8",
          "currentlocale": this.currentlocale,
          "Origin": "https//biodiversity.hs-bremen.de",
          "reference": "@reference",
          "Referer": "https//biodiversity.hs-bremen.de/muscheln/",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
        }

      }
    )
        .then((res) => res.json())
        .then((res)=> res.foundSpecies)
        .then(
            (species) => {
              return species.map(
                      (item) => {
                        item.imageUrl = this.BACKEND_URL + "images/static/"+ item.imagePath;
                        item.links = {self: this.BACKEND_URL + "#!/species/" + item.id + "/details"};
                        return item
                      }
                  )
            })


  }
}

module.exports = Api;