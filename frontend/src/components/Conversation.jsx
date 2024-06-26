import {
  Avatar,
  AvatarBadge,
  Flex,
  Stack,
  Text,
  WrapItem,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { chosenConversationAtom } from "../atoms/conversationsAtom";
import { useRecoilState } from "recoil";

const Conversation = ({ conversation, isOnline }) => {
  const { colorMode } = useColorMode();
  const recipient = conversation.participants[0];
  const lastMessage = conversation.lastMessage.text;
  const [chosenConversation, setChosenConversation] = useRecoilState(
    chosenConversationAtom
  );

  if (!recipient) return null;

  return (
    <Flex
      gap={4}
      alignItems={"center"}
      p={"1"}
      _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.600", "gray.dark"),
        color: "white",
      }}
      onClick={() =>
        setChosenConversation({
          _id: conversation._id,
          userId: recipient._id,
          profilePicture: recipient.profilePicture,
          name: recipient.name,
          mock: conversation.mock,
        })
      }
      bg={
        chosenConversation?._id === conversation._id
          ? colorMode == "light"
            ? "gray.400"
            : "gray.dark"
          : ""
      }
      borderRadius={"md"}
    >
      <WrapItem>
        <Avatar
          size={{ base: "xs", sm: "sm", md: "md" }}
          src={recipient.profilePicture}
        >
          {isOnline ? (
            <AvatarBadge boxSize={"1em"} bg={"green.500"} />
          ) : (
            <AvatarBadge boxSize={"1em"} bg={"red.500"} />
          )}
        </Avatar>
      </WrapItem>

      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight={"700"} display={"flex"} alignItems={"center"}>
          {recipient.name}
        </Text>
        <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
          {lastMessage.length > 14
            ? lastMessage.slice(0, 14) + "..."
            : lastMessage}
        </Text>
      </Stack>
    </Flex>
  );
};

export default Conversation;
