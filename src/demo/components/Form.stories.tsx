import React from "react";
import { Form } from "./Form";
import { formData } from "../data";

export default {
  title: "TestForm",
};

export const Primary = () => <Form data={formData} />;

export const Secondary = () => <Form data={formData} />;
