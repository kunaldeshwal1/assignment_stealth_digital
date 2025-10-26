import "@testing-library/jest-dom";
import "whatwg-fetch";

// make sure mongoose is always mocked
jest.mock("mongoose");

// also stub out your DB util
jest.mock("@/lib/db", () => ({
  connectDB: jest.fn(() => Promise.resolve()),
}));
