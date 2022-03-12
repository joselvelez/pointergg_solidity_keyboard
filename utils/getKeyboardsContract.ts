import { ethers } from "ethers";
import ABI from "../artifacts/contracts/keyboards.sol/Keyboards.json";

const contractAddress = '0x0f0072be5ab5eBfbdF38d7b5Ac0b58564ee96A80';
const contractABI = ABI.abi;

export default function getKeyboardsContract(ethereum) {
  if(ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  } else {
    return undefined;
  }
}
