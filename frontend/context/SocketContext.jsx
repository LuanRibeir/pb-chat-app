import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import io from "socket.io-client";
import userAtom from "../src/atoms/userAtom";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      query: {
        userId: user?._id,
      },
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
