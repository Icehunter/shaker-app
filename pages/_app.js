import App from 'next/app';
import Head from 'next/head';
import React from 'react';

class MyApp extends App {
  componentDidMount() {
    // remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    // setup scripts marked as external, but allow unmnified builds if not production set
    const ReactScript =
      process.env.NODE_ENV === 'production' ? (
        <script src='https://unpkg.com/react@%5E16/umd/react.production.min.js'></script>
      ) : (
        <script src='https://unpkg.com/react@%5E16/umd/react.development.js'></script>
      );
    const ReactDOMScript =
      process.env.NODE_ENV === 'production' ? (
        <script src='https://unpkg.com/react-dom@%5E16/umd/react-dom.production.min.js'></script>
      ) : (
        <script src='https://unpkg.com/react-dom@%5E16/umd/react-dom.development.js'></script>
      );

    return (
      <React.Fragment>
        <Head>
          {ReactScript}
          {ReactDOMScript}
        </Head>
        <Component {...pageProps} />
      </React.Fragment>
    );
  }
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.

// MyApp.getInitialProps = async (appContext): Promise<AppInitialProps> => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps };
// };

export default MyApp;
