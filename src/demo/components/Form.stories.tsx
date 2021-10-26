import React from "react";
import { FormProvidedWithContext, FormProvidedWithNoContext } from "./Form";
import { formData } from "../data";

export default {
  title: "TestForm",
};

export const WithExistingContext = () => (
  <FormProvidedWithContext data={formData} />
);

export const WithNoContext = () => (
  <FormProvidedWithNoContext data={formData} />
);
