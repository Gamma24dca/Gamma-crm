import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import Input from "./Input";

describe("Input component", () => {
  it("should render input", () => {
    const { getByTestId } = render(
      <Input id={"input"} type={"text"} name={"Dawid"} />
    );

    const input = getByTestId("input");
    expect(input).toBeVisible();
  });

  it("should focus on click", () => {
    const { getByTestId } = render(
      <Input id={"input"} type={"text"} name={"Dawid"} />
    );

    const input = getByTestId("input");
    userEvent.click(input);
    expect(input).toHaveFocus();
  });

  it("should focus on tab", () => {
    const { getByTestId } = render(
      <Input id={"input"} type={"text"} name={"Dawid"} />
    );
    const input = getByTestId("input");
    console.log(document.body.innerHTML);
    userEvent.tab();
    console.log(document.body.innerHTML);
    expect(input).toHaveFocus();
  });
});
