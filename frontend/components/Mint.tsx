import { useState } from "react";

const supply = 1000;
const PRICE_PER_NFT = 0.1;

const Mint = () => {

    const [cantidad, setCantidad] = useState(1)

  return (
    <section className="m-0-auto flex justify-center">
        <div className="mt-5 ml-5 mr-5 mb-5 bg-gray-900 p-2 rounded-sm border-2 border-gray-100  sm:w-[70%] lg:max-w-[30%]">
            <h2 className="text-center pb-2 text-2xl">Mint your Mr crypto</h2>
            <img  src="mrc.png" alt="" />

            <div className="flex items-center justify-between p-1 mt-2">
                <p>Supply disponible:</p>
                <p>{supply}</p>
            </div>

            <div className="flex items-center justify-between p-1 mt-2">
                <p>Seleccionar cantidad:</p>

                <div className="flex items-center justify-center">
                    <button className="text-2xl bg-orange-400 pl-3 pr-3 rounded-sm"> - </button>
                    <p className="text-2xl text-black pl-2 pr-2 bg-orange-200">{cantidad}</p>
                    <button className="text-2xl bg-orange-400 pl-3 pr-3 rounded-sm"> + </button>
                </div>
            </div>
            
            <div className="flex items-center justify-between p-1 mt-2">
                <p>Precio Total:</p>
                <p>{PRICE_PER_NFT} ETH</p>
            </div>

        </div>
    </section>
  )
}

export default Mint