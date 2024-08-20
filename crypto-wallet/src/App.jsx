import { useState, useEffect } from 'react'
import './App.css'
import PhraseWrapper from './components/PhraseWrapper'


import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js"
import KeysComponent from './components/KeysComponent';

import { Buffer } from 'buffer';
window.Buffer = Buffer;





function App() {
  const [words, setWords] = useState([]);
  const [seed, setSeed] = useState("");


  function generateWallet(){
    const mnemonic = generateMnemonic();
    setWords(mnemonic.split(" "));

    const seedgenerated = mnemonicToSeedSync(mnemonic);
    setSeed(seedgenerated.toString("hex"));
  }

  useEffect(() => {
    console.log(words);
  }, [words]);

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(words.join(" "));
      console.log("Copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }
  

  return <div className="bg-yellow-100 flex flex-col items-center justify-center h-dvh">
    <div>
      <h1>Wallet Generator</h1>
      <button className="bg-slate-400 rounded p-2" onClick={generateWallet}>Generate Seed Phrase</button>
    </div>

    <div>
      <PhraseWrapper words = {words}></PhraseWrapper>
    </div>

    <div className="flex gap-2 mt-4 p-2 rounded hover:bg-slate-300 cursor-pointer">
      <button className='flex items-center' onClick={copyToClipboard}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
      </svg>
      <span>Copy</span>
      </button>
    </div>
    
    <div>
      <KeyWrapper seed={seed}/>
    </div>
  </div>
}

function KeyWrapper({ seed }){
  const [count, setCount] = useState(0);
  const [keys, setKeys] = useState([])

  function generateAccounts() {
    try {
      const path = `m/44'/501'/${count}'/0'`;
      const seedBuffer = Buffer.from(seed, 'hex'); 
      const derivedSeed = derivePath(path, seedBuffer).key;
  
      const keyPair = nacl.sign.keyPair.fromSeed(derivedSeed);
      const privateKey = keyPair.secretKey;
      const publicKey = Keypair.fromSecretKey(privateKey).publicKey.toBase58();
  
      setKeys([...keys, {
        index: count,
        privateKey: Buffer.from(privateKey).toString('hex'),
        publicKey: publicKey
      }]);
  
      setCount(c => c + 1);
    } catch (error) {
      console.error("Error generating accounts:", error);
    }
  }
  

  return <div className="flex flex-col border border-gray-300 p-4">
    <button onClick={generateAccounts} className='bg-slate-400 rounded p-2'>Generate Wallet</button>
    <div>
      {keys.map(key => {
        <KeysComponent key={key.index} privateKey={key.privateKey} publicKey={key.publicKey}/>
      })}
    </div>
  </div>
}

export default App
