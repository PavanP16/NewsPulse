import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "./ethereum/constants";
import Navbar from "./components/Navbar";
import Post from "./Post";
import { ChakraBaseProvider } from "@chakra-ui/react";
import Form from "./Form";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster, toast } from "sonner";
import YourPosts from "./YourPosts";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [contractInstance, setContractInstance] = useState(null);

  const loadBlockchainData = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        setContractInstance(contract);
        const updateAccounts = async () => {
          const accounts = await provider.listAccounts();
          setCurrentAccount(accounts[0]);
        };
        updateAccounts();
        window.ethereum.on("accountsChanged", updateAccounts);
      } catch (error) {
        console.error("Error loading blockchain data:", error);
      }
    } else {
      toast.info("Install MetaMask dude");
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  console.log(contractInstance);

  return (
    <ChakraBaseProvider>
      <Toaster richColors position="top-center"/>
      <Router>
        <Navbar
          currentAccount={currentAccount}
          contractInstance={contractInstance}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Post
                contractInstance={contractInstance}
                currentAccount={currentAccount}
              />
            }
          />
          <Route
            path="/postSomething"
            element={<Form contractInstance={contractInstance} />}
          />
          <Route
            path="/yourposts"
            element={
              <YourPosts
                contractInstance={contractInstance}
                currentAccount={currentAccount}
                title={"Your Posts"}
              />
            }
          />
        </Routes>
      </Router>
    </ChakraBaseProvider>
  );
}

export default App;
