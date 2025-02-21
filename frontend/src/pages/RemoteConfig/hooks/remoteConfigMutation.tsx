import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createConfigApi,
  updateConfigApi,
  deleteConfigApi,
  getConfigsApi,
} from "../services/configService";
import { Config } from "../../../interfaces/IConfig";
import { useQuery } from "@tanstack/react-query";

export const useGetConfigs = (
  sortBy: string = "name",
  order: "asc" | "desc" = "asc"
) => {
  return useQuery<Config[], Error>({
    queryKey: ["configs"],
    queryFn: () => getConfigsApi(sortBy, order),
  });
};
// Create config mutation
export const useCreateConfig = () => {
  const queryClient = useQueryClient();
  return useMutation<Config, Error, Config>({
    mutationFn: (newConfig) => createConfigApi(newConfig),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configs"] });
    },
    onError: (error) => {
      console.error("Failed to create config:", error.message);
    },
  });
};

export const useUpdateConfig = () => {
  const queryClient = useQueryClient();
  return useMutation<Config, Error, Config>({
    mutationFn: (updatedConfig) => {
      if (!updatedConfig._id)
        throw new Error("Config ID is required for update");
      return updateConfigApi(updatedConfig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configs"] });
    },
    onError: (error) => {
      console.error("Failed to update config:", error.message);
    },
  });
};

// Delete config mutation
export const useDeleteConfig = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (configId) => deleteConfigApi(configId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configs"] });
    },
    onError: (error) => {
      console.error("Failed to delete config:", error.message);
    },
  });
};
