import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";

import { BiSolidSend } from "react-icons/bi";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  chosenConversationAtom,
  conversationsAtom,
} from "../atoms/conversationsAtom";

const MessageInput = ({ setMessages }) => {
  const showToast = useShowToast();
  const chosenConversation = useRecoilValue(chosenConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const [messageText, setMessageText] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageText) return;

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          recipientId: chosenConversation.userId,
        }),
      });

      const data = await res.json();
      if (data.error) {
        showToast("Erro", data.error, "error");
        return;
      }

      setMessages((messages) => [...messages, data]);

      setConversations((prevConvs) => {
        const updatedConversations = prevConvs.map((conversation) => {
          if (conversation._id === chosenConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText,
                sender: data.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
      setMessageText("");
    } catch (error) {
      showToast("Erro", error.message, "error");
    }
  };

  return (
    <form onSubmit={handleSendMessage}>
      <InputGroup>
        <Input
          w={"full"}
          placeholder="Mensagem"
          onChange={(e) => setMessageText(e.target.value)}
          value={messageText}
        />
        <InputRightElement onClick={handleSendMessage}>
          <BiSolidSend />
        </InputRightElement>
      </InputGroup>
    </form>
  );
};

export default MessageInput;
