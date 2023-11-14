import { Icon, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AiFillLike } from "react-icons/ai";
import { AiFillDislike } from "react-icons/ai";
import { BsGraphUpArrow } from "react-icons/bs";
import { toast } from "sonner";
import { FaTrash } from "react-icons/fa";

const InfoStats = ({ contractInstance, id, currentAccount,changed }) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [rating, setRating] = useState(0);

  const getStats = async () => {
    try {
      const sc = await contractInstance.getBlog_Single(id);
      setLikes(sc.likesCnt.toNumber());
      setDislikes(sc.dislikesCnt.toNumber());
      setRating(sc.rating);
    } catch (error) {
      console.error(error);
    }
  };

  const DeleteHandler = async () => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await contractInstance.deleteBlog(id);
        await res.wait();
        resolve("Blog deleted successfully");
      } catch (error) {
        console.log(error.message);
        reject("Error in deleting blog");
      }
    });

    toast.promise(promise, {
      loading: "Deleting blog...",
      success: (data) => {
        return `${data}`;
      },
      error: "Error",
    });

    promise.then((data) => {
      console.log(data);
      changed();
    });
  };

  useEffect(() => {
    if (contractInstance && currentAccount) {
      getStats();
    }
  }, [contractInstance, currentAccount]);

  return (
    <div className="flex justify-between">
      <div className="bg-gray-100 p-2 flex gap-8">
        <div className="flex gap-1">
          <Icon as={AiFillLike} color="blue.500" boxSize={5} />
          <h1 className="text-sm">{likes}</h1>
        </div>
        <div className="flex gap-1">
          <Icon as={AiFillDislike} color="red.500" boxSize={5} />
          <h1>{dislikes}</h1>
        </div>
        <div className="flex gap-4">
          <Icon as={BsGraphUpArrow} color="orange.500" boxSize={5} />
          <h1>{rating}</h1>
        </div>
      </div>

      <button onClick={DeleteHandler}>
        <Icon
          as={FaTrash}
          color="red.500"
          boxSize={5}
          className="hover:text-slate-600 ease-out trasition duration-600"
        />
      </button>
    </div>
  );
};

export default InfoStats;
