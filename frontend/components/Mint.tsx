import { nftContract } from "@/constants/contracts";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useWeb3Store } from "@/stores/web3Store";

const Mint = () => {

    const {address, provider} = useWeb3Store();

    const [ contract, setContract] = useState<ethers.Contract>();
    const [ maxSupply, setMaxSupply] = useState(0);
    const [ totalSupply, setTotalSupply] = useState(0);
    const [ maxNftPerAddress, setMaxNftPerAddress] = useState(0);
    const [ nftsMinted, setNftsMinted] = useState(0);
    const [ isWhitelisted, setIsWhitelisted] = useState(false);
    const [ pricePerNft, setPricePerNft] = useState(0);
    const [cantidad, setCantidad] = useState(0);

    async function addCantidad() {
        setCantidad(Math.min(cantidad + 1, 10))
    }
    async function subtractCantidad() {
        setCantidad(Math.max(cantidad - 1, 0))
    }

    async function getMaxSupply() {
        if(!contract) return
        setMaxSupply(Number(await contract.maxSupply()))
    }

    async function getTotalSupply() {
        if(!contract) return
        setTotalSupply(Number(await contract.totalSupply()))
    }

    async function getMaxNftPerAddress() {
        if(!contract) return
        setMaxNftPerAddress(Number(await contract.maxNftPerAddress()))         
    }

    async function getNftsMinted() {
        if(!contract) return
        setNftsMinted(Number(await contract.getNftsMinted(address))) 
    }

    async function getIsWhitelisted() {
        if(!contract) return
        setIsWhitelisted(await contract.isWhitelisted(address)) 
    }

    async function getPricePerNft() {
        if(!contract) return
        setPricePerNft(Number(await contract.pricePerNft()))
    }


    async function mint() {
        if(!contract) return
        console.log()
        await contract.mint(cantidad, {value: pricePerNft * cantidad})
    }


    useEffect(() => {
        if (typeof window == "undefined" || !provider) {  
            console.log("fail useEffect")
            return
         };
        
        const fetchData = async () => {
            const contract = new ethers.Contract(nftContract.address, nftContract.abi, provider?.getSigner());
            setContract(contract);
            
            getMaxSupply()
            getTotalSupply()
            getIsWhitelisted()
            getMaxNftPerAddress() 
            getNftsMinted()
            getPricePerNft()
            console.log("-----------------")
            console.log(maxSupply)
            console.log(totalSupply)
            console.log(isWhitelisted)
            console.log(maxNftPerAddress)
            console.log(nftsMinted)
            console.log(pricePerNft)
            console.log("-----------------")
        }
        fetchData()

    }, [provider, address]) 

  return (
    <section className="m-0-auto flex justify-center">
        <div className="mt-5 ml-5 mr-5 mb-5 bg-gray-900 p-2 rounded-sm border-2 border-gray-100  sm:w-[70%] lg:max-w-[30%]">
            <h2 className="text-center pb-2 text-2xl">Mint your Mr crypto</h2>
            <img  src="mrc.png" alt="" />

            <div className="flex items-center justify-between p-1 mt-2">
                <p>Total Supply:</p>
                <p>{totalSupply} / {maxSupply}</p>
            </div>

            <div className="flex items-center justify-between p-1 mt-2">
                <p>Address Minted / Total Available:</p>
                <p>{nftsMinted} / {isWhitelisted ? maxNftPerAddress : 0}</p>
            </div>


            <div className="flex items-center justify-between p-1 mt-2">
                <p>Seleccionar cantidad:</p>

                <div className="flex items-center justify-center">
                    <button className="text-2xl bg-orange-400 pl-3 pr-3 rounded-sm" onClick={subtractCantidad}> - </button>
                    <p className="text-2xl text-black pl-2 pr-2 bg-orange-200">{cantidad}</p>
                    <button className="text-2xl bg-orange-400 pl-3 pr-3 rounded-sm" onClick={addCantidad}> + </button>
                </div>
            </div>
            
            <div className="flex items-center justify-between p-1 mt-2">
                <p>Price per NFT:</p>
                <p>{ethers.utils.formatEther(BigInt(pricePerNft))} ETH</p>
            </div>

            <div className="flex items-center justify-between p-1 mt-2">
                <p>Total Price:</p>
                <p>{ethers.utils.formatEther(BigInt(pricePerNft) * BigInt(cantidad))} ETH</p> 
            </div>

            <div className="flex items-center justify-between p-1 mt-2">
                <p></p>

                <div className="flex items-center justify-center">
                    <button className="text-2xl bg-orange-400 pl-3 pr-3 rounded-sm" onClick={mint}> MINT </button>
                </div>
            </div>

        </div>
    </section>
  )
}

export default Mint