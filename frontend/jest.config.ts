export default {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    ".module.css$": "jest-css-modules",
  },
};

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

window.document.body.innerHTML = "<div id='root'></div>";

jest.mock("./src/config.ts", () => ({
  isDev: true,
  isProd: false,
  baseURL: "",
  mode: "development",
  ssr: false,
}));
