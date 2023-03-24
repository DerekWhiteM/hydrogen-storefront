import { useLoaderData, Link } from "@remix-run/react";

export const meta = () => {
  return {
    title: "Hydrogen",
    description: "A custom storefront powered by Hydrogen",
  };
};

export async function loader({ context }: any) {
  return await context.storefront.query(COLLECTIONS_QUERY);
}

export default function Index() {
  const { collections } = useLoaderData();
  return (
    <section className="w-full gap-4">
      <Hero />
    </section>
  );
}

function Hero() {
  return (
    <div className="bg-hero-image bg-center w-screen h-[calc(100vh-64px)] lg:h-[calc(100vh-96px)]"></div>
  )
}

const COLLECTIONS_QUERY = `#graphql
  query FeaturedCollections {
    collections(first: 3) {
      nodes {
        id
        title
        handle
        image {
          altText
          width
          height
          url
        }
      }
    }
  }
`;
