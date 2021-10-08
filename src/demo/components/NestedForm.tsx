import React, { useState } from "react";
import { useInputValidator } from "../../lib";
import { nestedDataSchema } from "../schemas";
import { NestedData } from "../types";

export interface Props {
  nestedData: NestedData;
  setNestedData: (nestedData: NestedData) => void;
  onDelete: () => void;
}

export const NestedForm = ({ nestedData, setNestedData, onDelete }: Props) => {
  const {
    onChange,
    onBlur,
    InputErrorMessage,
    getClassName,
  } = useInputValidator(nestedDataSchema, nestedData);

  return (
    <>
      <div>
        <input
          className={getClassName("aNestedValue")}
          name="aNestedValue"
          value={nestedData.aNestedValue}
          onChange={onChange("aNestedValue", (e) =>
            setNestedData({ ...nestedData, aNestedValue: e.target.value })
          )}
          onBlur={onBlur("aNestedValue")}
        />
        <InputErrorMessage name="aNestedValue" />
      </div>
      <div>
        <input
          className={getClassName("aDependantValue")}
          name="aDependantValue"
          value={nestedData.aDependantValue}
          onChange={onChange("aDependantValue", (e) =>
            setNestedData({ ...nestedData, aDependantValue: e.target.value })
          )}
          onBlur={onBlur("aDependantValue")}
        />
        <InputErrorMessage name="aDependantValue" />
      </div>
      <button onClick={onDelete}>X</button>
    </>
  );
};
