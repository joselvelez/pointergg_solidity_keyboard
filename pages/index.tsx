import React, { useEffect, useState } from "react";
import PrimaryButton from "../components/primary-button";
import ABI from "../artifacts/contracts/keyboards.sol/Keyboards.json";
import { ethers } from "ethers";
import Keyboard from "../components/keyboard";
import addressesEqual from "../utils/addressesEqual";
import { UserCircleIcon } from "@heroicons/react/solid";
import TipButton from "../components/tip-button";

declare var window: any;

export default function Home() {
  const [ethereum, setEthereum] = useState<any>(undefined);
  const [connectedAccount, setConnectedAccount] = useState<string | undefined>(undefined);
  const [keyboards, setKeyboards] = useState<string[]>([]);
  const [keyboardsLoading, setKeyboardsLoading] = useState<boolean>(false);

  const contractAddress = '0x0f0072be5ab5eBfbdF38d7b5Ac0b58564ee96A80';
  const contractABI = ABI.abi;

  useEffect(() => {
    getConnectedAccount();
  },[]);

  useEffect(() => {
    getKeyboards();
  },[connectedAccount]);

  async function getKeyboards(): Promise<void> {
    if (ethereum && connectedAccount) {
      setKeyboardsLoading(true);

      try {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const keyboardsContract = new ethers.Contract(contractAddress, contractABI, signer);
  
        const keyboards = await keyboardsContract.getKeyboards();
        console.log(`Retrieved keyboards... ${keyboards}`);
        setKeyboards(keyboards);
      } finally {
        setKeyboardsLoading(false);
      }
    }
  }

  const handleAccounts = (accounts: string[]) => {
    if (accounts.length > 0) {
      const account = accounts[0];
      console.log(`We have an authorized account: ${account}`);
      setConnectedAccount(account);
    } else {
      console.log(`No authorized account yet`);
    }
  };

  async function getConnectedAccount(): Promise<void> {
    if (window.ethereum) {
      setEthereum(window.ethereum);
    }

    if (ethereum) {
      const accounts = await ethereum.request({ method: 'eth_accounts'});
      handleAccounts(accounts);
    }
  }

  async function connectAccount(): Promise<void> {
    if (!ethereum) {
      alert(`MetaMask is required to connect an account`);
      return;
    }

    const accounts = await ethereum.request({ method: 'eth_requestAccounts'});
    handleAccounts(accounts);
  };

  if (!ethereum) {
    return <p>Please install MetaMask to connect to this site</p>
  }
  
  if (!connectedAccount) {
    return <PrimaryButton onClick={connectAccount}>Connect MetaMask Wallet</PrimaryButton>
  }
  
  if (keyboards.length > 0) {
    return (
      <div className="flex flex-col gap-4">
        <PrimaryButton type="link" href="/create">Create a Keyboard!</PrimaryButton>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
          {keyboards.map(
            ([kind, isPBT, filter, owner], i) => (
              <div key={i} className="relative">
                <Keyboard kind={kind} isPBT={isPBT} filter={filter} />
                <span className="absolute top-1 right-6">
                  {addressesEqual(owner, connectedAccount) ?
                    <UserCircleIcon className="h-5 w-5 text-indigo-100" /> :
                    <TipButton ethereum={ethereum} index={i} />
                  }
                </span>
              </div>
            )
          )}
        </div>
      </div>
    )
  }
  
  if (keyboardsLoading) {
    return (
      <div className="flex flex-col gap-4">
        <PrimaryButton type="link" href="/create">Create a Keyboard!</PrimaryButton>
        <p>Loading Keyboards...</p>
      </div>
    )
  }

  // No keyboards yet
  return (
    <div className="flex flex-col gap-4">
      <PrimaryButton type="link" href="/create">Create a Keyboard!</PrimaryButton>
      <p>No keyboards yet!</p>
    </div>
  )

}