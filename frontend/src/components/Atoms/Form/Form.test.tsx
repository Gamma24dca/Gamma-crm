import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import Form from "./Form.tsx";

it("Renders to the page ", () => {
  const { getByTestId } = render(
    <Form>
      <input />
    </Form>
  );

  const form = getByTestId("form");
  expect(form).toBeVisible();
});

it("Accept children input", () => {
  const { getByTestId } = render(
    <Form>
      <input />
    </Form>
  );

  const form = getByTestId("form");
  expect(form).toContainHTML("input");
});
