import React from "react";
import { render } from "@testing-library/react";

import { Form } from "./Form";
import { Props } from "./Form";
import { formData } from "../data";

describe("Test Component", () => {
  let props: Props;

  beforeEach(() => {
    props = {
      data: formData,
    };
  });

  const renderComponent = () => render(<Form {...props} />);

  it("should blah blah", () => {
    const { getByTestId } = renderComponent();
  });
});
