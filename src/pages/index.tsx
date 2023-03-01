import { type NextPage } from "next";
import Head from "next/head";

// eslint-disable-next-line @typescript-eslint/no-unused-vars

import ImageComponent from "../components/Image";
// import Background from "@/src/components/Background";
// import Link from "next/link";
// import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "@/src/utils/api";
import TopLeftCard from "../components/TopLeftCard";

const Home: NextPage = () => {
  const { data: imagesData } = api.image.getImages.useQuery();

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white">
      <Head>
        <title>{"Ethan's Photo Gallery"}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid w-full max-w-[1960px] grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3">
        <TopLeftCard />
        {imagesData &&
          imagesData.map((x, i) => <ImageComponent key={i} imageData={x} />)}
      </div>
      <footer>
        <div>footer here</div>
      </footer>
      {/* <Background /> */}
    </div>
  );
};

export default Home;
