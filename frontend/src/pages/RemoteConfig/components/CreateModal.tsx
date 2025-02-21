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
} from "@chakra-ui/react";
import { useState } from "react";
import { z } from "zod";

const configSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  value: z.union([z.string(), z.number(), z.boolean()]),
  type: z.enum(["string", "integer", "float", "boolean"]),
  filters: z.object({
    version: z.object({ value: z.string(), operation: z.string() }).optional(),
    buildNumber: z
      .object({ value: z.number(), operation: z.string() })
      .optional(),
    platform: z.enum(["All", "ios", "Android"]),
    country: z
      .object({
        operation: z.enum(["Include", "Exclude"]),
        values: z.array(z.string()),
      })
      .optional(),
  }),
});

type ConfigForm = z.infer<typeof configSchema>;

const CreateModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [form, setForm] = useState<ConfigForm>({
    name: "",
    description: "",
    value: "",
    type: "string",
    filters: { platform: "All" },
  });
  const [errors, setErrors] = useState<any>({});

  const handleSubmit = async () => {
    try {
      const validated = configSchema.parse(form);
      const res = await fetch("http://localhost:5000/api/configs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": "true",
        },
        body: JSON.stringify(validated),
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error(
          `Fetch failed with status ${res.status}: ${
            errorText || "No response body"
          }`
        );
        throw new Error(errorText || `Status ${res.status}`);
      }
      onClose();
      setForm({
        name: "",
        description: "",
        value: "",
        type: "string",
        filters: { platform: "All" },
      });
    } catch (error) {
      if (error instanceof z.ZodError) setErrors(error.format());
      else console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Config</ModalHeader>
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Name</FormLabel>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <span>{errors.name._errors[0]}</span>}
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
                setForm({ ...form, type: e.target.value as any })
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
              value={form.value.toString()}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Platform</FormLabel>
            <Select
              value={form.filters.platform}
              onChange={(e) =>
                setForm({
                  ...form,
                  filters: { ...form.filters, platform: e.target.value as any },
                })
              }
            >
              <option value="All">All</option>
              <option value="ios">iOS</option>
              <option value="Android">Android</option>
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={handleSubmit}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateModal;
