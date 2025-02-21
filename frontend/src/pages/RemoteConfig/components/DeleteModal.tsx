import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from "@chakra-ui/react";
import { Config } from "../../../interfaces/IConfig";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: Config;
  onDelete: (configId: string) => void; // Callback from parent
}

const DeleteModal = ({
  isOpen,
  onClose,
  config,
  onDelete,
}: DeleteModalProps) => {
  const handleDelete = () => {
    onDelete(config._id); // Use parent's mutation hook
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Config</ModalHeader>
        <ModalBody>
          <Text>
            Are you sure you want to delete "{config.name}"? This action will
            flag it as deleted.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="ghost" onClick={onClose} ml={2}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteModal;
