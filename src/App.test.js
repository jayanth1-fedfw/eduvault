import { render, screen } from "@testing-library/react";

import App from "./App";

test("renders EduVault brand", () => {
  render(<App />);
  const brandElement = screen.getByText((_, element) => element?.textContent === "EduVault");
  expect(brandElement).toBeInTheDocument();
});
