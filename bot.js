import fetch from "node-fetch";
import cron from "node-cron";
import PG from "pg";

const Client = PG.Client;

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "bot",
  password: "mysecretpassword",
  port: 5432,
});

client.connect();

client.query(`CREATE TABLE IF NOT EXISTS entries (
	id SERIAL PRIMARY KEY,
  pair VARCHAR (10) NOT NULL,
	new VARCHAR ( 20 ) NOT NULL,
	old VARCHAR ( 20 ) NOT NULL,
	diffUSD VARCHAR ( 10 ) NOT NULL,
  diffPerc VARCHAR ( 10 ) NOT NULL,
  whenAlerted TIMESTAMP NOT NULL
);`);

let coll = {};

export const getPrices = async (pairs, oscillationPercentage) => {
  const date = new Date().toISOString();
  console.log(date);
  let msg;
  for (var i = 0; i < pairs.length; i++) {
    const url = `https://api.uphold.com/v0/ticker/${pairs[i]}`;
    const response = await fetch(url);
    const data = await response.json();
    const midPrice = (data.ask * 1 + data.bid * 1) / 2;
    if (
      coll[pairs[i]] !== null &&
      coll[pairs[i]] !== 0 &&
      (midPrice / coll[pairs[i]] > oscillationPercentage / 100 + 1 ||
        midPrice / coll[pairs[i]] < 1 - oscillationPercentage / 100)
    ) {
      // await addToDB(pairs[i], midPrice, coll[pairs[i]], date);
    } else {
      console.log(`${pairs[i]}:`, "Difference less than 0.01%");
    }
    coll[pairs[i]] = midPrice;
    msg = midPrice;
  }
  return msg;
};
export const runParams = (pairs, intervalSec, oscillationPercentage) => {
  cron.schedule(`*/${intervalSec} * * * * *`, async () => {
    await getPrices(pairs, oscillationPercentage);
  });
};

export const addToDB = async (pair, newPrice, oldPrice, date) => {
  console.log(
    `New ${pair} mid-price:`,
    newPrice.toFixed(3),
    "Old mid-price:",
    oldPrice.toFixed(3),
    "Difference more than 0.01%,",
    "In USD:",
    (newPrice - oldPrice).toFixed(3),
    "In %:",
    ((newPrice / oldPrice - 1) * 100).toFixed(3) + "%"
  );
  const query = `
INSERT INTO entries ( pair, new, old, diffUSD, diffPerc, whenAlerted)
VALUES ('${pair}', ${newPrice.toFixed(3)}, ${oldPrice.toFixed(3)}, ${(newPrice - oldPrice).toFixed(3)}, ${(
    (newPrice / oldPrice - 1) *
    100
  ).toFixed(3)}, '${date}')
RETURNING id
`;
  client.query(query, (error, result) => {
    if (error) {
      console.log(`error: ${error}`);
      throw error;
    }
    console.log(`DB entry added with ID: `, result.rows[0].id);
  });
};

runParams(["BTC-USD", "ETH-USD", "LTC-USD"], 5, 0.01);
