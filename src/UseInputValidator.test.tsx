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

const aValueErrorMessage = "aValue must be one of the following values: value";

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
  render(<div data-testid="msg-id">{inputErrorMessage}</div>);

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
    const { result, rerender } = renderHook(() =>
      useInputValidator(dataSchema, formData, validatorOptions)
    );

    // error message must be rendered in order to enable validation for given field
    renderErrorMessage(<result.current.InputErrorMessage name="aValue" />);

    act(() => {
      result.current.validateAll();
    });

    await waitFor(() => {
      expect(result.current.formErrorCount).toEqual(1);
    });
  });

  it("should only render error message for error", async () => {
    const { result, rerender } = renderHook(() =>
      useInputValidator(dataSchema, formData, validatorOptions)
    );

    const errorMsgRender = renderErrorMessage(
      <result.current.InputErrorMessage name="aValue" />
    );

    expect(errorMsgRender.queryByText(aValueErrorMessage)).toBeNull();

    act(() => {
      result.current.validateAll();
    });

    await waitFor(() => {
      errorMsgRender.rerender(
        <result.current.InputErrorMessage name="aValue" />
      );
      expect(errorMsgRender.getByText(aValueErrorMessage)).toBeInTheDocument();
    });
  });

  it("should have one error after onBlur of invalid field", async () => {
    const { result } = renderHook(() =>
      useInputValidator(dataSchema, formData, validatorOptions)
    );

    // error message must be rendered in order to enable validation for given field
    renderErrorMessage(<result.current.InputErrorMessage name="aValue" />);

    act(() => {
      result.current.onBlur("aValue")({
        target: { value: "val" },
      } as React.FocusEvent<HTMLInputElement>);
    });

    await waitFor(() => {
      expect(result.current.formErrorCount).toEqual(1);
    });
  });

  it("should have one error after onBlurValue of invalid field", async () => {
    const { result } = renderHook(() =>
      useInputValidator(dataSchema, formData, validatorOptions)
    );

    // error message must be rendered in order to enable validation for given field
    renderErrorMessage(<result.current.InputErrorMessage name="aValue" />);

    act(() => {
      result.current.onBlurValue("aValue", "val");
    });

    await waitFor(() => {
      expect(result.current.formErrorCount).toEqual(1);
    });
  });

  it("should have one error after onChange with invalid data", async () => {
    const { result } = renderHook(() =>
      useInputValidator(dataSchema, formData, validatorOptions)
    );

    // error message must be rendered in order to enable validation for given field
    renderErrorMessage(<result.current.InputErrorMessage name="aValue" />);

    act(() => {
      result.current.onChange("aValue")({
        target: { value: "val" },
      } as React.FocusEvent<HTMLInputElement>);
    });

    await waitFor(() => {
      expect(result.current.formErrorCount).toEqual(1);
    });
  });

  it("should have one error after onChangeValue with invalid data", async () => {
    const { result } = renderHook(() =>
      useInputValidator(dataSchema, formData, validatorOptions)
    );

    // error message must be rendered in order to enable validation for given field
    renderErrorMessage(<result.current.InputErrorMessage name="aValue" />);

    act(() => {
      result.current.onChangeValue("aValue")("val");
    });

    await waitFor(() => {
      expect(result.current.formErrorCount).toEqual(1);
    });
  });

  it("should get correct values from getClassName", async () => {
    const { result, rerender } = renderHook(() =>
      useInputValidator(dataSchema, formData, validatorOptions)
    );

    // error message must be rendered in order to enable validation for given field
    renderErrorMessage(<result.current.InputErrorMessage name="aValue" />);

    expect(result.current.getClassName("aValue")).toEqual("");
    expect(
      result.current.getClassName("aValue", "a-passthrough-class")
    ).toEqual("a-passthrough-class");

    act(() => {
      result.current.validateAll();
    });

    await waitFor(() => {
      expect(result.current.getClassName("aValue")).toContain(
        validatorOptions.classNameErrorInput
      );
      expect(
        result.current.getClassName("aValue", "a-passthrough-class")
      ).toContain(validatorOptions.classNameErrorInput);
    });
  });

  it("should have correct touched state before and after blur", async () => {
    const { result } = renderHook(() =>
      useInputValidator(dataSchema, formData, validatorOptions)
    );

    // error message must be rendered in order to enable validation for given field
    renderErrorMessage(<result.current.InputErrorMessage name="aValue" />);

    expect(result.current.fieldIsTouched("aValue")).toBeFalsy();
    expect(result.current.formIsTouched).toBeFalsy();

    act(() => {
      result.current.onBlur("aValue")({
        target: { value: "val" },
      } as React.FocusEvent<HTMLInputElement>);
    });

    await waitFor(() => {
      expect(result.current.fieldIsTouched("aValue")).toBeTruthy();
      expect(result.current.formIsTouched).toBeTruthy();
    });
  });

  it("should have correct dirty state before and after field update", async () => {
    const { result } = renderHook(() =>
      useInputValidator(dataSchema, formData, validatorOptions)
    );

    // error message must be rendered in order to enable validation for given field
    renderErrorMessage(<result.current.InputErrorMessage name="aValue" />);

    expect(result.current.fieldIsDirty("aValue")).toBeFalsy();
    expect(result.current.formIsDirty).toBeFalsy();

    act(() => {
      result.current.onChangeValue("aValue")("val");
    });

    await waitFor(() => {
      expect(result.current.fieldIsDirty("aValue")).toBeTruthy();
      expect(result.current.formIsDirty).toBeTruthy();
    });
  });

  it("should have pristine field state after resetField", async () => {
    const { result, rerender } = renderHook(() =>
      useInputValidator(dataSchema, formData, validatorOptions)
    );

    // error message must be rendered in order to enable validation for given field
    renderErrorMessage(<result.current.InputErrorMessage name="aValue" />);

    act(() => {
      result.current.onChangeValue("aValue")("val");
      result.current.onBlurValue("aValue");
    });

    await waitFor(() => {
      expect(result.current.fieldIsDirty("aValue")).toBeTruthy();
      expect(result.current.fieldIsTouched("aValue")).toBeTruthy();
      expect(result.current.formErrorCount).toEqual(1);
    });

    act(() => {
      result.current.resetField("aValue");
    });

    await waitFor(() => {
      expect(result.current.fieldIsDirty("aValue")).toBeFalsy();
      expect(result.current.fieldIsTouched("aValue")).toBeFalsy();
      expect(result.current.formErrorCount).toEqual(0);
    });
  });

  it("should have pristine local state after resetLocalFields", async () => {
    const { result } = renderHook(() =>
      useInputValidator(dataSchema, formData, validatorOptions)
    );

    // error message must be rendered in order to enable validation for given field
    renderErrorMessage(<result.current.InputErrorMessage name="aValue" />);

    act(() => {
      result.current.onChangeValue("aValue")("val");
      result.current.onBlurValue("aValue");
    });

    await waitFor(() => {
      expect(result.current.fieldIsDirty("aValue")).toBeTruthy();
      expect(result.current.fieldIsTouched("aValue")).toBeTruthy();
      expect(result.current.formErrorCount).toEqual(1);
    });

    act(() => {
      result.current.resetContext();
    });

    await waitFor(() => {
      expect(result.current.fieldIsDirty("aValue")).toBeFalsy();
      expect(result.current.fieldIsTouched("aValue")).toBeFalsy();
      expect(result.current.formErrorCount).toEqual(0);
    });
  });

  it("should have pristine context state after resetContext", async () => {
    const { result } = renderHook(() =>
      useInputValidator(dataSchema, formData, validatorOptions)
    );

    // error message must be rendered in order to enable validation for given field
    renderErrorMessage(<result.current.InputErrorMessage name="aValue" />);

    act(() => {
      result.current.onChangeValue("aValue")("val");
      result.current.onBlurValue("aValue");
    });

    await waitFor(() => {
      expect(result.current.formIsDirty).toBeTruthy();
      expect(result.current.formIsTouched).toBeTruthy();
      expect(result.current.formErrorCount).toEqual(1);
    });

    act(() => {
      result.current.resetContext();
    });

    await waitFor(() => {
      expect(result.current.formIsDirty).toBeFalsy();
      expect(result.current.formIsTouched).toBeFalsy();
      expect(result.current.formErrorCount).toEqual(0);
    });
  });
});
