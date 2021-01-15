/*==================================================
  Modules
  ==================================================*/

const sdk = require("../../sdk");
const BigNumber = require("bignumber.js");
const _ = require("underscore");

/*==================================================
  TVL
  ==================================================*/

const vesperPoolAddresses = [
  "0x103cc17C2B1586e5Cd9BaD308690bCd0BBe54D5e", //vETH
  "0x4B2e76EbBc9f2923d83F5FBDe695D8733db1a17B", //vWBTC
  "0x0C49066C0808Ee8c673553B7cbd99BCC9ABf113d", //vUSDC
];

async function tvl(timestamp, block) {
  const balances = {};
  const collateralToken = {};
  const yVaultToUnderlyingToken = {};

  // Get collateral token
  const collateralTokenResponse = await sdk.api.abi.multiCall({
    calls: _.map(vesperPoolAddresses, (poolAddress) => ({
      target: poolAddress,
    })),
    abi: abi["token"],
  });

  _.each(collateralTokenResponse.output, (response) => {
    if (response.success) {
      const collateralTokenAddress = response.output;
      const poolAddress = response.input.target;
      collateralToken[poolAddress] = collateralTokenAddress;
      if (!balances.hasOwnProperty(collateralTokenAddress)) {
        balances[collateralTokenAddress] = 0;
      }
    }
  });

  //Get TVL
  const totalValueResponse = await sdk.api.abi.multiCall({
    block,
    calls: _.map(vesperPoolAddresses, (poolAddress) => ({
      target: poolAddress,
    })),
    abi: abi["totalValue"],
  });

  _.each(totalValueResponse.output, (response) => {
    if (response.success) {
      const totalValue = response.output;
      const poolAddress = token.input.target;
      console.log("tvl", totalValue);
      balances[collateralToken[poolAddress]] = totalValue;
    }
  });
  return balances;
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: "Vesper",
  website: "https://vesper.finance",
  token: "VSP",
  category: "assets",
  start: 1608667205, // December 22 2020 at 8:00 PM UTC
  tvl,
  contributesTo: ["Aave", "Maker"],
};
