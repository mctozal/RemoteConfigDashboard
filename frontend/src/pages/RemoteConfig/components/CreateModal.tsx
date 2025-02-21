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

// Zod schema matching backend Config
const configSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  value: z.union([z.string(), z.number(), z.boolean()]),
  type: z.enum(["string", "integer", "float", "boolean"]),
});

type ConfigForm = z.infer<typeof configSchema>;

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newConfig: any) => void; // Callback from parent
}

const CreateModal = ({ isOpen, onClose, onCreate }: CreateModalProps) => {
  const [form, setForm] = useState<ConfigForm>({
    name: "",
    description: "",
    value: "",
    type: "string",
  });
  const [errors, setErrors] = useState<any>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      const validated = configSchema.parse(form);
      onCreate(validated); // Use parent's mutation hook
      setForm({
        name: "",
        description: "",
        value: "",
        type: "string",
      });
      setErrors({});
      setSubmitError(null);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.format());
      } else {
        setSubmitError((error as Error).message || "Failed to create config");
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Config</ModalHeader>
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

export default CreateModal;
