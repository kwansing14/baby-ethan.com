import Head from "next/head";
import { useState, useEffect } from "react";
import { type InferGetServerSidePropsType } from "next";

import ImageComponent from "../components/Image";
// import Background from "@/src/components/Background";
// import Link from "next/link";
// import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "@/src/utils/api";
import TopLeftCard from "../components/TopLeftCard";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "@/src/server/api/root";
import { createInnerTRPCContext } from "@/src/server/api/trpc";
import superjson from "superjson";
// import PwaHeader from "@/src/components/PwaHeader";

export const getServerSideProps = async ({}) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session: null }),
    transformer: superjson,
  });
  const images = await ssg.image.getImages.fetch();
  return {
    props: {
      trpcState: ssg.dehydrate(),
      images,
    },
  };
};

const Home = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { images } = props;
  const [displayImages, setDisplayImages] = useState(images);
  const { data: imagesData } = api.image.getImages.useQuery();
  const [isDeletingImages, setIsDeletingImages] = useState(false);
  const [selectedDeleteImages, setSelectedDeleteImages] = useState<string[]>(
    []
  );
  const [gridLayout, setGridLayout] = useState("grid-cols-1");

  useEffect(() => {
    if (imagesData) setDisplayImages(imagesData);
  }, [imagesData]);

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white">
      <Head>
        <title>{"Ethan's Photo Gallery"}</title>
        <meta name="description" content="Ethan Baby" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        {/* <link rel="manifest" href="/manifest.json" /> */}
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        {/* <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        /> */}
        {/* <PwaHeader /> */}
      </Head>
      <div
        className={
          "grid w-full max-w-[1960px] gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 " +
          `${gridLayout}`
        }
      >
        <TopLeftCard
          selectedDeleteImages={selectedDeleteImages}
          isDeletingImages={isDeletingImages}
          setIsDeletingImages={setIsDeletingImages}
          gridLayout={gridLayout}
          setGridLayout={setGridLayout}
        />
        {!!displayImages &&
          displayImages.map((x, i) => (
            <ImageComponent
              key={i}
              imageData={x}
              selectedDeleteImages={selectedDeleteImages}
              setSelectedDeleteImages={setSelectedDeleteImages}
              isDeletingImages={isDeletingImages}
            />
          ))}
      </div>
    </div>
  );
};

export default Home;
