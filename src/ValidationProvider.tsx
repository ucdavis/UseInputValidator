import React, {
  useState,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  createContext,
  useRef,
  useCallback,
} from "react";
import { ValidationError } from "yup";
import { useDebounceCallback } from "@react-hook/debounce";
import { useIsMounted } from "./utilities";

export interface ValidationContextState {
  formErrorCount: number;
  formIsTouched: boolean;
  setFormIsTouched: Dispatch<SetStateAction<boolean>>;
  formIsDirty: boolean;
  setFormIsDirty: Dispatch<SetStateAction<boolean>>;
  validatorRefs: MutableRefObject<ValidatorRef>[];
  options: ValidatorOptions;
  updateFormErrorCount: () => void;
}

export interface ValidatorRef {
  reset: () => void;
  validate: () => Promise<ValidationError[]>;
  errors: ValidationError[];
}

export const ValidationContext = createContext<ValidationContextState | null>(
  null
);

export interface ValidatorOptions {
  classNameErrorInput?: string;
  classNameErrorMessage?: string;
  validateDelay?: number;
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
  const validatorRefsRef = useRef<MutableRefObject<ValidatorRef>[]>([]);
  const isMounted = useIsMounted();

  const updateFormErrorCount = useCallback(
    useDebounceCallback(() => {
      // debouncing primarily to push this outside of current loop in case calling hook is about to be unmounted
      // also doesn't hurt to prevent unnecessary updates of formErrorCount
      const errorCount = validatorRefsRef.current
        .filter((ref) => !!ref.current?.errors)
        .flatMap((ref) => ref.current.errors).length;

      isMounted() && setFormErrorCount(errorCount);
    }, 50),
    [setFormErrorCount, isMounted]
  );

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
    formIsTouched,
    setFormIsTouched,
    formIsDirty,
    setFormIsDirty,
    validatorRefs: validatorRefsRef.current,
    options: options || {},
    updateFormErrorCount,
  };

  return newContext;

  function validateOptions(options: ValidatorOptions | null) {
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
