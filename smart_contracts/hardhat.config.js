require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/1JjWJZsSBD2eD7_s1LBJG5xtSKhBsnaw',
      accounts: [ '92f67767b1a7bb3f8c5c9881a7c4993ca6c9aae2850b43a87fa9ad26d3079e71' ]
    }
  }
};
