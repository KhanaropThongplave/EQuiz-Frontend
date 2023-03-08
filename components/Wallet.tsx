import { ethers } from "ethers";
import Link from "next/link";
import { useListen } from "../hooks/useListen";
import { useMetamask } from "../hooks/useMetamask";
import { EQuizToken__factory } from "../typechain-types";
import { Loading } from "./Loading";

export default function Wallet() {
  const {
    dispatch,
    state: { status, isMetamaskInstalled, wallet },
  } = useMetamask();
  const listen = useListen();

  const showInstallMetamask =
    status !== "pageNotLoaded" && !isMetamaskInstalled;
  const showConnectButton =
    status !== "pageNotLoaded" && isMetamaskInstalled && !wallet;

  const handleConnect = async () => {
    dispatch({ type: "loading" });
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts.length > 0) {
      const balance = await window.ethereum!.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner(accounts[0]);

      const EQuiz = EQuizToken__factory.connect(
        "0x481D3EFA6bF3aEbE0060c6eF078811b5789aa876",
        signer
      );

      const equizAmount = await EQuiz.balanceOf(accounts[0])
      const equizSymbol = await EQuiz.symbol()
        
      dispatch({ type: "connect", wallet: accounts[0], balance, token: equizAmount._hex.toString(), symbol: equizSymbol });

      listen();
    }
  };

  return (
      <div>
        {showConnectButton && (
          <button
            onClick={handleConnect}
            className="connect-button"
          >
            <strong>{status === "loading" ? <Loading /> : "Connect Wallet"}</strong>
          </button>
        )}

        {showInstallMetamask && (
          <Link href="https://metamask.io/" target="_blank">
            <a className="">
              Install Metamask
            </a>
          </Link>
        )}
      </div>
  );
}
