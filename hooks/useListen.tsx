import { ethers } from "ethers";
import { useMetamask } from "./useMetamask";
import { EQuizToken__factory } from "../typechain-types";

export const useListen = () => {
  const { dispatch } = useMetamask();

  return () => {
    window.ethereum.on("accountsChanged", async (newAccounts: string[]) => {
      if (newAccounts.length > 0) {
        const newBalance = await window.ethereum!.request({
          method: "eth_getBalance",
          params: [newAccounts[0], "latest"],
        });

        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const signer = provider.getSigner(newAccounts[0]);

        const EQuiz = EQuizToken__factory.connect(
          "0x481D3EFA6bF3aEbE0060c6eF078811b5789aa876",
          signer
        );

        const equizAmount = await EQuiz.balanceOf(newAccounts[0])
        const equizSymbol = await EQuiz.symbol()

        dispatch({
          type: "connect",
          wallet: newAccounts[0],
          balance: newBalance,
          token: equizAmount._hex.toString(),
          symbol: equizSymbol,
        });
      } else {
        dispatch({ type: "disconnect" });
      }
    });

    window.ethereum.on("chainChanged", async (switchChainId: number) => {
      if (switchChainId != 11155111) {
        await window.ethereum!.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0xAA36A7",
              rpcUrls: ["https://rpc.sepolia.org"],
              chainName: "Sepolia Testnet",
              nativeCurrency: {
                name: "Sepolia ETH",
                symbol: "ETH",
                decimals: 18,
              },
            },
          ],
        });
      }
    });
  };
};
