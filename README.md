# use-input-validator

![language](https://img.shields.io/badge/language-typescript-blue.svg)
[![Build Status](https://dev.azure.com/ucdavis/UseInputValidator/_apis/build/status/ucdavis.UseInputValidator?branchName=main)](https://dev.azure.com/ucdavis/UseInputValidator/_build/latest?definitionId=27&branchName=main)

> Input validation that stays out of the way

use-input-validator is a hook that, given an object and a yup schema for that object, validates individual fields. It allows complex, deeply-nested object and component hierarchies without getting too crazy with refs, paths, array helpers and all the other rigmarole that some OTHER solutions use.

## Table of Contents

  - [Installation](#installation)
  - [Usage](#usage)
  - [Demo](#demo)
  - [Support](#support)
  - [Contributing](#contributing)
  - [License](#license)

## Installation

```sh
npm install --save use-input-validator
```

## Usage

```tsx
import { useInputValidator, ValidationProvider } from "use-input-validator";
import * as yup from "yup";

export interface Data {
  aValue: string;
  anotherValue: string;
}
export interface Props {
  data: Data;
}
export const dataSchema: yup.SchemaOf<Data> = yup.object().shape({
  aValue: yup.string().required().equals(["Hello"]),
  anotherValue: yup.string().required().equals(["World!"]),
});

export const Form = (props: Props) => {
  const [data, setData] = useState(props.data);
  const {
    context,
    onChange,
    onBlur,
    InputErrorMessage,
    getClassName,
    formErrorCount,
  } = useInputValidator(dataSchema, data, {
    classNameErrorInput: "is-invalid",
    classNameErrorMessage: "text-danger",
  });

  return (
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
      <button onClick={() => console.log()} disabled={formErrorCount !== 0}>
        Submit
      </button>
    </ValidationProvider>
  );
};
```

Things worth mentioning

- You are in charge of your data. This hook maintains a shallow clone of your data only to do reevaluations.
- Validation is tied to `InputErrorMessage`. In the above example, only property `aValue` will be validated.
- Using a `ValidationProvider` is only necessary if there will be nested components that also use this hook.
- A more complete example can be found in [src/demo](./src/demo)

## Demo

If you clone the repo, you can run the demo code under [src/demo](./src/demo)...

```sh
git clone https://github.com/ucdavis/UseInputValidator.git
cd UseInputValidator
npm install
npm run storybook
```

## Support

Please [open an issue](https://github.com/ucdavis/UseInputValidator/issues/new) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/ucdavis/UseInputValidator/compare/).

## License

[MIT](LICENSE) © [UC Davis](https://github.com/ucdavis)
