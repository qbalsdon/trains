function convertElement(station, element) {
  const format = "[DESTINATION: __DESTINATION__|platform: __PLATFORM__|departure: __DEPARTURE__|__DIAGRAM__]";
  var diagram = "[<state>__START__]->[<start>st];[<start>st]->[<state>" + station + "];";
  var currentNode = station;
  for (let i = 0; i < element.intermediateStops.length; i++) {
      const nextNode = element.intermediateStops[i];
      diagram += "[<state>" + currentNode + "]->[<state>" + nextNode +"];";
      currentNode = nextNode;
  }
  diagram += "[<state>" + currentNode + "]->[<end>e]"

  return format
          .replace("__DESTINATION__",element["destination"])
          .replace("__PLATFORM__",element["platform"])
          .replace("__DEPARTURE__",element["departureTime"])
          .replace("__DIAGRAM__",diagram)
          .replace("__START__", element["origin"]);
  ;
}

function convertPayload(focusStation, payload) {
  const result = [];
  payload.forEach((element) => {
      result.push(convertElement(focusStation,element));
    });
  return result;
}

module.exports = {
  convertElement,
  convertPayload
};