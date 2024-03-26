import { Button, Container, Flex, Image, useColorMode } from "@chakra-ui/react";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { FiLogOut, FiSettings } from "react-icons/fi";
import useLogout from "../hooks/useLogout";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();

  return (
    <Container mt={6} mb={12}>
      {!user && (
        <Flex justifyContent={"center"}>
          <Image
            cursor={"pointer"}
            alt="logo"
            w={12}
            src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
            onClick={toggleColorMode}
          />
        </Flex>
      )}

      {user && (
        <Flex justifyContent={"space-between"} gap={4}>
          <Image
            cursor={"pointer"}
            alt="logo"
            w={12}
            src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
            onClick={toggleColorMode}
          />

          <Flex gap={30}>
            <Button size={"sm"} as={RouterLink} to={"/update"}>
              <FiSettings size={20} />
            </Button>
            <Button size={"sm"} onClick={logout}>
              <FiLogOut size={20} />
            </Button>
          </Flex>
        </Flex>
      )}
    </Container>
  );
};

export default Header;
