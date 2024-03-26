import { Container } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import ChatPage from "./pages/ChatPage";
import Header from "./components/Header";
import UpdateProfilePage from "./pages/UpdateProfilePage";

function App() {
  const user = useRecoilValue(userAtom);

  return (
    <Container maxW="container.lg">
      <Header />
      <Routes>
        <Route
          path="/"
          element={!user ? <Navigate to="/auth" /> : <Navigate to="/chat" />}
        />
        <Route
          path="/chat"
          element={!user ? <Navigate to="/auth" /> : <Navigate to="/chat" />}
        />
        <Route
          path="/update"
          element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
        />
        <Route path="/auth" element={!user ? <AuthPage /> : <ChatPage />} />
      </Routes>
    </Container>
  );
}

export default App;
