import dotenv from "dotenv";
import Snoowrap from "snoowrap";
import Snoostorm from "snoostorm";

import destinationHandler from "./handlers/destinationHandler";
import fileHandler from "./handlers/fileHandler";
import dvCalc from "./handlers/dvCalcHandler";

dotenv.config();
const r = new Snoowrap({
  userAgent: "reddit-bot-moar-boosters",
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  username: process.env.REDDIT_USER,
  password: process.env.REDDIT_PASSWORD
});

const client = new Snoostorm(r);
const comments = client.CommentStream({
  subreddit: "testingground4bots",
  results: 3
});

// Attempt to limit to catch only when user commenting is attempting to meme
const triggerPhrases = ["more boosters!", "moar boosters"];

let numBoosters = 0;

const reply = (comment, data) => {
  const dV = dvCalc.calcDvRecursive(data.numBoosters, 0);
  comment.reply(
    `More Boosters!\n\nThe /r/KerbalSpaceProgram community rocket now has ${
      data.numBoosters
    } boosters attached and weighs ${dvCalc.vesselMass(data.numBoosters)} tonnes.\n\nCurrent dV:${dV.toFixed(0)}

    ${destinationHandler.bestDestinations(dV)}`
  );
};

comments.on("comment", comment => {
  console.log(comment.author.name);
  if (comment.author.name === "Moar_boosters_bot") {
    // Don't reply to yourself. You're not /u/rooster_86.
    // Also as it is currently set up, this would cause recursive replies. nope.
    console.log("I made this comment! Skipping...");
    return false;
  }
  if (comment.parent_id) {
    // This method fails for some reason. the parent_id stored in the comment
    // does not actually match the comment_id of its parent.
    const parentId = comment.parent_id.split("_")[1];
    const parentComment = r.getComment(parentId);
    if (parentComment.author.name === "Moar_boosters_bot") {
      // Ignore any comments that are replies to the bot.
      // That path leads to banning.
      console.log("The parent of this comment was me! Skipping...");
      return false;
    }
  }
  triggerPhrases.forEach(phrase => {
    const index = comment.body.toLowerCase().indexOf(phrase);
    if (index !== -1) {
      // TRIGGERED
      console.log("triggered");
      fileHandler
        .getRunningTotals()
        .then(data => {
          // Ratelimit the bot to one reply every 5 minutes.
          if (data.lastReplied && Date.now() - data.lastReplied > 1000 * 60 * 5) {
            const updatedData = {
              lastReplied: Date.now(),
              numBoosters: data.numBoosters + 1
            };
            fileHandler.updateRunningTotals(updatedData);
            reply(comment, updatedData);
          } else {
            // TODO: send a direct mail to candidate?
            console.log("Bot detected a candidate but is ratelimited.");
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  });
});
