import { Card, CardBody, Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { SiBlockchaindotcom } from "react-icons/si";

const ConnectedAccount = ({ currentAccount }) => {
  return (
    <Card shadow={4}>
      <CardBody>
        <Flex alignItems="center">
          <Icon as={SiBlockchaindotcom} color="blue.500" boxSize={8} />
          <Text ml={3} className="text-gray-800 text-lg font-semibold">
            Connected Account: {currentAccount}
          </Text>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default ConnectedAccount;