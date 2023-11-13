import Modal from "react-modal";
import "./Modals.css";
import { useState } from "react";
import { ethers } from "ethers";
import { toast } from "sonner";

const Modals = ({ isOpen, onRequestClose, contractInstance ,changed}) => {
  console.log(contractInstance);

  const [tokenAmount, setTokenAmount] = useState(0);


  const handleTokenAmountChange = (event) => {
    setTokenAmount(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (contractInstance) {
  
      const promise = new Promise(async(resolve, reject) => {

        try {
          const res = await contractInstance.receiveTokens({ value: ethers.utils.parseEther("0.001") });
          await res.wait();
          resolve("Tokens received successfully");

        } catch (error) {
          console.log(error.message);
          reject("Error in receiving tokens");
        }
      });

      toast.promise((promise), {
        loading: "Receiving tokens...",
        success: (data) => {
          return `${data}`;
        },
        error: 'Error'
      })

      promise.then((data)=>{
        console.log(data);
        onRequestClose();
        changed(true);
      })
    }
   
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal"
      overlayClassName="modal-overlay"
    >
      <div className="bg-white w-10/12 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">How Many Tokens You Want</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Token Amount
            </label>
            <input
              type="number"
              className="border rounded w-full py-2 px-3"
              placeholder="Enter the number of tokens"
              value={tokenAmount}
              onChange={handleTokenAmountChange}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-zinc-500 hover:bg-zinc-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </form>
        <button
          className="mt-4 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={onRequestClose}
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default Modals;
