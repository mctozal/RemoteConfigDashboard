import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { z } from "zod";
import { Config } from "../../../interfaces/IConfig";

// Zod schema matching backend Config
const configSchema = z.object({
  _id: z.string(), // Required for updates
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  value: z.union([z.string(), z.number(), z.boolean()]),
  type: z.enum(["string", "integer", "float", "boolean"]),
});

type ConfigForm = z.infer<typeof configSchema>;

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: Config;
  onUpdate: (updatedConfig: any) => void; // Callback from parent
}

const EditModal = ({ isOpen, onClose, config, onUpdate }: EditModalProps) => {
  const [form, setForm] = useState<ConfigForm>({
    _id: config._id,
    name: config.name,
    description: config.description || "",
    value: config.value,
    type: config.type,
  });
  const [errors, setErrors] = useState<any>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      const validated = configSchema.parse(form);
      onUpdate(validated); // Use parent's mutation hook
      setErrors({});
      setSubmitError(null);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.format());
      } else {
        setSubmitError((error as Error).message || "Failed to update config");
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Config</ModalHeader>
        <ModalBody>
          <FormControl mb={4} isInvalid={!!errors.name}>
            <FormLabel>Name</FormLabel>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && (
              <Text color="red.500">{errors.name._errors[0]}</Text>
            )}
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Type</FormLabel>
            <Select
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value as
                    | "string"
                    | "integer"
                    | "float"
                    | "boolean",
                })
              }
            >
              <option value="string">String</option>
              <option value="integer">Integer</option>
              <option value="float">Float</option>
              <option value="boolean">Boolean</option>
            </Select>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Value</FormLabel>
            <Input
              value={String(form.value)}
              onChange={(e) => {
                const value =
                  form.type === "integer"
                    ? parseInt(e.target.value) || 0
                    : form.type === "float"
                    ? parseFloat(e.target.value) || 0
                    : form.type === "boolean"
                    ? e.target.value === "true"
                    : e.target.value;
                setForm({ ...form, value });
              }}
            />
          </FormControl>
          {submitError && <Text color="red.500">{submitError}</Text>}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={handleSubmit}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose} ml={2}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditModal;
