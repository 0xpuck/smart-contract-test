import Web3 from 'web3';
import contractABI from './fantium.json';

const web3 = new Web3('https://goerli.infura.io/v3/ebcd612557894e3896fd311e69bf6476');
const contractAddress = '0x4c61c07F1Ff7de15e40eFc1Bd3A94eEB54cBF242';
const contract = new web3.eth.Contract(contractABI, contractAddress);

const collections = [
    {
        id: 4,
        image_url: "/assets/AB_BRONZE_NFT_FINAL.png",
        level: "Bronze",
        ownership_rate: "0.0021",
        price: "99",
        invocations: "809",
        description: [
            { icon: "💎", body: "Access to FANtium Discord collectors channel" }
        ],
        mint_mode: true,
    },
    {
        id: 5,
        image_url: "/assets/AB_SILVER_NFT_FINAL.png",
        level: "Silver",
        ownership_rate: "0.0108",
        price: "499",
        invocations: "100",
        description: [
            { icon: "💎", body: "Early access (allowlist) on the next Thiem NFT drop" },
            { icon: "👋", body: "Exclusive workout video" }
        ],
        mint_mode: false,
    },
    {
        id: 6,
        image_url: "/assets/AB_GOLD_NFT_FINAL.png",
        level: "Gold",
        ownership_rate: "0.2171",
        price: "9,999",
        invocations: "10",
        description: [
            { icon: "💎", body: "Access to FANtium Discord collectors channel" },
            { icon: "👋", body: "Access to a private chat with the" }
        ],
        mint_mode: true,
    }
]

export default async function handler(req, res) {
  const { cid } = req.query;

  try {
    let collection = await contract.methods.collections(cid).call();
    let c = collections.find(c => c.id === Number(cid));

    res.status(200).json({
      ...c,
      ownership_rate: (collection.tournamentEarningShare1e7 / collection.athletePrimarySalesBPS * 100).toFixed(2),
      price: collection.price,
      invocations: collection.invocations,
      mint_mode: collection.isMintable && c.id !== 6,
      launched_at: new Date(collection.launchTimestamp * 1000).toDateString()
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
