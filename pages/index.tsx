import type { NextPage } from "next";
import { useEffect } from "react";
import Wallet from "../components/Wallet";
import { useListen } from "../hooks/useListen";
import { useMetamask } from "../hooks/useMetamask";
import Quiz from "./quiz";

const Home: NextPage = () => {
  const {
    dispatch,
    state: { status, wallet },
  } = useMetamask();
  const listen = useListen();

  const isConnected = status !== "pageNotLoaded" && typeof wallet === "string";

  useEffect(() => {
    if (typeof window !== undefined) {
      const ethereumProviderInjected = typeof window.ethereum !== "undefined";

      const isMetamaskInstalled =
        ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);

      const local = window.localStorage.getItem("metamaskState");

      if (local) {
        listen();
      }

      const { wallet, balance } = local
        ? JSON.parse(local)
        : { wallet: null, balance: null };

      dispatch({ type: "pageLoaded", isMetamaskInstalled, wallet, balance });
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
