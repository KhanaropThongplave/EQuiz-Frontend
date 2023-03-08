import type { NextPage } from "next";
import { useEffect } from "react";
import Wallet from "../components/Wallet";
import { useListen } from "../hooks/useListen";
import { useMetamask } from "../hooks/useMetamask";
import Quiz from "./Quiz";

const Home: NextPage = () => {
  const {
    dispatch,
    state: { status, wallet, token, symbol },
  } = useMetamask();
  const listen = useListen();

  const isConnected = status !== "pageNotLoaded" && typeof wallet === "string" && typeof token === "string" && typeof symbol === "string";

  useEffect(() => {
    if (typeof window !== undefined) {
      const ethereumProviderInjected = typeof window.ethereum !== "undefined";

      const isMetamaskInstalled =
        ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);

      const local = window.localStorage.getItem("metamaskState");

      if (local) {
        listen();
      }

      const { wallet, balance, token, symbol } = local
        ? JSON.parse(local)
        : { wallet: null, balance: null, token: null, symbol: null };

      dispatch({ type: "pageLoaded", isMetamaskInstalled, wallet, balance, token, symbol });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  return (
    <div>
      {!isConnected && ( 
        <Wallet/>
      )}

      {isConnected && (
        <Quiz isConnected={isConnected}/>
      )}
    </div>
  );
};

export default Home;
