// add values array // !
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

let statement = "INSERT INTO LifeValues (ValueName, isLowerSelf) Values ";
let individualValues = [];

for (const valueName of values) {
  console.log(valueName);
  if (valueName.includes("*")) {
    individualValues.push(`("${valueName.replace("*", "")}", 1)`);
  } else {
    individualValues.push(`('${valueName}',0)`);
  }
}

individualValues = individualValues.join(", ");

statement += individualValues + ";";
console.log(statement);

// *** THIS WORKS!
