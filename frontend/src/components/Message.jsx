import { Avatar, Flex, Text } from "@chakra-ui/react";
import { chosenConversationAtom } from "../atoms/conversationsAtom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const Message = ({ ownMessage, message }) => {
  const chosenConversation = useRecoilValue(chosenConversationAtom);
  const user = useRecoilValue(userAtom);

  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf={"flex-end"}>
          <Text maxWidth={"350px"} bg={"blue.400"} p={1} borderRadius={"md"}>
            {message.text}
          </Text>
          <Avatar src={user.profilePicture} w={7} h={7} />
        </Flex>
      ) : (
        <Flex gap={2}>
          <Avatar src={chosenConversation.profilePicture} w={7} h={7} />
          <Text maxWidth={"350px"} bg={"gray.600"} p={1} borderRadius={"md"}>
            {message.text}
          </Text>
        </Flex>
      )}
    </>
  );
};

export default Message;
