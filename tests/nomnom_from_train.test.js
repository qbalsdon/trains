const util = require('./testHelpers')
const path = require('path');

const nomnomTrainBuilder = require('../nomnomTrainBuilder');

function readPayload() {
    const payloadPath = path.join(__dirname, 'data', 'stationData.json');
    return util.readFile(payloadPath);
}

test('when given an element can create a diagram', () => {
    const element = JSON.parse(`{"departureTime":"21:12","origin":"SEV","destination":"CHX","platform":"1","serviceID":"1389701LEWISHM_","intermediateStops":["LBG","WAE","CHX"]}`);
    const expected = `[DESTINATION: CHX|platform: 1|departure: 21:12|[<state>SEV]->[<start>st];[<start>st]->[<state>LEW];[<state>LEW]->[<state>LBG];[<state>LBG]->[<state>WAE];[<state>WAE]->[<state>CHX];[<state>CHX]->[<end>e]]`;    
    expect(nomnomTrainBuilder.convertElement("LEW",element)).toBe(expected);
});

test('can parse a whole payload', () => {
    const payload = JSON.parse(readPayload());
    const expected = ["[DESTINATION: CHX|platform: 1|departure: 21:12|[<state>SEV]->[<start>st];[<start>st]->[<state>LEW];[<state>LEW]->[<state>LBG];[<state>LBG]->[<state>WAE];[<state>WAE]->[<state>CHX];[<state>CHX]->[<end>e]]", "[DESTINATION: SGR|platform: 4|departure: 21:16|[<state>CST]->[<start>st];[<start>st]->[<state>LEW];[<state>LEW]->[<state>BKH];[<state>BKH]->[<state>KDB];[<state>KDB]->[<state>ELW];[<state>ELW]->[<state>FCN];[<state>FCN]->[<state>WLI];[<state>WLI]->[<state>BXH];[<state>BXH]->[<state>BNH];[<state>BNH]->[<state>SGR];[<state>SGR]->[<end>e]]", "[DESTINATION: CHX|platform: 1|departure: 21:22|[<state>DFD]->[<start>st];[<start>st]->[<state>LEW];[<state>LEW]->[<state>LBG];[<state>LBG]->[<state>WAE];[<state>WAE]->[<state>CHX];[<state>CHX]->[<end>e]]", "[DESTINATION: CST|platform: 3|departure: 21:26|[<state>GRV]->[<start>st];[<start>st]->[<state>LEW];[<state>LEW]->[<state>SAJ];[<state>SAJ]->[<state>NWX];[<state>NWX]->[<state>LBG];[<state>LBG]->[<state>CST];[<state>CST]->[<end>e]]", "[DESTINATION: CHX|platform: 1|departure: 21:26|[<state>HYS]->[<start>st];[<start>st]->[<state>LEW];[<state>LEW]->[<state>LBG];[<state>LBG]->[<state>WAE];[<state>WAE]->[<state>CHX];[<state>CHX]->[<end>e]]", "[DESTINATION: CST|platform: 3|departure: 21:38|[<state>CST]->[<start>st];[<start>st]->[<state>LEW];[<state>LEW]->[<state>SAJ];[<state>SAJ]->[<state>NWX];[<state>NWX]->[<state>LBG];[<state>LBG]->[<state>CST];[<state>CST]->[<end>e]]", "[DESTINATION: CHX|platform: 1|departure: 21:42|[<state>SEV]->[<start>st];[<start>st]->[<state>LEW];[<state>LEW]->[<state>LBG];[<state>LBG]->[<state>WAE];[<state>WAE]->[<state>CHX];[<state>CHX]->[<end>e]]", "[DESTINATION: SGR|platform: 4|departure: 21:46|[<state>CST]->[<start>st];[<start>st]->[<state>LEW];[<state>LEW]->[<state>BKH];[<state>BKH]->[<state>KDB];[<state>KDB]->[<state>ELW];[<state>ELW]->[<state>FCN];[<state>FCN]->[<state>WLI];[<state>WLI]->[<state>BXH];[<state>BXH]->[<state>BNH];[<state>BNH]->[<state>SGR];[<state>SGR]->[<end>e]]", "[DESTINATION: CHX|platform: 1|departure: 21:52|[<state>DFD]->[<start>st];[<start>st]->[<state>LEW];[<state>LEW]->[<state>LBG];[<state>LBG]->[<state>WAE];[<state>WAE]->[<state>CHX];[<state>CHX]->[<end>e]]", "[DESTINATION: CHX|platform: 1|departure: 21:56|[<state>HYS]->[<start>st];[<start>st]->[<state>LEW];[<state>LEW]->[<state>LBG];[<state>LBG]->[<state>WAE];[<state>WAE]->[<state>CHX];[<state>CHX]->[<end>e]]"];
    expect(JSON.stringify(nomnomTrainBuilder.convertPayload("LEW",payload))).toBe(JSON.stringify(expected));
});