import destinations from "../config/destinations";

var self = {
  getNearestDestinations: dV => {
    const prev = self.getClosestPrevDestination(dV);
    const next = self.getClosestNextDestination(dV);
    return { prev: prev, next: next };
  },

  getClosestPrevDestination: dV => {
    let nearestSoFar = { dV: 0, name: "Landed on Kerbin. Try harder!" };
    let bestDvDifference = 10000;
    destinations.forEach(destination => {
      const dVDiff = dV - destination.dV;
      // Closest destination which is still positive
      if (dVDiff < bestDvDifference && dVDiff > 0) {
        nearestSoFar = destination;
        bestDvDifference = dVDiff;
      }
    });
    return { nearestDest: nearestSoFar, diff: bestDvDifference };
  },

  getClosestNextDestination: dV => {
    let nearestSoFar = { dV: 0, name: "Landed on Kerbin. Try harder!" };
    let bestDvDifference = 10000;
    destinations.forEach(destination => {
      const dVDiff = destination.dV - dV;
      // Closest destination which is still positive
      if (dVDiff < bestDvDifference && dVDiff > 0) {
        nearestSoFar = destination;
        bestDvDifference = dVDiff;
      }
    });
    return { nearestDest: nearestSoFar, diff: bestDvDifference };
  },

  parseDestinationsResults: (prev, next) => {
    let prevString = `The Rocket can make it to: *${prev.nearestDest.name}*`;
    if (prev.diff !== 10000) {
      prevString += ` with ${prev.diff.toFixed(0)}dV to spare!`;
    }
    const nextString = `The next destination is: *${next.nearestDest.name}*. ${next.diff.toFixed(0)}dV to go!`;
    return { prevString: prevString, nextString: nextString };
  },

  bestDestinations: dV => {
    const dests = self.getNearestDestinations(dV);
    const strings = self.parseDestinationsResults(dests.prev, dests.next);
    return strings;
  }
};

export default self;
