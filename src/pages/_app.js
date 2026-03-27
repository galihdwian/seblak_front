import Layout from '@/components/layout';
import PrivateRoute from '@/components/PrivateRoute';
import StoreProvider from '@/lib/store/StoreProvider';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  const nestedLayout = Component.getLayout
  if (nestedLayout) {
    return <StoreProvider>
      <Component {...pageProps} />
    </StoreProvider>
  } else {
    return <StoreProvider>
      <PrivateRoute>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </PrivateRoute>
    </StoreProvider>
  }
}