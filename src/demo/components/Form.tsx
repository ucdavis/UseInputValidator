import React, { useState } from "react";
import { Data } from "../types";
import { dataSchema } from "../schemas";
import { useInputValidator, ValidationProvider } from "../../lib";
import { NestedForm } from "./NestedForm";

export interface Props {
  data: Data;
}

export const Form = (props: Props) => {
  const [data, setData] = useState(props.data);
  const [nextId, setNextId] = useState(
    Math.max(...props.data.nestedValues.map((v) => v.id)) + 1
  );
  const {
    context,
    onChange,
    onBlur,
    InputErrorMessage,
    formErrorCount,
    getClassName,
    validateAll,
    formIsDirty,
    formIsTouched,
    resetContext,
  } = useInputValidator(dataSchema, data, {
    classNameErrorInput: "is-invalid",
    classNameErrorMessage: "text-danger",
  });

  return (
    <>
      <ValidationProvider context={context}>
        <input
          className={getClassName("aValue")}
          name="aValue"
          value={data.aValue}
          onChange={onChange("aValue", (e) =>
            setData((d) => ({ ...d, aValue: e.target.value }))
          )}
          onBlur={onBlur("aValue")}
        />
        <InputErrorMessage name="aValue" />
        {data.nestedValues.map((n, i) => (
          <div key={`${i}_${n.id}`}>
            <NestedForm
              nestedData={n}
              setNestedData={(nestedData) => {
                const nestedValues = [...data.nestedValues];
                nestedValues.splice(i, 1, nestedData);
                setData({ ...data, nestedValues });
              }}
              onDelete={() => {
                const nestedValues = [...data.nestedValues];
                nestedValues.splice(i, 1);
                setData({ ...data, nestedValues });
              }}
            />
          </div>
        ))}
        <button onClick={validateAll}>Validate All</button>
        <button
          disabled={formErrorCount > 0}
          onClick={async () => {
            const errors = await validateAll();
            if (errors.length > 0) {
              alert("Fix errors first");
            } else {
              alert("Success!");
            }
          }}
        >
          Submit
        </button>
        <button
          disabled={!formIsDirty && !formIsTouched && formErrorCount === 0}
          onClick={resetContext}
        >
          Reset
        </button>
      </ValidationProvider>
    </>
  );
};
