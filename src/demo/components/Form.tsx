import React, { useState } from "react";
import { Data } from "../types";
import { dataSchema } from "../schemas";
import { useInputValidator, ValidationProvider } from "../../lib";

export interface Props {
  data: Data;
}

export const Form = (props: Props) => {
  const [data, setData] = useState(props.data);
  const {
    context,
    onChange,
    onBlur,
    InputErrorMessage,
    formErrorCount,
    getClassName,
  } = useInputValidator(dataSchema, data);

  console.debug("formErrorCount", formErrorCount);

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
      </ValidationProvider>
    </>
  );
};
