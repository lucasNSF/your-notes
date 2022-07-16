const html = document.querySelector("html");

const getStyle = (element, style) =>
  window.getComputedStyle(element).getPropertyValue(style);

export const transformKey = (key) => "--" + key;

const changeColors = (colorScheme) => {
  Object.keys(colorScheme).map((key) => {
    html.style.setProperty(transformKey(key), colorScheme[key]);
  });
};

const initialColors = {
  bg: getStyle(html, "--bg"),
  bgContent: getStyle(html, "--bgContent"),
  borderColor: getStyle(html, "--borderColor"),
  buttonBg: getStyle(html, "--buttonBg"),
  buttonTextColor: getStyle(html, "--buttonTextColor"),
  textColor: getStyle(html, "--textColor"),

  // Note colors
  green: getStyle(html, "--green"),
  blue: getStyle(html, "--blue"),
  yellow: getStyle(html, "--yellow"),
  red: getStyle(html, "--red"),
  purple: getStyle(html, "--purple"),
};

const darkTheme = {
  bg: "#1c1e1f",
  bgContent: "#181a1b",
  borderColor: "#3a3f41",
  buttonBg: "white",
  buttonTextColor: "black",
  textColor: "white",

  // Note colors
  green: "#427753",
  blue: "#32676e",
  yellow: "#797c35",
  red: "#7c5535",
  purple: "#6b3d7c",
};

document
  .querySelector('input[name="theme"]')
  .addEventListener("change", ({ target }) => {
    target.checked ? changeColors(darkTheme) : changeColors(initialColors);
  });
