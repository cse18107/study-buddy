export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const getApiUrl = (endpoint: string) => {
  const baseUrl = API_BASE_URL.replace(/\/$/, "");
  const path = endpoint.replace(/^\//, "");
  return `${baseUrl}/${path}`;
};
