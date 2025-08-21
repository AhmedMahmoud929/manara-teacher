import axios from "axios";
import { API_URL } from "@/constants/env";

export const fetchData = async <T>(endpoint: string): Promise<T> => {
  try {
    console.log("Fetching content of:", endpoint);
    const res = await fetch(`${API_URL}${endpoint}`, {
      next: { revalidate: 1000 },
    });
    const data = await res.json();
    return (data as any).data as T;
  } catch (err: unknown) {
    throw err as Error;
  }
};
