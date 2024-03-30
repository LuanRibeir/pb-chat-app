import { atom } from "recoil";

export const conversationsAtom = atom({
  key: "conversationsAtom",
  default: [],
});

export const chosenConversationAtom = atom({
  key: "chosenConversation",
  default: {
    _id: "",
    userId: "",
    name: "",
    profilePicture: "",
  },
});
