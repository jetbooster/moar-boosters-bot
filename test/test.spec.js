import dvCalc from "../src/dvCalcHandler";
import destinationHandler from "../src/destinationHandler";

// Cower before my incredible test coverage
const testArray = Array.from({ length: 100 }, (v, i) => i);
testArray.forEach(elem => {
  console.log("boosters:" + elem);
  const dV = dvCalc.calcDvRecursive(vesselStats, elem, 0);
  console.log(dV);
  console.log(destinationHandler.bestDestinations(dV));
});
