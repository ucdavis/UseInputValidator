import { Data, NestedData } from "./types";

export const formData: Data = {
  aValue: "valu",
  nestedValues: [
    {
      aNestedValue: "nested value 1",
      aDependantValue: "Hello nested value 1",
    },
    {
      aNestedValue: "nested value 2",
      aDependantValue: "Hello nested value 2",
    },
  ],
};
