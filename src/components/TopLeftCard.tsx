import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import LoginButton from "@/src/components/loginButton";
import { isImage, validateSize } from "@/src/utils/fileValidation";
import { api } from "@/src/utils/api";

type Orientation = "portrait" | "landscape" | "";

const TopLeftCard = () => {
  const [image, setImage] = useState<File>();
  const [orientation, setOrientation] = useState<Orientation>("");
  const [imgSrc, setImgSrc] = useState("");
  const [cardSwitched, setCardSwitched] = useState(false);
  const generateImg = api.image.uploadImg.useMutation({
    onMutate: () => toast.loading("Uploading...", { id: "imageUpload" }),
    onSuccess: () => toast.success("Done!", { id: "imageUpload" }),
    onError: (e) =>
      toast.error(`Error: ${e.data?.code || ""}`, {
        id: "imageUpload",
      }),
  });
  const createImage = () => generateImg.mutate({ img: imgSrc, orientation });

  const handleImageLoaded = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    if (e.currentTarget.width > e.currentTarget.height) {
      setOrientation("landscape");
    } else {
      setOrientation("portrait");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const img = e.target.files[0];
    // if no image selected
    if (!img) return;
    // check if image
    const result = isImage(img.name);
    if (!result) {
      const error = "File type should be a image";
      toast.error(error);
      return;
    }
    const isImageLarge = validateSize(img);
    if (isImageLarge) {
      const error = "File must be less or equal to 5MB";
      toast.error(error);
      return;
    }
    const reader = new FileReader();
    // converts to BASE 64
    reader.readAsDataURL(img);
    reader.addEventListener("load", () => {
      setImgSrc(reader.result as string);
      setImage(img);
    });
  };

  if (!cardSwitched) {
    return (
      <div className="col-span-1 row-span-1 h-[400px] rounded-lg border-2 border-gray-500 sm:h-auto md:col-span-2 xl:col-span-1 xl:row-span-2">
        <div className="flex h-full w-full flex-col items-center p-8">
          <div>{"Welcome to Ethan's photos!"}</div>
          <button>Upload pics</button>
        </div>
      </div>
    );
  }
  return (
    <div className="col-span-1 row-span-1 h-[400px] rounded-lg border-2 border-gray-500 sm:h-auto md:col-span-2 xl:col-span-1 xl:row-span-2">
      <div className="p4 border-grey-400 flex w-full flex-col">
        <div className="flex w-full justify-end border-2 border-red-300">
          <LoginButton />
        </div>
        <div className="flex flex-col">
          <button
            className="w-48 rounded-sm border-2 border-blue-400 py-2 px-1 text-white"
            onClick={createImage}
          >
            upload image
          </button>
          <button className="w-48 border-2 border-blue-400"> test </button>
          <input
            className="w-48 border-2 border-blue-400"
            type="file"
            onChange={handleImageChange}
          />
        </div>
        <div>
          {image && (
            <Image
              alt="card"
              width={200}
              height={200}
              src={imgSrc}
              className="my-5 h-auto w-48 basis-1/2 border-2 border-red-200"
              onLoad={handleImageLoaded}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TopLeftCard;
