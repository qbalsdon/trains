var express = require('express');
var app = express();
var port = process.env.PORT || 3000;


var fs = require('fs'); // to get data from html file

const trainDataParser = require('./trainDataParser');
const nomnomTrainBuilder = require('./nomnomTrainBuilder');
const NR_TOKEN = process.env.NR_TOKEN;
const ORIGIN = "LEW";
const DESTINATION = "LBG";

function trainDataRequest() {
    const requestBody = fs.readFileSync('requests/getDepartureBoardWithDetails', 'utf8');

    // Replace the placeholders in the request with the actual values
    const requestWithToken = requestBody.replace(/__TOKEN__/g, NR_TOKEN);
    const requestWithOrigin = requestWithToken.replace(/__ORIGIN__/g, ORIGIN);
    const requestWithDestination = requestWithOrigin.replace(/__DESTINATION__/g, DESTINATION);

    const options = {
        hostname: 'lite.realtime.nationalrail.co.uk',
        port: 443,
        path: '/OpenLDBWS/ldb9.asmx',
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml',
          'Accept': 'text/xml'
        }
      };

    //   console.log(requestWithDestination);
    return new Promise((resolve, reject) => {
        const req = https.request(options, res => {
            let responseData = '';
            res.on('data', chunk => {
                responseData += chunk;
            });
            res.on('end', () => {
                // Resolve the Promise with the response data
                resolve(responseData);
            });
        });
        req.on('error', error => {
            // Reject the Promise with the error
            reject(error);
        });
        req.write(requestWithDestination);
        req.end();
    });
}

function filter(data) {
    return data;
}

function produceHtmlTable(data) {
    const row = "<tr><td>PLATFORM</td><td>DEPARTURE TIME</td><td>ORIGIN</td><td>DESTINATION</td><td>STOPS</td></tr>"
    var response = "<table>" + row;

    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var stops = "";
        var between = "";
        for (let stopIndex = 0; stopIndex < element.intermediateStops.length; stopIndex++) {
            const stopElement = element.intermediateStops[stopIndex];
            stops +=  between + stopElement.crs;
            between = " --> "
        }
        if (stops.includes(DESTINATION)) {
            response += row
                .replace("PLATFORM", element.platform)
                .replace("DEPARTURE TIME", element.departureTime)
                .replace("ORIGIN", element.origin)
                .replace("DESTINATION", element.destination)
                .replace("STOPS", stops)
        }
    }

    return response + "</table>";
}

function sendSuccess(res, responseData) {
    fs.readFile("templates/index.html", 'utf8', function (err, pageTemplate) {
        if (err) {
            res.writeHead(501, { 'Content-Type': 'text/html' });
            res.write("HEAD.HTML NOT FOUND");
        } else {
            console.log(responseData);
            //const filteredArray = responseData.filter(element => element.intermediateStops.includes(DESTINATION));
            //const diagramData = nomnomTrainBuilder.convertPayload(ORIGIN,responseData);
            // console.log(filteredArray);
            const pageData = pageTemplate
                .replace("__TABLE_DATA__", produceHtmlTable(filter(responseData)));
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(pageData);            
        }
        res.end();
    });
}

function sendError(res) {
    fs.readFile("templates/index.html", 'utf8', function (err, pageTemplate) {
        if (err)
            res.write("HEAD.HTML NOT FOUND");
        else {
            // console.log(pageTemplate);
            const pageData = pageTemplate.replace("__DATA__", "FOOLS!");
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(pageData);
        }
        res.end();
    });
}

app.get('/', function(req, res) {
    trainDataRequest().then(responseData => {
        trainDataParser.getBoardWithServiceDetails(responseData)
        .then((result) => {
            sendSuccess(res, result);
        })
        .catch((error) => {
            console.error(" !! " + error);
            sendError(res);
        });
    }).catch(error => {
        // Handle errors here
        console.error(error);
        sendError(res);
    });
});

app.listen(port);
console.log(`HTTP started on port ${port}.`);

if (process.env.NODE_ENV !== 'production') {
    var https = require('https');
    var selfSigned = require('openssl-self-signed-certificate');
 
    var options = {
        key: selfSigned.key,
        cert: selfSigned.cert
    };
 
    https.createServer(options, app).listen(port + 1);
    console.log(`HTTPS started on port ${port + 1} (dev only).`);
}