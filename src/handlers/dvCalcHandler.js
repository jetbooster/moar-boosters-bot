// Currently only Recursive is used as it approximates the best possible results ignoring the complications of calculating asparagus staging.

import vessel from "../config/vesselStats";

var self = {
  calcDvRecursive: (remainingBoosters, dvSoFar) => {
    const vesselMassPreBurn = remainingBoosters * vessel.booster.wetMass + vessel.payloadMass;
    // burn a number of boosters equal to the square root of the number of boosters, rounded up
    remainingBoosters -= 1;
    const vesselMassPostBurn = remainingBoosters * vessel.booster.wetMass + vessel.payloadMass + vessel.booster.dryMass; //remaining full boosters + payload + just emptied booster
    const dv = 9.8 * vessel.booster.vacIsp * Math.log(vesselMassPreBurn / vesselMassPostBurn); //mass units don't matter,x/x is unitless
    dvSoFar += dv;
    if (remainingBoosters > 0) {
      // Why yes, I *am* a monster. How deep can this stack get before it crashes my RPi?
      return self.calcDvRecursive(remainingBoosters, dvSoFar);
    } else {
      return dvSoFar;
    }
  },
  calcDvPancake: numBoosters => {
    // flying pancake
    // FIRE EVERYTHING
    const fullVesselMass = vessel.payloadMass + numBoosters * vessel.booster.wetMass;
    const emptyVesselMass = vessel.payloadMass + numBoosters * vessel.booster.dryMass;
    return 9.8 * vessel.booster.vacIsp * Math.log(fullVesselMass / emptyVesselMass);
  },

  // TODO: currently doesn't work.
  // intetion was to fire off a certain number of boosters in order to keep accelleration fairly constant
  calcDvProportional: (remainingBoosters, dvSoFar) => {
    const vesselMassPreBurn = remainingBoosters * vessel.booster.wetMass + vessel.payloadMass;
    // burn a number of boosters equal to the square root of the number of boosters, rounded up
    const boostersThisBurn = Math.ceil(Math.sqrt(remainingBoosters));
    const thisBurnThrust = boostersThisBurn * vessel.thrust;
    remainingBoosters -= boostersThisBurn;
    const vesselMassPostBurn =
      remainingBoosters * vessel.booster.wetMass + vessel.payloadMass + vessel.booster.dryMass * boostersThisBurn; //remaining full boosters + payload + just emptied boosters
    const thisBurnMinAccel = thisBurnThrust / vesselMassPreBurn; //kN/tonnes == N/kg
    const dv = 9.8 * vessel.booster.vacIsp * Math.log(vesselMassPreBurn / vesselMassPostBurn); //mass units don't matter,x/x is unitless
    dvSoFar += dv;
    if (remainingBoosters > 0) {
      return self.calcDvProportional(v, remainingBoosters, dvSoFar);
    } else {
      return dvSoFar;
    }
  },

  vesselMass: numBoosters => {
    return numBoosters * vessel.booster.wetMass + vessel.payloadMass;
  }
};

export default self;
