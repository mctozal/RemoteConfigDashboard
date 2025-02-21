import {
  Box,
  Heading,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useStore from "../../../store/ConfigStore";
import CreateModal from "./CreateModal";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import { Config } from "../../../interfaces/IConfig";

function ConfigurationMain() {
  const {
    configs,
    setConfigs,
    addConfig,
    updateConfig,
    removeConfig,
    sortBy,
    sortOrder,
    setSort,
  } = useStore();
  const createModal = useDisclosure();
  const [editConfig, setEditConfig] = useState<Config | null>(null);
  const [deleteConfig, setDeleteConfig] = useState<Config | null>(null);
  const editModal = useDisclosure();
  const deleteModal = useDisclosure();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");
    ws.onopen = () => console.log("WebSocket connected");
    ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      if (type === "create") addConfig(data);
      if (type === "update") updateConfig(data);
      if (type === "delete") removeConfig(data._id);
    };
    ws.onclose = () => console.log("WebSocket disconnected");

    fetch(
      `http://localhost:5000/api/configs?sortBy=${sortBy}&order=${sortOrder}`
    )
      .then((res) => res.json())
      .then((res) => {
        if (!res.ok) {
          return res.text().then((errorText: any) => {
            throw new Error(
              errorText.includes("overlap")
                ? "Config overlaps with an existing active config"
                : errorText
            );
          });
        }
        return res.json();
      })
      .then((data) => setConfigs(data));

    return () => ws.close();
  }, [setConfigs, addConfig, updateConfig, removeConfig, sortBy, sortOrder]);

  const handleSort = (field: string) => {
    const newOrder = sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    setSort(field, newOrder);
  };

  const handleDuplicate = (config: Config) => {
    const newConfig = {
      ...config,
      name: `${config.name}_copy`,
      _id: undefined,
    };
    fetch("http://localhost:5000/api/configs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newConfig),
    });
  };

  const handleDownload = (config: Config) => {
    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${config.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Flex>
      <Box p={4}>
        <Heading mb={4}>Remote Config Dashboard</Heading>
        <Button colorScheme="teal" onClick={createModal.onOpen} mb={4}>
          Add Config
        </Button>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th onClick={() => handleSort("name")} cursor="pointer">
                Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
              </Th>
              <Th onClick={() => handleSort("description")} cursor="pointer">
                Description{" "}
                {sortBy === "description" && (sortOrder === "asc" ? "↑" : "↓")}
              </Th>
              <Th>Value</Th>
              <Th onClick={() => handleSort("type")} cursor="pointer">
                Type {sortBy === "type" && (sortOrder === "asc" ? "↑" : "↓")}
              </Th>
              <Th>Filters</Th>
              <Th onClick={() => handleSort("updatedAt")} cursor="pointer">
                Last Updated{" "}
                {sortBy === "updatedAt" && (sortOrder === "asc" ? "↑" : "↓")}
              </Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {configs.map((config) => (
              <Tr key={config._id}>
                <Td>{config.name}</Td>
                <Td>{config.description}</Td>
                <Td>{config.value.toString()}</Td>
                <Td>{config.type}</Td>
                <Td>{JSON.stringify(config.filters)}</Td>
                <Td>{new Date(config.updatedAt).toLocaleString()}</Td>
                <Td>
                  <Button
                    size="sm"
                    mr={2}
                    onClick={() => {
                      setEditConfig(config);
                      editModal.onOpen();
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    mr={2}
                    onClick={() => handleDuplicate(config)}
                  >
                    Duplicate
                  </Button>
                  <Button
                    size="sm"
                    mr={2}
                    onClick={() => handleDownload(config)}
                  >
                    Download
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => {
                      setDeleteConfig(config);
                      deleteModal.onOpen();
                    }}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <CreateModal isOpen={createModal.isOpen} onClose={createModal.onClose} />
      {editConfig && (
        <EditModal
          isOpen={editModal.isOpen}
          onClose={editModal.onClose}
          config={editConfig}
        />
      )}
      {deleteConfig && (
        <DeleteModal
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.onClose}
          config={deleteConfig}
        />
      )}
    </Flex>
  );
}

export default ConfigurationMain;
