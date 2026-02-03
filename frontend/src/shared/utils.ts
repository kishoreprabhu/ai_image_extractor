import { API_BASE_URL, RequestOptions } from "./constant";
import { supabase } from "../lib/supabase";


export const apiRequest = async ({
  method,
  url,
  headers = {},
  body,
}: RequestOptions) => {
  const {data: { session }} = await supabase.auth.getSession();
  const token = session?.access_token || "";   

  const requestUrl = `${API_BASE_URL}${url}`;

  const isFormData = body instanceof FormData;

  const finalHeaders: Record<string, string> = {
    ...headers,
  };

  if (!isFormData && !finalHeaders["Content-Type"]) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers: finalHeaders,
  };

  if (body) {
    fetchOptions.body = isFormData ? body : JSON.stringify(body);
  }

  const response = await fetch(requestUrl, fetchOptions);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
