import React, { useState } from 'react';
import { ethers } from 'ethers'
import Greeter from '../../artifacts/contracts/Greeter.sol/Greeter.json';
import styles from './index.css';

const greeterAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';

export default function () {
  const [greeting, setGreetingValue] = useState<string>();
  const [data, setData] = useState<string>();
  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  // call the smart contract, read the current greeting value
  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        setData(data);
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  // call the smart contract, send an update
  async function setGreeting() {
    if (!greeting) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      console.log('set greeting...', contract.setGreeting);
      const transaction = await contract.setGreeting(greeting)
      await transaction.wait()
      fetchGreeting()
    }
  }

  return (
    <div className={styles.normal}>
      <div className={styles.welcome} />
      <div>
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />
      </div>
      <p>
        {data}
      </p>
    </div>
  );
}
