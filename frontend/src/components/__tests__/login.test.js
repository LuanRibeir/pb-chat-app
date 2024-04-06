import { RecoilRoot } from "recoil";
import LoginCard from "../LoginCard";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock localStorage before each test
beforeEach(() => {
  const user = {
    _id: "6605d6568a19dba434cd33db",
    name: "joao",
    email: "joao@gmail.com",
    about: "",
    profilePicture:
      "https://res.cloudinary.com/dqwpchtjh/image/upload/v1711659548/k0gl6gtdfza0oa3w5h1s.jpg",
  };
  localStorage.setItem("user-info", JSON.stringify(user));
});

// Mock useShowToast hook
jest.mock("../../hooks/useShowToast", () => () => jest.fn());

describe("LoginCard component", () => {
  test("renders login form", async () => {
    const { getByText, getByLabelText } = render(
      <RecoilRoot>
        <LoginCard />
      </RecoilRoot>
    );

    // Check login form elements render
    expect(getByText("Email")).toBeInTheDocument();
    expect(getByText("Senha")).toBeInTheDocument();
  });

  test("handles login attempt", async () => {
    const mockUser = {
      _id: "123456",
      name: "John Doe",
      email: "john.doe@gmail.com",
    };

    // Mock fetch API to return a user object
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockUser),
    });
  });
});
