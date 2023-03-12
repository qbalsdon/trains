const util = require('./testHelpers')

const trainDataParser = require('../trainDataParser')

const fs = require('fs');
const path = require('path');

// region TEST HELPERS

function readPayload() {
    const payloadPath = path.join(__dirname, 'data', 'payload.soap');
    return util.readFile(payloadPath);
}

function readPayloadWithDetails() {
    const payloadPath = path.join(__dirname, 'data', 'payload_details.soap');
    return util.readFile(payloadPath);
}

function readPayload2WithDetails() {
    const payloadPath = path.join(__dirname, 'data', 'payload_details_2.soap');
    return util.readFile(payloadPath);
}

function readParsedPayload() {
    const payloadPath = path.join(__dirname, 'data', 'parsed.json');
    return util.readFile(payloadPath);
}
// end region

test('when given a payload can parse', () => {
    trainDataParser.parseXml(readPayload())
        .then((result) => {
            expect(result).toBe(readParsedPayload());
        })
        .catch((error) => {
            expect().fail('should be parse-able');
        });
  });

  test('when given a payload can get the list of services', () => {
    trainDataParser.getServices(readPayload())
        .then((result) => {
            expect(result.length).toBe(10);
        })
        .catch((error) => {
            expect().fail('should be parse-able');
        });
  });

  test('when given a detailed payload can get the list of services', () => {
    trainDataParser.getBoardWithServiceDetails(readPayloadWithDetails())
        .then((result) => {
            expect(result.length).toBe(10);
        })
        .catch((error) => {
            expect().fail('should be parse-able');
        });
  });

  test('when given a detailed payload can get the list of services', () => {
    trainDataParser.getBoardWithServiceDetails(readPayload2WithDetails())
        .then((result) => {
            // console.log("WTAF " + result.length);
            expect(result.length).toBe(9);
        })
        .catch((error) => {
            expect(error).toBe("Test failed");
        });
  });