import "regenerator-runtime";
import moment from "moment";
import {
  Box,
  Spacer,
  Menu,
  Heading,
  VStack,
  MenuItem,
  MenuButton,
  Stack,
  Avatar,
  MenuList,
  HStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ChevronDownIcon, GenericAvatarIcon } from "@chakra-ui/icons";
import LogOutIcon from "../../assets/icons/authentication/LogOutIcon";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <>
      <Box w={"full"} as="nav" pt={5} mb={3}>
        <HStack w={"full"}>
          <VStack justify={"start"} alignItems={"start"}>
            <Heading fontWeight={"bold"} fontSize={"2xl"} color={"#1A1A1A"}>
              {"Dashboard Overview"}
            </Heading>

            <Heading fontSize={"md"} color={"#1A1A1A"}>
              {moment().format("Do MMMM, dddd")}
            </Heading>
          </VStack>
          <Spacer />
          <HStack spacing={0} mr={4}>
            <Box pr={5}>
              <Menu>
                <MenuButton>
                  <Stack direction="row" align={"center"} spacing={1}>
                    <Avatar size={"sm"} icon={<GenericAvatarIcon />} />
                    <ChevronDownIcon />
                  </Stack>
                </MenuButton>
                <MenuList borderRadius={10} p={5} shadow={"sm"}>
                  <MenuItem
                    borderRadius={10}
                    h={12}
                    _hover={{ bg: "#7DCE28" }}
                    icon={<LogOutIcon />}
                    onClick={() => handleLogout()}
                  >
                    {" "}
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </HStack>
        </HStack>
      </Box>
    </>
  );
}

export default Navbar;
