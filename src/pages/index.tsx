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

  useEffect(() => {
    if (imagesData) setDisplayImages(imagesData);
  }, [imagesData]);

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white">
      <Head>
        <title>{"Ethan's Photo Gallery"}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid w-full max-w-[1960px] grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
        <TopLeftCard
          selectedDeleteImages={selectedDeleteImages}
          isDeletingImages={isDeletingImages}
          setIsDeletingImages={setIsDeletingImages}
        />
        {displayImages &&
          displayImages.map((x, i) => (
            <ImageComponent
              key={i}
              imageData={x}
              selectedDeleteImages={selectedDeleteImages}
              setSelectedDeleteImages={setSelectedDeleteImages}
              isDeletingImages={isDeletingImages}
            />
          )).reverse()}
      </div>
      <footer>
        <div>footer here</div>
      </footer>
      {/* <Background /> */}
    </div>
  );
};

export default Home;
