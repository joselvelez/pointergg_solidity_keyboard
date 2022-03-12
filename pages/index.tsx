import React, { useEffect, useState } from "react";
import PrimaryButton from "../components/primary-button";
import Keyboard from "../components/keyboard";
import addressesEqual from "../utils/addressesEqual";
import { UserCircleIcon } from "@heroicons/react/solid";
import TipButton from "../components/tip-button";
import getKeyboardsContract from "../utils/getKeyboardsContract";
import { toast } from "react-hot-toast";

export default function Home() {
  const { ethereum, connectedAccount, connectAccount } = useMetaMaskAccount();
  const [keyboards, setKeyboards] = useState<string[]>([]);
  const [keyboardsLoading, setKeyboardsLoading] = useState<boolean>(false);
  const keyboardsContract = getKeyboardsContract(ethereum);

  // useEffect(() => {
  //   getConnectedAccount();
  // },[]);

  useEffect(() => {
    getKeyboards();
  },[!!keyboardsContract, connectedAccount]);

  useEffect(() => {
    addContractEventHandlers
  }, [!!keyboardsContract, connectedAccount]);

  const addContractEventHandlers = () => {
    if (keyboardsContract && connectedAccount) {
      keyboardsContract.on('KeyboardCreated', async (keyboard) => {
        if (connectedAccount && !addressesEqual(keyboard.owner, connectedAccount)) {
          toast('Somebody created a new keyboard!', { id: JSON.stringify(keyboard) })
        }
        await getKeyboards();
      });
    }
  };

  async function getKeyboards(): Promise<void> {
    if (ethereum && connectedAccount) {
      setKeyboardsLoading(true);
      
      try {
        const keyboards = await keyboardsContract?.getKeyboards();
        console.log(`Retrieved keyboards... ${keyboards}`);

        setKeyboards(keyboards);
      } finally {
        setKeyboardsLoading(false);
      }
    }
  }

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
                    <TipButton keyboardsContract={keyboardsContract} index={i} />
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