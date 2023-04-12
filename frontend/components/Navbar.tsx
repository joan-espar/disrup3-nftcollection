import { nftContract } from "@/constants/contracts";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { shortenAddress } from "@/utils/address";
import { useWeb3Store } from "@/stores/web3Store";


const Navbar = () => {

  const {address, connectWallet, provider, errorMessage} = useWeb3Store();

  const [ contract, setContract] = useState<ethers.Contract>();
  const [ maxSupply, setMaxSupply] = useState(0);
  const [ totalSupply, setTotalSupply] = useState(0);



  useEffect(() => {
    if (typeof window == "undefined" || !provider) { return };

    const contract = new ethers.Contract(nftContract.address, nftContract.abi, provider?.getSigner());
    setContract(contract);

  }, [provider])

  return (
    <nav className="flex items-center justify-between p-5">
        <div>
            <img className="sm:max-w-[200px]" src="mrc-logo.png" alt="logo mr crypto" />
        </div>

        <div>
          { errorMessage == ""
                ? <></> 
                : <p className="bg-red-500  text-white font-bold py-2 px-4 rounded" >{errorMessage}</p>
            }   
        </div>

        <div className="ml-3">
            { address !== ""
              ? <p className="bg-orange-500 text-white font-bold py-2 px-4 rounded">{shortenAddress(address)}</p> 
              : <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded" onClick={ connectWallet }>Connect Wallet</button>
            }
        </div>
    </nav>
  )
}

export default Navbar