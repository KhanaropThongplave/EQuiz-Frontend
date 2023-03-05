import Link from "next/link";
import { useListen } from "../hooks/useListen";
import { useMetamask } from "../hooks/useMetamask";
import { Loading } from "./Loading";

export default function Wallet() {
  const {
    dispatch,
    state: { status, isMetamaskInstalled, wallet, balance },
  } = useMetamask();
  const listen = useListen();

  const showInstallMetamask =
    status !== "pageNotLoaded" && !isMetamaskInstalled;
  const showConnectButton =
    status !== "pageNotLoaded" && isMetamaskInstalled && !wallet;

  const isConnected = status !== "pageNotLoaded" && typeof wallet === "string";

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
      dispatch({ type: "connect", wallet: accounts[0], balance });

      listen();
    }
  };

  const handleDisconnect = () => {
    dispatch({ type: "disconnect" });
  };

  return (
      <div className="">
        {wallet && balance && (
          <div className="">
            <h3 className="">
              Address: <span>{wallet}</span>
            </h3>
            <p className="">
              Balance:{" "}
              <span>
                {(parseInt(balance) / 1000000000000000000).toFixed(2)}{" "}
              </span>
            </p>
          </div>
        )}

        {showConnectButton && (
          <button
            onClick={handleConnect}
            className=""
          >
            {status === "loading" ? <Loading /> : "Connect Wallet"}
          </button>
        )}

        {showInstallMetamask && (
          <Link href="https://metamask.io/" target="_blank">
            <a className="">
              Install Metamask
            </a>
          </Link>
        )}

        {isConnected && (
          <div className="">
            <button
              onClick={handleDisconnect}
              className=""
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
  );
}
