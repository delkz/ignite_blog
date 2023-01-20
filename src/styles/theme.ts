import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  initialColorMode: `dark`,
  useSystemColorMode: false,
  colors: {
    brand: {
      highlight: "#FF57B2",
      heading: "#F8F8F8",
      background: "#1A1D23",
      info: "#BBBBBB",
      body: "#D7D7D7",
    },
  },
});

export default theme;
