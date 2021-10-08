import * as yup from "yup";
import { SchemaOf } from "yup";
import { Data, NestedData } from "./types";

export const nestedDataSchema: SchemaOf<NestedData> = yup.object().shape({
  aNestedValue: yup.string().required(),
  aDependantValue: yup
    .string()
    .required()
    .when("aNestedValue", (aNestedValue, schema) =>
      schema.equals([`Hello ${aNestedValue}`])
    ),
});

export const dataSchema: SchemaOf<Data> = yup.object().shape({
  aValue: yup.string().required().equals(["value"]),
  nestedValues: yup.array().of(nestedDataSchema).required(),
});
