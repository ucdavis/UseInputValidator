import React from "react";
import { render } from "react-dom";
import { Form } from "./components/Form";
import { formData } from "./data";

const App = () => (
  <div style={{ width: 640, margin: "15px auto" }}>
    <h1>Hello React</h1>
    <Form data={formData} />
  </div>
);

render(<App />, document.getElementById("root"));
