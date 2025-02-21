import { Grid, GridItem, VStack, Box } from "@chakra-ui/react";
import { useSidebarStore } from "./store/SidebarStore";
import { Outlet } from "react-router-dom";
import Sidebar from "./pages/Sidebar/Sidebar.tsx";
import Navbar from "./pages/Navbar/Navbar.tsx";

function App() {
  const { isSidebarCollapsed } = useSidebarStore();

  return (
    <>
      <Grid
        bgColor={"#FEFEFE"}
        h="100vh"
        templateColumns={{
          base: "5% 95%",
          md: `${isSidebarCollapsed ? "5% 95%" : "15% 85%"}`,
        }}
        gap={5}
      >
        <GridItem h="100vh" bgColor={"red"}>
          <Sidebar />
        </GridItem>
        <GridItem h="100vh">
          <VStack w={"full"} h="100vh">
            <Navbar />
            <Box w={"full"} overflowX="hidden">
              <Outlet />
            </Box>
          </VStack>
        </GridItem>
      </Grid>
    </>
  );
}

export default App;
