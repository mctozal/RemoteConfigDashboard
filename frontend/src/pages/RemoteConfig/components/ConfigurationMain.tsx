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
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  useGetConfigs,
  useCreateConfig,
  useUpdateConfig,
  useDeleteConfig,
} from "../hooks/remoteConfigMutation";
// Adjust path to your hooks file
import CreateModal from "./CreateModal";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import { Config } from "../../../interfaces/IConfig";

function ConfigurationMain() {
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { data: configs, isLoading, error } = useGetConfigs(sortBy, sortOrder);
  const { mutate: createConfig } = useCreateConfig();
  const { mutate: updateConfig } = useUpdateConfig();
  const { mutate: deleteConfig } = useDeleteConfig();

  const createModal = useDisclosure();
  const [editConfig, setEditConfig] = useState<Config | null>(null);
  const [deletedConfig, setDeleteConfig] = useState<Config | null>(null);
  const editModal = useDisclosure();
  const deleteModal = useDisclosure();

  const handleSort = (field: string) => {
    const newOrder = sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(field);
    setSortOrder(newOrder);
  };

  const handleDuplicate = (config: Config) => {
    const newConfig = {
      ...config,
      name: `${config.name}_copy`,
      id: undefined,
    };
    createConfig(newConfig);
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

  const handleCreate = (newConfig: Config) => {
    createConfig(newConfig, {
      onSuccess: () => createModal.onClose(),
    });
  };

  const handleUpdate = (updatedConfig: Config) => {
    updateConfig(updatedConfig, {
      onSuccess: () => editModal.onClose(),
    });
  };

  const handleDelete = (configId: string) => {
    deleteConfig(configId, {
      onSuccess: () => deleteModal.onClose(),
    });
  };

  if (isLoading) return <Spinner />;
  if (error) return <Box color="red.500">Error: {error.message}</Box>;

  return (
    <Flex>
      <Box p={4} width="100%">
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
              <Th onClick={() => handleSort("updatedAt")} cursor="pointer">
                Last Updated{" "}
                {sortBy === "updatedAt" && (sortOrder === "asc" ? "↑" : "↓")}
              </Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {configs?.map((config: any) => (
              <Tr key={config._id}>
                <Td>{config.name}</Td>
                <Td>{config.description}</Td>
                <Td>{String(config.value)}</Td>
                <Td>{config.type}</Td>
                <Td>
                  {config.updatedAt
                    ? new Date(config.updatedAt).toLocaleString()
                    : "N/A"}
                </Td>
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
                      deleteModal.onClose();
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
      <CreateModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        onCreate={handleCreate}
      />
      {editConfig && (
        <EditModal
          isOpen={editModal.isOpen}
          onClose={editModal.onClose}
          config={editConfig}
          onUpdate={handleUpdate}
        />
      )}
      {deletedConfig && (
        <DeleteModal
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.onClose}
          onDelete={() => handleDelete(deletedConfig._id)}
          config={deletedConfig}
        />
      )}
    </Flex>
  );
}

export default ConfigurationMain;
