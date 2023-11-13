import { Icon } from "@chakra-ui/react";
import React from "react";
import { AiFillLike } from "react-icons/ai";
import { AiFillDislike } from "react-icons/ai";
import {BsGraphUpArrow} from "react-icons/bs";

const InfoStats = ({ contractInstance, id, blogPost, currentAccount }) => {

  console.log("Hello");
  return (
    <div className="bg-gray-100 p-2 flex gap-8">
      <div className="flex gap-1">
        <Icon as={AiFillLike} color="blue.500" boxSize={5} />
        <h1 className="text-sm">{90}</h1>
      </div>
      <div className="flex gap-1">
        <Icon as={AiFillDislike} color="red.500" boxSize={5} />
        <h1>{3}</h1>
      </div>
      <div className="flex gap-4">
      <Icon as={BsGraphUpArrow} color="orange.500" boxSize={5} />
        <h1>Wow dude so many ppl liking your posts</h1>
      </div>
    </div>
  );
};

export default InfoStats;
