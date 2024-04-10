import {
  Avatar,
  Divider,
  Flex,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { chosenConversationAtom } from "../atoms/conversationsAtom";
import userAtom from "../atoms/userAtom";

const MessageContainer = () => {
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const [chosenConversation, setChosenConversation] = useRecoilState(
    chosenConversationAtom
  );
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setLoadingMessages(true);
    setMessages([]);
    console.log("Fetching messages...");
  }, [chosenConversation.userId]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        if (chosenConversation.mock) return;

        fetch(`/api/messages/${chosenConversation.userId}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              console.log(data.error);
              // showToast(data.error);
              return;
            }

            setMessages(data);
            setLoadingMessages(false);
          });
      } catch (error) {
        console.log(error);
      } finally {
        console.log("aass");
      }
    };
    getMessages();
  }, [chosenConversation.userId, chosenConversation.mock, messages]);

  return (
    <Flex
      flex="70%"
      bg={useColorModeValue("gray.200", "gray.dark")}
      borderRadius={"md"}
      flexDirection={"column"}
      p={2}
    >
      {/* Message header */}
      <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
        <Avatar src={chosenConversation.profilePicture} size={"sm"} />
        <Text>{chosenConversation.name}</Text>
      </Flex>
      <Divider />

      {/* Messages */}
      <Flex
        flexDir={"column"}
        gap={4}
        my={4}
        height={"400px"}
        overflowY={"scroll"}
        p={4}
      >
        {loadingMessages &&
          [...Array(5)].map((_, i) => (
            <Flex
              key={i}
              gap={2}
              alignItems={"center"}
              p={"1"}
              borderRadius={"md"}
              alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
            >
              {i % 2 === 0 && <SkeletonCircle size={"7"} />}

              <Flex flexDirection={"column"} gap={2}>
                <Skeleton h={"8px"} w={"250px"} />
              </Flex>

              {i % 2 !== 0 && <SkeletonCircle size={"7"} />}
            </Flex>
          ))}

        {!loadingMessages &&
          messages.map((message, index) => (
            <Flex
              key={message._id || index}
              direction={"column"}
              ref={
                messages.length - 1 === messages.indexOf(message)
                  ? messageEndRef
                  : null
              }
            >
              <Message
                message={message}
                ownMessage={currentUser._id === message.sender}
              />
            </Flex>
          ))}
      </Flex>

      <MessageInput setMessages={setMessages} />
    </Flex>
  );
};

export default MessageContainer;
