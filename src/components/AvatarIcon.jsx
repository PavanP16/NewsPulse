import React, { useEffect, useState } from "react";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Box,
  Text,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { GiToken } from "react-icons/gi";
import ConnectedAccount from "./ConnectedAccount";
import { ethers } from "ethers";

const AvatarIcon = ({
  currentAccount,
  contractInstance,
  newchange,
  posted,
  voted
}) => {
  const [balance, setbalan] = useState(null);

  const fetchBalance = async () => {
    try {
      const balance = await contractInstance.balanceOf(currentAccount);
      const finalBal = ethers.utils.formatEther(balance);
      setbalan(finalBal);
    } catch (error) {
      console.error("ERROR ", error);
    }
  };

  useEffect(() => {
    if (contractInstance && currentAccount) {
      fetchBalance();
    }
  }, [contractInstance, currentAccount, newchange, posted, voted]);

  return (
    <Menu>
      <MenuButton as={IconButton} boxSize={9} padding={0} color="gray.800">
        <Box boxSize={8}>
          <Avatar bg="gray.700" />
        </Box>
      </MenuButton>
      <div className="relative">
        <MenuList
          className="p-3 shadow-md" // Add padding and shadow to the dropdown
          bg="white"
          color="gray.500"
          border="1px solid teal.500"
          borderRadius="8px"
        >
          <MenuItem
            padding={3}
            _hover={{
              bg: "gray.100",
              color: "white",
            }}
            mb={2} // Add margin-bottom for a gap between MenuItems
            borderBottom="2px solid gray.400" // Add a light black line
          >
            <ConnectedAccount currentAccount={currentAccount} />
          </MenuItem>
          <MenuItem
            padding={3}
            _hover={{
              bg: "gray.100",
              color: "white",
            }}
            mb={2}
            borderBottom="2px solid gray.400" // Add a light black line
          >
            <Flex alignItems="center">
              <Icon as={GiToken} color="gold" boxSize={8} />
              <Text ml={3} className="text-gray-800 text-lg font-semibold">
                Balance: {balance}NP
              </Text>
            </Flex>
          </MenuItem>
        </MenuList>
      </div>
    </Menu>
  );
};

export default AvatarIcon;
