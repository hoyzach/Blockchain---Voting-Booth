/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-ethers');
let secret = require("./secret");
//require('@openzeppelin/hardhat-upgrades');

module.exports = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      url: secret.url,
      accounts: [secret.key]
    }
  }
};
