// DEFINIR UN ESTADO CON SUS PROPIEDADES Y METODOS PARA MUTARLO

import { supportedChains } from '@/constants/supportedChains';
import { ethers } from 'ethers';
import { create } from 'zustand'

declare global {
  interface Window { ethereum: any }
}

interface IWeb3State {
    address: string;
    isConnected: boolean;
    chainId: number;
    provider?: ethers.providers.Web3Provider;
    errorMessage: string;

    connectWallet: () => Promise<void>;
    disconnect: () => void;
    changeAddress: (address: string) => void;
    changeChainId: (chainId: number) => void;
    setProvider: () => void;
}

export const useWeb3Store = create<IWeb3State>((set) => ({
    address: "",
    isConnected: false,
    chainId: 0,
    provider: undefined,
    errorMessage: "",

    async connectWallet() {
      if (!window.ethereum) return set({
          errorMessage: "necesitas instalar metamask"
      })
      const _provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await _provider?.send("eth_requestAccounts", []);     
      set({
        isConnected: true,
        address: accounts[0],
        provider: _provider,
        chainId: await (await _provider.getNetwork()).chainId,
      })
    },
    
    changeAddress(_address) {
      set({
        address: _address,
      })
    },

    changeChainId(_chainId) {
      if(!supportedChains.includes(_chainId)) {
        return set({
          errorMessage: "chain not supported"
        })
      }
      set({
        chainId: _chainId,
        errorMessage: "",
      })
    },

    disconnect() {
      set({
        address: "",
        isConnected: false,
        chainId: 0,
      })
    },

    setProvider() {
      if (!window.ethereum) return set({
        errorMessage: "necesitas instalar metamask"
      })
      const _provider = new ethers.providers.Web3Provider(window.ethereum);
      set({
        provider: _provider,
        errorMessage: "",
      })
    },
  }))