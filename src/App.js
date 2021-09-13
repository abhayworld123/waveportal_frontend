import * as React from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/wave.json";

export default function App() {

  const contractAddress = "0x0dF59Af52136fAC191dF8F68CF536cD3b1cFaf04";
    const contractABI = abi.abi;
const [currAccount, setCurrentAccount] = React.useState("");
const [count, setCount] = React.useState([]);
const [allWaves, setAllWaves] = React.useState([]);

  const getAllWaves =async () => {
    const provider= new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
  
    const WavePortalContract= new ethers.Contract(contractAddress,contractABI, signer);

    let Waves = await WavePortalContract.getAllWaves();

    let wavesCleaned = [];

   Waves.forEach((wave)=>{
   console.log(parseInt(wave.timestamp._hex, 16));
   

     wavesCleaned.push({
     address:wave.waver,
     timestamp:new Date(parseInt(wave.timestamp._hex, 16)),
     message:wave.message
   })
   })
   setAllWaves(wavesCleaned);
  }

  const wave =async () => {
    const provider= new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
  
    const WavePortalContract= new ethers.Contract(contractAddress,contractABI, signer);

    let text = document.getElementById("inp");
     const waveTxn = await WavePortalContract.wave(text.value);

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

         getAllWaves();
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
        <div>
        Enter your message here
   <input id="inp" type = "text"/>
   </div>
        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

{currAccount ? null :(<button className="waveButton" onClick={connectWallet}>
          Connect metamask
        </button>)
        }

        <p>{currAccount}</p>

         {allWaves.map((wave,index)=>{
     return(
       <div class key={index} style={{backgroundColor:"OldLace", marginTop:"16px",padding:"8px"}}>
       <div>Address: {wave.address}</div>
       <div>Time: {wave.timestamp.toString()}</div>
       <div>Message: {wave.message}</div>
       </div>
     )
   })} 

    
      </div>

   
    </div>
  );
}
