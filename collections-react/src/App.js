import './App.css';
import { Contract, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import contractABI from './contractABI.json';

const contractAddress = "0x02A16B1d5bc09B6EF64A7cB7Dd8C6763ceE52514";


function App() {

  const [account, setAccount] = useState(null);
  const [isWalletInstalled, setIsWalletInstalled] = useState(false);
  const [NFTContract, setNFTContract] = useState(null);
  const [isMinting, setIsMinting] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      setIsWalletInstalled(true);
    }
  }, []);

  useEffect(() => {
    function initNFTContract() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setNFTContract(new Contract(contractAddress, contractABI.abi, signer));
    }
    initNFTContract();
  }, [account]);

  async function connectWallet() {
    window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then((accounts) => { 
        setAccount(accounts[0]);
       })
      .catch((error) => { 
        alert("Something went wrong");
       });
  }

  const data = [
    {
      url: "../public/assets/images/1.png",
      param: "handleMint('https://gateway.pinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/1.png')",
    },
    {
      url: "../public/assets/images/2.png",
      param: "handleMint('https://gateway.pinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/2.png')",
    },
    {
      url: "../public/assets/images/3.png",
      param: "handleMint('https://gateway.pinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/3.png')",
    },
    {
      url: "../public/assets/images/4.png",
      param: "handleMint('https://gateway.pinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/4.png')",
    },
    {
      url: "../public/assets/images/5.png",
      param: "handleMint('https://gateway.pinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/5.png')",
    }
  ];

  async function withdrawMoney() {
    try {
      const response = await NFTContract.withdrawMoney();
      console.log("Received:", response);
    } catch (err) {
      alert(err);
    }
  }
  
  async function handleMint(tokenURI) {
    setIsMinting(true);
    try {
      const options = {value: ethers.utils.parseEther("0.001")};
      const response = await NFTContract.mintNFT(tokenURI, options);
      console.log("Received:", response);
    } catch (err) {
      alert(err);
    }
    finally {
      setIsMinting(false);
    }
  }

  if (account === null) {
    return (
      <>
      <div className="container">
        <br />
        <h1>Epic Marketplace</h1>
        <h2>NFT marketplace</h2>
        <p>Buy an NFT from our marketplace</p>

        {isWalletInstalled ? (
          <button onClick={connectWallet}>Connect Wallet</button>
        ):(
          <p>Install Metamask wallet</p>
        )}
      </div>
      </>
    );
  }
  

  return (
    <>
    <div className="container">
      <br />
      <h1>Epic Marketplace</h1>

      <h2>NFT marketplace</h2>
      {data.map((item, index) => (
        <div className="imgDiv">
          <img
          src={item.url}
          key={index}
          alt="images"
          width={250}
          height={250}
          />
          <button isLoading={isMintiing}
          onClick={() => { 
            eval(item.param);
           }}>Mint - 0.001 eth</button>
        </div>
      ))}
      <button onClick={() => { 
        withdrawMoney();
      }}>Withdraw money from Contract</button>
    </div>
    </>
  );
}

export default App;
