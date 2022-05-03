import { expect } from "chai";
import { itEach } from "mocha-it-each";
import { getPrices, runParams } from "../bot.js";
let pairs = [
  ["ETH-USD"],
  ["BTC-USD"],
  ["LTC-USD"],
  ["LTC-USD", "ETH-USD", "BTC-USD"],
  ["BTC-USD"],
  ["LTC-USD"],
  ["LTC-USD", "ETH-USD", "BTC-USD"],
  ["BTC-USD"],
  ["LTC-USD"],
  ["ETH-USD"],
  ["BTC-USD", "ETH-USD"],
  ["LTC-USD", "ETH-USD"],
  ["ETH-USD"],
  ["BTC-USD", "ETH-USD"],
  ["LTC-USD"],
  ["ETH-USD"],
  ["LTC-USD", "ETH-USD", "BTC-USD"],
  ["LTC-USD"],
  ["ETH-USD"],
  ["BTC-USD"],
  ["LTC-USD", "ETH-USD", "BTC-USD"],
  ["ETH-USD"],
  ["BTC-USD"],
  ["LTC-USD"],
  ["LTC-USD", "ETH-USD", "BTC-USD"],
  ["ETH-USD"],
  ["BTC-USD"],
  ["LTC-USD"],
  ["LTC-USD", "ETH-USD", "BTC-USD"],
  ["BTC-USD"],
  ["LTC-USD"],
];
describe("Uphold API", function (done) {
  itEach(`Testing pairs`, pairs, async (pair) => {
    const str = await getPrices(pair, 0.01);
    expect(str).to.be.a("number");
  });
});
