import { Container } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";

function App() {
  return (
    <Container maxW="container.lg">
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </Container>
  );
}

export default App;
