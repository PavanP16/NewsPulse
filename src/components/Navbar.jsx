import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Modals from "./Modals";
import { useDisclosure } from "@chakra-ui/react";
import AvatarIcon from "./AvatarIcon";

const Navbar = ({ currentAccount, contractInstance }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { pathname } = useLocation();
  const [changed, setChanged] = useState(false);

  const changedHander = () => {
    setChanged(true);
  };
  const isLinkActive = (path) => {
    return pathname === path;
  };

  console.log(pathname);

  return (
    <div className="inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        <div className="flex flex-row gap-4 items-center">
          {" "}
          <Link to="/" className="flex gap-2 items-center">
            <p className="hidden p-2 text-zinc-700 text-xl font-medium md:block">
             NewsPulse
            </p>
          </Link>
          <Link to="/postSomething">
            <p className={`hidden p-2 text-zinc-700 text-[1rem] font-medium md:block hover:bg-gray-300 hover:rounded-lg ease-out duration-200 ${
                isLinkActive("/postSomething") ? "bg-gray-300 rounded-lg ease-out duration-200" : ""
              }`}>
              Post 
            </p>
          </Link>
          <Link to="/yourposts">
          <p className={`hidden p-2 text-zinc-700 text-base font-medium md:block hover:bg-gray-300 hover:rounded-lg ease-out duration-200 ${
                isLinkActive("/yourposts") ? "bg-gray-300 rounded-lg ease-out duration-200" : ""
              }`}>
              YourPosts
            </p>
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <Modals
            isOpen={isOpen}
            onRequestClose={onClose}
            contractInstance={contractInstance}
            changed={changedHander}
          />
          <Link
            onClick={onOpen}
            className="cursor-pointer p-2 text-zinc-700 text-base font-medium md:block hover:bg-gray-300 hover:rounded-xl ease-out duration-200"
          >
            Get tokens
          </Link>

          <p>
            <AvatarIcon
              currentAccount={currentAccount}
              contractInstance={contractInstance}
              newchange={changed}
            />
          </p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
