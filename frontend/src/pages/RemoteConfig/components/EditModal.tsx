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

const versionRegex = /^\d+\.\d+\.\d+$/;
// Zod schema matching backend Config
const configSchema = z.object({
  _id: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  version: z
    .string()
    .regex(versionRegex, "Version must be in format X.Y.Z (e.g., 1.2.3)")
    .optional()
    .refine((val) => {
      if (!val) return true;
      const parts = val.split(".").map(Number);
      return parts.length === 3 && parts.every((n) => !isNaN(n) && n >= 0);
    }, "Invalid version number"),
  buildNumber: z
    .number()
    .transform((val) => (val ? val : undefined))
    .refine(
      (val) => val === undefined || (Number.isInteger(val) && val >= 0),
      "Build number must be a positive integer"
    )
    .optional(),
  platform: z.string().optional(),
  country: z.string().optional(),
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
    _id: config._id ?? "",
    name: config.name,
    description: config.description || "",
    value: config.value,
    type: config.type,
    version: config.version || "",
    buildNumber: parseInt(config.buildNumber) || 0,
    platform: config.platform || "",
    country: config.country || "",
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
            <FormLabel>Version</FormLabel>
            <Textarea
              value={form.version}
              onChange={(e) => setForm({ ...form, version: e.target.value })}
            />
            {errors.version && (
              <Text color="red.500">{errors.version._errors[0]}</Text>
            )}
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Build Number</FormLabel>
            <Input
              type="number"
              value={form.buildNumber ?? ""} // Use nullish coalescing to handle undefined
              onChange={(e) => {
                const value = e.target.value;
                setForm({
                  ...form,
                  buildNumber: value ? Number(value) : undefined,
                });
              }}
              placeholder="Enter build number (e.g., 100)"
            />
            {errors.buildNumber && (
              <Text color="red.500">{errors.buildNumber._errors[0]}</Text>
            )}
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Platform</FormLabel>
            <Select
              value={form.platform || "All"}
              onChange={(e) =>
                setForm({
                  ...form,
                  platform: e.target.value,
                })
              }
            >
              <option value="All">All</option>
              <option value="iOS">iOS</option>
              <option value="Android">Android</option>
            </Select>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Country</FormLabel>
            <Textarea
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
            {errors.country && (
              <Text color="red.500">{errors.country._errors[0]}</Text>
            )}
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
