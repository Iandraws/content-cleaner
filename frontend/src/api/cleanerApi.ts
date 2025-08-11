import axiosClient from "./axiosClient";
import { z } from "zod";

const cleanResp = z.object({ clean: z.string() });

export async function cleanText(text: string) {
  const { data } = await axiosClient.post("/clean", { text });
  return cleanResp.parse(data);
}
