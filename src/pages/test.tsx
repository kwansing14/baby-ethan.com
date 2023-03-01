import { useState, useEffect } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { isImage, isVideo, validateSize } from "@/src/utils/fileValidation";
import { api } from "@/src/utils/api";
import LoginButton from "@/src/components/loginButton";
import Background from "@/src/components/Background";
// import Link from "next/link";
// import { signIn, signOut, useSession } from "next-auth/react";
import ImageComponent from "../components/Image";

const Home: NextPage = () => {
  const [image, setImage] = useState<File>();
  const [imgSrc, setImgSrc] = useState("");
  const { data: imagesData } = api.image.getImages.useQuery();
  const generateImg = api.image.uploadImg.useMutation();

  console.log(imagesData);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const img = e.target.files[0];

    console.log("img--", img);
    // if no image selected
    if (!img) {
      return;
    }

    // check if image
    const result = isImage(img.name);
    if (!result) {
      const error = "File type should be a image";
      // toast(error, { type: 'error' });
      console.log(error);
      // setImageError(error);
      return;
    }
    const isImageLarge = validateSize(img);
    if (isImageLarge) {
      const error = "File must be less or equal to 5MB";
      console.log(error);

      // toast(error, { type: 'error' });
      // setImageError(error);
      return;
    }
    const reader = new FileReader();
    // converts to BASE 64
    reader.readAsDataURL(img);
    reader.addEventListener("load", () => {
      console.log("reader.resul", reader.result);
      // setImage(reader.result as string);
      setImgSrc(reader.result as string);
      setImage(img);
    });
  };

  useEffect(() => {
    // get all images from cloudinary
  }, []);

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white">
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid w-full max-w-[1960px] grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        <div className="col-span-1 row-span-1 h-[400px] rounded-lg border-2 border-gray-500 sm:h-auto md:col-span-2 xl:col-span-1 xl:row-span-2">
          <div className="p4 border-grey-400 flex w-max ">
            <LoginButton />
          </div>
        </div>
        {imagesData && imagesData.length > 0 && (
          <>
            <ImageComponent imageData={imagesData[0]} />
            <ImageComponent imageData={imagesData[0]} />
            <ImageComponent imageData={imagesData[0]} />
            <ImageComponent imageData={imagesData[0]} /> 
            <ImageComponent imageData={imagesData[1]} /> 
            <ImageComponent imageData={imagesData[0]} /> 
            <ImageComponent imageData={imagesData[0]} /> 
          </>
        )}
      </div>
      <footer>
        <div>footer here</div>
      </footer>
      {/* <Background /> */}
    </div>
  );
};

export default Home;
