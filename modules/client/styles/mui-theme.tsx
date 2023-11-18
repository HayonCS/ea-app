import createTheme from "@mui/material/styles/createTheme";
import { GentexBlue, FontWeightBold, AppFont } from "client/styles/app-theme";

const baseFontSize = 11;
const htmlFontSize = 16;

/** do not export this */
const pxToRem = (size: number) => {
  const coeff = baseFontSize / 14;
  return `${(size / htmlFontSize) * coeff}rem`;
};

//https://material-ui.com/customization/default-theme/
export const AppTheme = createTheme({
  palette: {
    text: {
      secondary: "white",
    },
    background: {
      default: "rgba(242, 242, 242)",
    },
    primary: {
      main: GentexBlue,
    },
    secondary: {
      main: "#2c2a29", //black
    },
    success: {
      main: "#4caf50", //green
    },
    warning: {
      main: "#f57c00", //orange
    },
    error: {
      main: "#d32f2f", //red
    },
  },

  typography: () => ({
    fontSize: baseFontSize,
    fontFamily: AppFont,

    h1: {
      fontSize: pxToRem(24),
      lineHeight: pxToRem(18),
      fontWeight: FontWeightBold,
      pointerEvents: "none",
    },
    h2: {
      fontSize: pxToRem(20),
      lineHeight: pxToRem(24),
      fontWeight: FontWeightBold,
      pointerEvents: "none",
    },
    body: {
      fontSize: pxToRem(14),
      lineHeight: pxToRem(20),
      fontWeight: "normal",
    },
  }),
});
