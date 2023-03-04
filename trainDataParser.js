const parser = require('xml2js').parseString;

function parseXmlPayload(payload) {
    return new Promise((resolve, reject) => {
      parser(payload, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.stringify(result));
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
        const services = result['soap:Envelope']['soap:Body'][0]['GetDepartureBoardResponse'][0]['GetStationBoardResult'][0]['lt2:trainServices'][0]['lt2:service'];
        const serviceInfo = services.map(service => {
            return {
              departureTime: service["lt2:std"][0],
              origin: service["lt2:origin"][0]["lt2:location"][0]["lt2:locationName"][0],
              destination: service["lt2:destination"][0]["lt2:location"][0]["lt2:locationName"][0],
              platform: service["lt2:platform"][0],
              serviceID: service['lt2:serviceID'][0]
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
        const result = JSON.parse(await parseXmlPayload(xmlPayload));
        const serviceDetails = result['soap:Envelope']['soap:Body'][0]['GetDepBoardWithDetailsResponse'][0]['GetStationBoardResult'][0];
        const serviceInfoList = serviceDetails['lt5:trainServices'][0]['lt5:service'];
        
        const serviceInfo = serviceInfoList.map(service => {
            return {
                departureTime: service['lt4:std'][0],
                origin: service['lt5:origin'][0]['lt4:location'][0]['lt4:crs'][0],
                destination: service['lt5:destination'][0]['lt4:location'][0]['lt4:crs'][0],
                platform: service['lt4:platform'][0],
                serviceID: service['lt4:serviceID'][0],
                intermediateStops: service['lt5:subsequentCallingPoints'][0]['lt4:callingPointList'][0]['lt4:callingPoint'].map(stop => stop['lt4:crs'][0])
            }
          });
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