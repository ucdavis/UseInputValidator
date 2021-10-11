import React, {
  useState,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  createContext,
  useRef,
} from "react";
import { ValidationError } from "yup";

export interface ValidationContextState {
  formErrorCount: number;
  setFormErrorCount: Dispatch<SetStateAction<number>>;
  formIsTouched: boolean;
  setFormIsTouched: Dispatch<SetStateAction<boolean>>;
  formIsDirty: boolean;
  setFormIsDirty: Dispatch<SetStateAction<boolean>>;
  callbacks: MutableRefObject<ValidatorCallbacks>[];
  options: ValidatorOptions;
}

export interface ValidatorCallbacks {
  reset: () => void;
  validate: () => Promise<ValidationError[]>;
}

export const ValidationContext = createContext<ValidationContextState | null>(
  null
);

export interface ValidatorOptions {
  classNameErrorInput?: string;
  classNameErrorMessage?: string;
}

export const useOrCreateValidationContext = (
  options: ValidatorOptions | null,
  context?: ValidationContextState | null
) => {
  const [formErrorCount, setFormErrorCount] = useState(0);
  const [formIsTouched, setFormIsTouched] = useState(false);
  const [formIsDirty, setFormIsDirty] = useState(false);

  // a ref of array of refs
  // this is the only way to ensure the array does not get replaced on rerenders
  const callbacksRef = useRef<MutableRefObject<ValidatorCallbacks>[]>([]);

  if (context) {
    if (options) {
      validateOptions(options);
      context.options = options;
    }

    // wishing this early return could be earlier, but RULES of HOOKS
    return context;
  }

  validateOptions(options);

  const newContext: ValidationContextState = {
    formErrorCount,
    setFormErrorCount,
    formIsTouched,
    setFormIsTouched,
    formIsDirty,
    setFormIsDirty,
    callbacks: callbacksRef.current,
    options: options || {},
  };

  return newContext;

  function validateOptions(options: ValidatorOptions) {
    if (!options?.classNameErrorInput || !options?.classNameErrorMessage) {
      console.warn(
        "classNameErrorInput and classNameErrorMessage are needed for top-level calls to useInputValidator()"
      );
    }
  }
};

export interface ValidationProviderProps {
  context?: ValidationContextState;
}

export const ValidationProvider: React.FC<ValidationProviderProps> = (
  props
) => {
  const context = useOrCreateValidationContext(null, props.context);

  return (
    <ValidationContext.Provider value={context}>
      {props.children}
    </ValidationContext.Provider>
  );
};
