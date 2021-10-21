import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { render, waitFor } from "@testing-library/react";
import * as yup from "yup";
import { useInputValidator } from "./UseInputValidator";
import { ValidatorOptions } from "./ValidationProvider";

interface Data {
  aValue: string;
  nestedValues: NestedData[];
}

interface NestedData {
  id: number;
  aNestedValue: string;
  aDependantValue: string;
}

const nestedDataSchema: yup.SchemaOf<NestedData> = yup.object().shape({
  id: yup.number().required(),
  aNestedValue: yup.string().required(),
  aDependantValue: yup
    .string()
    .required()
    .when("aNestedValue", (aNestedValue, schema) =>
      schema.equals([`Hello ${aNestedValue}`])
    ),
});

const dataSchema: yup.SchemaOf<Data> = yup.object().shape({
  aValue: yup.string().required().equals(["value"]),
  nestedValues: yup.array().of(nestedDataSchema).required(),
});

let formData: Data;
let validatorOptions: ValidatorOptions;

beforeEach(() => {
  formData = {
    aValue: "valu",
    nestedValues: [
      {
        id: 0,
        aNestedValue: "nested value 1",
        aDependantValue: "Hello nested value 1",
      },
      {
        id: 1,
        aNestedValue: "nested value 2",
        aDependantValue: "Hello nested value 2",
      },
    ],
  };

  validatorOptions = {
    classNameErrorInput: "is-invalid",
    classNameErrorMessage: "text-danger",
    validateDelay: 1,
  };
});

afterEach(() => {
  formData = (undefined as unknown) as Data;
  validatorOptions = (undefined as unknown) as ValidatorOptions;
});

const renderErrorMessage = (inputErrorMessage: JSX.Element) =>
  render(
    inputErrorMessage && <div data-testid="msg-id">{inputErrorMessage}</div>
  );

describe("useInputValidator", () => {
  it("should have no errors if untouched", () => {
    const { result } = renderHook(() =>
      useInputValidator(dataSchema, formData, validatorOptions)
    );

    const aValue_render = renderErrorMessage(
      <result.current.InputErrorMessage name="aValue" />
    );

    expect(aValue_render.queryByTestId("msg-id")).toContainHTML("");
    expect(result.current.formErrorCount).toBe(0);
  });

  it("should have one error for one invalid field", async () => {
    const { result } = renderHook(() =>
      useInputValidator(dataSchema, formData, validatorOptions)
    );

    const aValue_render = renderErrorMessage(
      <result.current.InputErrorMessage name="aValue" />
    );

    act(() => {
      result.current.validateAll();
    });

    await waitFor(() => {
      expect(aValue_render.getByTestId("msg-id")).toBeInTheDocument();
      expect(result.current.formErrorCount).toEqual(1);
    });
  });
});
