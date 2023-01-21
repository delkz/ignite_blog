import { AppProps } from "next/app";
import { Box, ChakraProvider } from "@chakra-ui/react";
import "../styles/globals.scss";
import theme from "../styles/theme";
import Header from "../components/Header";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ChakraProvider theme={theme}>
      <Box bg="brand.background" height="100%" minH="100vh">
        <Header />
        <Box maxWidth={1280} p={5} margin="auto">
          <Component {...pageProps} />
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default MyApp;
