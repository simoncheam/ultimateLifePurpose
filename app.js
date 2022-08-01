/* work flow

1. Create most meaningful things list!-  30min timed exercise limit to 15 items
2. Create life focus 10 items  - 15 min 
3. Master values list - choose 10 items 
4. Identify toxic values + refinement
5. Define value descriptions with specificity
6. Congruence rating
7. Define optimal value situation with specificity
8. Value prioritization

- use /controllers/pizza.ts to abstract out the functions
  - get all, getOne, destroy

*/

let compared_rankings = {};

function generateResults() {
  //looping over each item in values array
  for (const outerValue of values) {
    // 2nd loop created for inner value
    for (const innerValue of values) {
      //if outer values does not match inner val
      if (outerValue != innerValue) {
        let randomChoice = Math.floor(Math.random() * 1000) % 2 === 0;

        // not sure about this section

        // * if the key and values exist in the object then the code fires
        if (
          compared_rankings[outerValue] &&
          compared_rankings[outerValue][innerValue] &&
          compared_rankings[outerValue][innerValue].values.length
          //  compared_rankings[outerValue][innerValue].confidence
        ) {
          const oldValues = compared_rankings[outerValue][innerValue].values;
          const newValues = [...oldValues, randomChoice];

          // ? This structure is interesting - need to review understanding
          compared_rankings[outerValue] = {
            ...compared_rankings[outerValue],
            [innerValue]: {
              ...compared_rankings[outerValue][innerValue],
              values: newValues,
            },
          };
        } else {
          compared_rankings[outerValue] = {
            [innerValue]: {
              values: [randomChoice],
            },
            ...compared_rankings[outerValue],
          };
        }

        if (randomChoice === true) {
          randomChoice = "Choice 1";
        }
        if (randomChoice === false) {
          randomChoice = "Choice 2";
        }

        console.log(`Choices:\n\t1. More fulfilled with LOTS of "${outerValue.toUpperCase()}" with LITTLE "${innerValue.toUpperCase()}"?\n\t2. More fulfilled with LITTLE of "${outerValue.toUpperCase()}" and LOTS of "${innerValue.toUpperCase()}"?\n\n\tSelected Answer: ${randomChoice}
					`);

        // creating the key?
        compared_rankings[outerValue] = {
          [innerValue]: {
            value: [
              ...compared_rankings[outerValue][innerValue].value,
              randomChoice,
            ],
            confidence: 0,
          },
          // [innerValue]: Math.floor(Math.random() * 1000) % 2 === 0,
          ...compared_rankings[outerValue],
        };
      }
      if (
        compared_rankings[outerValue] &&
        compared_rankings[innerValue] &&
        compared_rankings[outerValue][innerValue] !== undefined &&
        compared_rankings[innerValue][outerValue] !== undefined
      ) {
        // evaluates if compared value ranking is equal
        if (
          compared_rankings[outerValue][innerValue].values.slice(-1)[0] ===
          compared_rankings[innerValue][outerValue].values.slice(-1)[0]
        ) {
          compared_rankings[outerValue][innerValue].confidence += 0.5;
          compared_rankings[innerValue][outerValue].confidence += 0.5;
        } else {
          compared_rankings[innerValue][outerValue].confidence += 2;
          compared_rankings[outerValue][innerValue].confidence += 2;
        }
      }
    }
  }
}

// generateResults();
// generateResults();
// generateResults();
// generateResults();

console.log(compared_rankings);

function calculateScores() {
  //! set up the container
  let scores = {};
  // loop over object.keys
  Object.keys(compared_rankings).forEach((key) => {
    //inner sub item look
    Object.keys(compared_rankings[key]).forEach((subRank) => {
      const subItem = compared_rankings[key][subRank];
      const trueValues = subItem["values"].filter(
        (value) => value === true
      ).length;
      const score = trueValues * subItem.confidence;
      if (scores[subRank] !== undefined) {
        scores[subRank] += score;
      } else {
        score[subRank] = score;
      }
    });
    // let score = compared_ranking[key].filter((value) => value === true).length;
    // scores[key] = score;
  });
  console.log(scores);
}

// calculateScores();

// ! We want to turn this into SQL syntax. Array includes string keys
let values = [
  "Adventure",
  "Art",
  "Beauty",
  "Being Liked/Approval*",
  "Certainty*",
  "Clarity",
  "Comfort*",
  "Communication",
  "Community",
  "Connection",
  "Consciousness/Awareness",
  "Contribution/Impact",
  "Control*",
  "Courage/Bravery",
  "Creativity/Ingenuity",
  "Elegance/Simplicity",
  "Equality/Fairness",
  "Excellence",
  "Excitement*",
  "Faith/Religion/Worship/God*",
  "Family",
  "Fame/Celebrity*",
  "Focus",
  "Freedom",
  "Friendship",
  "Fun",
  "Gratitude",
  "Health/Vigor/Energy",
  "Honesty",
  "Honor",
  "Humor/Laughter ",
  "Independence",
  "Joy",
  "Justice",
  "Knowledge/Learning/Understanding",
  "Kindness/Generosity",
  "Leadership",
  "Love/Romance/Intimacy",
  "Loyalty/Commitment ",
  "Luxury*",
  "Modesty/Humility",
  "Nature",
  "Order",
  "Openmindedness/Perspective",
  "Optimism/Positivity/Hope",
  "Passion/Enthusiasm",
  "Personal Growth/Self-Improvement",
  "Peace of Mind/Tranquility/Calm",
  "Physical Appearance*",
  "Playfulness/Spontaneity",
  "Power*",
  "Productivity/Efficiency",
  "Progress",
  "Professionalism",
  "Purpose",
  "Recognition/Reputation/Prestige*",
  "Respect",
  "Safety/Security*",
  "Service/Helping Others",
  "Self-Control/Temperance",
  "Self-Expression",
  "Significance",
  "Spirituality",
  "Status*",
  "Strength",
  "Society/Culture/State/Country",
  "Sex*",
  "Success/Achievement*",
  "Tradition*",
  "Travel",
  "Teamwork/Collaboration",
  "Trust",
  "Truth/Reality",
  "Uniqueness",
  "Variety/Newness/Novelty*",
  "Wealth/Money*",
  "Wisdom",
];

// * 2/2 - PART 1
// valueName, isLowerSelf

//loop over array of values

let statement = "INSERT INTO BaseValMetric (valueName, isLowerSelf) VALUES";
// let individualValues = [];

// for (const valueName of values) {
//   if (valueName[valueName.length - 1] === "*") {
//     individualValues.push(`( "${valueName}", 1)\n`);
//   } else {
//     individualValues.push(`( "${valueName}", 0)\n`);
//   }
//   // individualValues.push( // ! alternative syntax
//   //   `("${valueName}", ${valueName[valueName.length - 1] === "*" ? 1 : 0})\n`
//   // );
// }

//individualValues = individualValues.join(", ");

// LifeValues DB keys
//console.log(individualValues);

// ! CREATE INTERFACE // * 2/2 - PART 2 -----

// create string that we can copy/paste as an interface
let istatement = "export interface Pizza {\n\tid: number; \n\tvalueName: ";

// store individual interfaces in this temp array:
let individualValues = [];

// ! Creating joined interface with | for TS autocomplete

for (const valueName of values) {
  // ? need to parse out "*"
  if (valueName.includes("*")) {
    individualValues.push(`"${valueName.replace("*", "")}"`);
  } else {
    individualValues.push(`"${valueName}"`);
  }
}
individualValues = individualValues.join(" | ");

istatement += individualValues + "; \n\tisLowerSelf: boolean;\n}";

console.log(istatement);

//console.log(individualValues.join(" | "));

// getting each individual value as `valueName`
// let valueName = values[index];

// Creating a new 'stringified' interface for each value and pushing it to the temp array
//each interface is keys with it's string (minus asterisks)
// Each interface has am id (index) property, it's own name, and the boolean value of the good/bad traits

//   individualValues.push(
//     // '${valueName.replace(" *", "").replace("*", "")}':
//     `
//       {
//           id: ${Number(index) + 1},
//           valueName: '${valueName.replace(" *", "").replace("*", "")}',
//           isLowerSelf: ${valueName.includes("*")},
//       }`
//   );
// }

// Merge all of the individual interfaces in that array into one giant string separated by semicoloms
// and reassigning individualValues to itself (now that string instead of an array)
// individualValues = individualValues.join(",");

// Take the starting statement string, append the giant interfaces string, and then a newline and closing bracket
//istatement += individualValues + "\n}";
// console.log(istatement);

// //
