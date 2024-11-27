import { render } from "react-dom";

it("renders the title", () => {
  const root = document.createElement("div");
  document.body.appendChild(root);
  render(<div id="root" />, root);
  expect(document.title).toBe("yo");
});
