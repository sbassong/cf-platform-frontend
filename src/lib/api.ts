import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL,
  withCredentials: true,
});

/**
 * A generic fetcher function for SWR.
 * It takes a URL, makes a request using our configured axios instance,
 * and returns the data.
 * @param url The API endpoint to fetch.
 */
export const fetcher = (url: string) => api.get(url).then((res) => res.data);
