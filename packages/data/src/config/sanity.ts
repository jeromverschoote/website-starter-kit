import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET_ID,
  apiVersion: "2025-10-25",
  useCdn: false,
});
