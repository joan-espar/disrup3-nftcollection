import { useWeb3Store } from '@/stores/web3Store'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect} from 'react'

export default function App({ Component, pageProps }: AppProps) {

  // const changeAddress = useWeb3Store((state) => state.changeAddress)
  // const changeChainId = useWeb3Store((state) => state.changeChainId)

  // el mateix, pero important tot
  const { changeAddress, changeChainId, setProvider} = useWeb3Store()

  useEffect(() => {
    setProvider()
    if(!window.ethereum) return

    window.ethereum.on("accountsChanged", (acc: string[]) => {
      changeAddress(acc[0]);
    });
  
    window.ethereum.on("chainChanged", (newChainId: number) => {
      changeChainId(Number(newChainId));
    });

    return () => {
    }
  }, [])
  
  return <Component {...pageProps} />
}
