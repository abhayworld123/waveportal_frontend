import * as React from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/wave.json";

export default function App() {

  const contractAddress = "0x94361976f0F3EFFFd211f89011Ce93eF1C579155";
    const contractABI = abi.abi;
const [currAccount, setCurrentAccount] = React.useState("");
const [count, setCount] = React.useState([]);

  const wave =async () => {
    const provider= new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
  
    const WavePortalContract= new ethers.Contract(contractAddress,contractABI, signer);

    const newcount = await WavePortalContract.getTotalWaves();
    setCount(newcount);
    console.log("retreived total  waves",newcount.toNumber());
  }
  const checkIfWalletIsConnected = () => {
    const {ethereum } = window;
    if(!ethereum){
      console.log("Make sure u have metamask");
      return;
    }
    else{
      console.log('ethereum object', ethereum);
    }

    ethereum.request({method : "eth_accounts"}).then((accounts)=>{
       if(accounts.length !== 0){
           const account = accounts[0];
           console.log('auhoried account found',account);
         setCurrentAccount(account);  
      }
      else{
        console.log("no authorised log found");
      }
    })
      
    
  }

  const connectWallet = ()=>{
    alert(1);
    const {ethereum } = window;
    if(!ethereum){
      alert ("Get metamask");
    }
    ethereum.request({method : "eth_requestAccounts"}).then((acc)=>{
     console.log("Connectes", acc[0]);
     setCurrentAccount(acc[0]);
    })
    .catch(error => console.log(error));
  }


  React.useEffect(()=>{
    checkIfWalletIsConnected()
  },[])
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        Welcome to Ab's DApp? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

         <button className="waveButton" onClick={connectWallet}>
          Connect metamask
        </button>

        <p>{currAccount}</p>
           <div>Total waves{count} </div>
      </div>
    </div>
  );
}
