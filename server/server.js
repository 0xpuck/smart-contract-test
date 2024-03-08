const express = require("express");
const fs = require("fs");

let Collection = fs.readFileSync("collection.json");
let collectionFromJson = JSON.parse(Collection);

const hostname = "127.0.0.1";
const port = 5000;

const { Web3 } = require("web3");
const infuraUrl = "https://goerli.infura.io/v3/ebcd612557894e3896fd311e69bf6476";
const web3 = new Web3(infuraUrl);

let fantium = fs.readFileSync("fantium.json");
let contractABI = JSON.parse(fantium);
const contractAddress = "0x4c61c07F1Ff7de15e40eFc1Bd3A94eEB54cBF242";
const contract = new web3.eth.Contract(contractABI, contractAddress);

const cors = require("cors");
const server = express();
server.use(cors());

server.get("/get-collection", async (req, res) => {
  console.log(req);
  try {
    let jsonDataArray = [];
    await Promise.all(
      collectionFromJson.collections.map(async (collection) => {
        let collectionData = await contract.methods.collections(collection.id).call();

        jsonDataArray.push({
          image_url: collection.image_url,
          level: collection.level,
          description: collection.description,
          ownership_rate: (
            (parseFloat(collectionData.tournamentEarningShare1e7) /
              parseFloat(collectionData.athletePrimarySalesBPS)) *
            100
          ).toFixed(2),
          price: parseInt(collectionData.price),
          invocations: parseInt(collectionData.invocations),
          mint_mode: collectionData.isMintable && collection.id !== 6,
          launched_at: new Date(parseInt(collectionData.launchTimestamp) * 1000).toDateString(),
        });
      })
    );
    res.status(200).json(jsonDataArray);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
