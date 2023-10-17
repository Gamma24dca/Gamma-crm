import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import Form from "./Form.tsx";

test("demo", () => {
  expect(true).toBe(true);
});

test("Renders the main page", () => {
  render(
    <Form>
      <input />
    </Form>
  );
  expect(true).toBeTruthy();
});
