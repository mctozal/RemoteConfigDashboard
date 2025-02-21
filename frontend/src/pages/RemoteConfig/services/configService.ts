import { Config } from "../../../interfaces/IConfig";

export const getConfigsApi = async (
  sortBy: string = "name",
  order: "asc" | "desc" = "asc"
): Promise<Config[]> => {
  const response = await fetch(
    `http://localhost:5000/api/configs?sortBy=${sortBy}&order=${order}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!response.ok)
    throw new Error((await response.text()) || "Failed to fetch configs");
  return response.json();
};

export const createConfigApi = async (newConfig: Config): Promise<Config> => {
  const response = await fetch("http://localhost:5000/api/configs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newConfig),
  });
  if (!response.ok)
    throw new Error((await response.text()) || "Failed to create config");
  return response.json();
};

export const updateConfigApi = async (
  updatedConfig: Config
): Promise<Config> => {
  const response = await fetch(
    `http://localhost:5000/api/configs/${updatedConfig._id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedConfig),
    }
  );
  if (!response.ok)
    throw new Error((await response.text()) || "Failed to update config");
  return response.json();
};

export const deleteConfigApi = async (configId: string): Promise<void> => {
  const response = await fetch(
    `http://localhost:5000/api/configs/${configId}`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok)
    throw new Error((await response.text()) || "Failed to delete config");
};
