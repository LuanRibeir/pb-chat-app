import { Container } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import HomePage from "./pages/HomePage";
import LogoutButton from "./components/LogoutButton";

function App() {
  const user = useRecoilValue(userAtom);

  return (
    <Container maxW="container.lg">
      <Routes>
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="/auth" />}
        />
        <Route path="/auth" element={!user ? <AuthPage /> : <HomePage />} />
      </Routes>

      {user && <LogoutButton />}
    </Container>
  );
}

export default App;
