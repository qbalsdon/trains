const parser = require('xml2js').parseString;
const stripNS = require('xml2js').processors.stripPrefix;

function cleanUp(json) {
  const result = {...json}; // create a shallow copy of the original object
  delete result.Envelope["$"];
  return result;
}

function parseXmlPayload(payload) {
    return new Promise((resolve, reject) => {
      parser(payload, { tagNameProcessors: [stripNS] }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          var response = cleanUp(result);
          resolve(JSON.stringify(response));
        }
      });
    });
  }
  
async function parseXml(xmlPayload) {
    try {
        const result = await parseXmlPayload(xmlPayload);
        return result;
    } catch (err) {
        console.error(err);
        return err;
    }
}

async function getServices(xmlPayload) {
    try {
        const result = JSON.parse(await parseXmlPayload(xmlPayload));
        const services = result["Envelope"]["Body"][0]['GetDepartureBoardResponse'][0]['GetStationBoardResult'][0]['trainServices'][0]['service'];
        const serviceInfo = services.map(service => {
            return {
              departureTime: service["std"][0],
              origin: service["origin"][0]["location"][0]["locationName"][0],
              destination: service["destination"][0]["location"][0]["locationName"][0],
              platform: service["platform"][0],
              serviceID: service['serviceID'][0]
            }
          });
        return serviceInfo;
    } catch (err) {
        console.error(err);
        return err;
    }
}


async function getBoardWithServiceDetails(xmlPayload) {
    try {
      console.log(xmlPayload);
        const result = JSON.parse(await parseXmlPayload(xmlPayload));
        const serviceDetails = result['Envelope']['Body'][0]['GetDepBoardWithDetailsResponse'][0]['GetStationBoardResult'][0];        
        const serviceInfoList = serviceDetails['trainServices'][0]['service'];   
        const serviceInfo = serviceInfoList.map(service => {
              const element = {
                departureTime: service.std[0],
                origin: service.origin[0].location[0].locationName[0],
                destination: service.destination[0].location[0].locationName[0],
                platform: service.platform ? service.platform[0] : 'Unknown',
                serviceID: service.serviceID[0],
                intermediateStops: service.subsequentCallingPoints[0].callingPointList[0].callingPoint.map(stop => ({
                  locationName: stop.locationName[0],
                  crs: stop.crs[0],
                  st: stop.st[0],
                  et: stop.et[0]
                }))
              };
              // console.log(JSON.stringify(element));
              // console.log("!!-------------------------------!!");
            return element;
          });
        // console.log(JSON.stringify(serviceInfo));
        return serviceInfo;
    } catch (err) {
        console.error(err);
        return err;
    }
}

module.exports = {
    parseXmlPayload,
    parseXml,
    getServices,
    getBoardWithServiceDetails
};