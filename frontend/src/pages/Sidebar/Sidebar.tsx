import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  VStack,
  Link as ChakraLink,
  Collapse,
  Button,
  useDisclosure,
  Text,
  HStack,
  useMediaQuery,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { NavLink, useNavigate } from "react-router-dom";
import { Briefcase } from "../../assets/icons/sidemenu/IconBriefcase";
import logo from "../../assets/icons/sidemenu/logo-sciplay.png";
import { IconDashboard } from "../../assets/icons/sidemenu/IconDashboard";

const SideBar = () => {
  const [isLargerThan800] = useMediaQuery("(min-width: 800px)");
  const [isOpen, setIsOpen] = useState(isLargerThan800);

  useEffect(() => {
    setIsOpen(isLargerThan800);
  }, [isLargerThan800]);

  const navigate = useNavigate();
  return (
    <Box
      borderRight="1px solid"
      h="100vh"
      borderColor="gray.200"
      bgColor={"blackAlpha.900"}
      as="nav"
      style={{
        transition: "transform 0.7s ease-in-out",
      }}
      pt={4}
      position={"relative"}
    >
      <Flex alignItems="flex-start" justifyContent={"center"} h="100%">
        {isOpen ? (
          <Flex h="100%" direction="column" alignItems="center" pt={20}>
            <VStack
              h="100%"
              spacing={4}
              w={{
                base: "auto",
                md: "16",
                lg: "20",
                xl: "40",
                "3xl": "56",
              }}
              align="start"
            >
              <Box
                position={"absolute"}
                top={7}
                left={"35%"}
                transform="translateX(-35%)"
              >
                <IconButton
                  w={{
                    base: "auto",
                    md: "28",
                    lg: "36",
                    xl: "56",
                  }}
                  _hover={{ bg: "none" }}
                  bg={"none"}
                  onClick={() => navigate("/")}
                  cursor={"pointer"}
                  aria-label={""}
                >
                  <Image src={logo}></Image>
                </IconButton>
              </Box>
              <Box h={2}></Box>

              <SideBarItem icon={<IconDashboard />} text="Dashboard" url="/" />
              <SideBarItem
                icon={<Briefcase />}
                text="Configurations"
                url="/configuration"
              />
            </VStack>
          </Flex>
        ) : (
          <Box></Box>
        )}
      </Flex>
    </Box>
  );
};

export default SideBar;

interface SubItemProps {
  text: string;
  url: string;
}

interface SideBarItemProps {
  text?: string;
  url?: string;
  icon: React.ReactElement;
  subItems?: SubItemProps[];
}
const SideBarItem = ({ text, url, icon, subItems }: SideBarItemProps) => {
  const isDropdown = subItems && subItems.length > 0;

  const { isOpen, onToggle } = useDisclosure();

  return (
    <>
      {isDropdown ? (
        <>
          <Button
            onClick={onToggle}
            variant="ghost"
            w="full"
            fontWeight="normal"
            fontSize={"sm"}
            color="#F1F1F1"
            _hover={{ bg: "#4e4e4e", color: "Primary.700" }}
            px={{
              base: 1,
              md: 2,
              lg: 2,
              xl: 5,
            }}
            py={2}
            justifyContent="space-between"
          >
            <Flex alignItems="center" justify="space-between" w="full">
              <Flex alignItems="center">
                <HStack>
                  <Box>{icon}</Box>
                  <Text fontWeight={"semibold"}>{text}</Text>
                </HStack>
              </Flex>
              <ChevronDownIcon
                boxSize={6}
                transform={isOpen ? "rotate(180deg)" : ""}
              />
            </Flex>
          </Button>
          <Collapse in={isOpen} animateOpacity>
            <VStack spacing={2} align="start" ml={5}>
              {subItems?.map((subItem) => (
                <ChakraLink
                  key={subItem.url}
                  as={NavLink}
                  to={subItem.url}
                  fontWeight="semibold"
                  display="flex"
                  alignItems="center"
                  fontSize={"sm"}
                  color="#F1F1F1"
                  _hover={{
                    color: "#1396ab",
                  }}
                  _activeLink={{
                    color: "Primary.700",
                  }}
                >
                  {subItem.text}
                </ChakraLink>
              ))}
            </VStack>
          </Collapse>
        </>
      ) : (
        <ChakraLink
          w="full"
          as={NavLink}
          fontWeight="normal"
          fontSize={"sm"}
          color={"#F1F1F1"}
          _hover={{
            bg: "#4e4e4e",
            color: "Primary.700",
          }}
          _activeLink={{
            bg: "#4e4e4e",
            color: "Primary.700",
            borderRadius: "8",
            borderRight: "2px solid",
          }}
          to={url}
          px={{
            base: 1,
            md: 2,
            lg: 2,
            xl: 5,
          }}
          pr={{ xl: 1 }}
          py={2}
          borderRadius="8"
          display="flex"
          alignItems="center"
        >
          <HStack
            w={"full"}
            _activeLink={{
              borderRight: {
                base: "none",
                xl: "2px solid",
              },
              borderColor: "Primary.700",
            }}
          >
            <Box>{icon}</Box>
            <Text fontWeight={"semibold"}>{text}</Text>
          </HStack>
        </ChakraLink>
      )}
    </>
  );
};
