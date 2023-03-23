import {
  type LinksFunction,
  type MetaFunction,
  type LoaderArgs,
} from '@shopify/remix-oxygen';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import type {Shop} from '@shopify/hydrogen/storefront-api-types';
import tailwind from './styles/tailwind-build.css';
import favicon from '../public/favicon.svg';
import {Layout} from './components/Layout';
import {Seo} from '@shopify/hydrogen';
import {ShopifyProvider} from '@shopify/hydrogen-react';
import {defer} from '@shopify/remix-oxygen';
import {CART_QUERY} from '~/queries/cart';

const shopifyConfig: any = {
  storefrontToken: '3b580e70970c4528da70c98e097c2fa0',
  storeDomain: 'https://hydrogen-preview.myshopify.com',
  storefrontApiVersion: '2023-01',
  countryIsoCode: 'US',
  languageIsoCode: 'en',
};

export const links: LinksFunction = () => {
  return [
    {rel: 'stylesheet', href: tailwind},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
};

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  viewport: 'width=device-width,initial-scale=1',
});

export async function loader({context, request}: any) {
  const cartId = await context.session.get('cartId');
  return defer({
    cart: cartId ? getCart(context, cartId) : undefined,
    layout: await context.storefront.query(LAYOUT_QUERY),
  });
}

async function getCart({storefront}: any, cartId: any) {
  if (!storefront) {
    throw new Error('missing storefront client in cart query');
  }

  const {cart} = await storefront.query(CART_QUERY, {
    variables: {
      cartId,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    cache: storefront.CacheNone(),
  });

  return cart;
}


export default function App() {
  const data = useLoaderData();
  const {name, description} = data.layout.shop;

  return (
    <ShopifyProvider {...shopifyConfig}>
      <html lang="en">
        <head>
          <Seo />
          <Meta />
          <Links />
        </head>
        <body>
          <Layout title={name}>
            <Outlet />
          </Layout>
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </ShopifyProvider>
  );
}


const LAYOUT_QUERY = `#graphql
  query layout {
    shop {
      name
      description
    }
  }
`;
