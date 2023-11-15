import Modal from "react-modal";
import "./Modals.css";
import { useState } from "react";
import { ethers } from "ethers";
import { toast } from "sonner";

const Modals = ({ isOpen, onRequestClose, contractInstance, changed }) => {
  console.log(contractInstance);

  const [tokenAmount, setTokenAmount] = useState(null);

  const handleTokenAmountChange = (event) => {
    setTokenAmount(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (tokenAmount % 500 !== 0) {
      toast.warning("Enter in multiples of 500", {
        position: "bottom-right",
      });
      return;
    }

    if (tokenAmount < 500) {
      toast.warning("Minimum amount is 500", {
        position: "bottom-right",
      });
      return;
    }

    if (contractInstance) {
      const promise = new Promise(async (resolve, reject) => {
        try {
          let amountToCharge = tokenAmount * 0.000002;

          amountToCharge = ethers.utils.parseEther(amountToCharge.toString());
          console.log(amountToCharge);
          amountToCharge = amountToCharge.toString();
          const res = await contractInstance.receiveTokens(tokenAmount, {
            value: amountToCharge,
          });
          await res.wait();
          resolve("Tokens received successfully");
        } catch (error) {
          console.log(error.message);
          reject("Error in receiving tokens");
        }
      });

      toast.promise(promise, {
        loading: "Receiving tokens...",
        success: (data) => {
          return `${data}`;
        },
        error: "Error",
      });

      promise.then((data) => {
        setTokenAmount(null);
        onRequestClose();
        changed(true);
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal flex justify-center items-center"
      overlayClassName="modal-overlay"
    >
      <div className="bg-white w-fit rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">
          How Many Tokens You Want(Enter in multiples of 500)
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Token Amount
            </label>
            <input
              type="number"
              className="border border-gray-400 rounded w-full py-2 px-3"
              placeholder="Enter the number of tokens"
              value={tokenAmount}
              onChange={handleTokenAmountChange}
              required
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="mt-2 bg-zinc-500 hover:bg-zinc-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
            <button
              className="mt-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={onRequestClose}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default Modals;
