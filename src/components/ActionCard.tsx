import { useState } from "react";
// import Image from "next/image";
import toast from "react-hot-toast";
import { isImage, validateSize } from "@/src/utils/fileValidation";
import { api } from "@/src/utils/api";
import { resizeFile } from "@/src/utils/imageResizer";
// type Orientation = "portrait" | "landscape" | "";

interface Prop {
  setIsDeletingImages: React.Dispatch<React.SetStateAction<boolean>>;
}

// type ImageProps = {
//   imgUrl: string;
//   orientation: string;
// }[];

const ActionCard: React.FC<Prop> = ({ setIsDeletingImages }) => {
  // const [image, setImage] = useState<File>();
  // const [images, setImages] = useState<ImageProps>([]);
  const [toastCounter, setToastCounter] = useState(0);
  const uploadSingleImg = api.image.uploadSingleImage.useMutation({
    onMutate: () =>
      toast.loading("Uploading...", { id: toastCounter.toString() }),
    onSuccess: () => toast.success("Done!", { id: toastCounter.toString() }),
    onError: (e) =>
      toast.error(`Error: ${e.data?.code || ""}`, {
        id: toastCounter.toString(),
      }),
  });
  // const generateMultiImg = api.image.uploadMultipleImages.useMutation({
  //   onMutate: () => toast.loading("Uploading...", { id: "imageUpload" }),
  //   onSuccess: () => toast.success("Done!", { id: "imageUpload" }),
  //   onError: (e) =>
  //     toast.error(`Error: ${e.data?.code || ""}`, {
  //       id: "imageUpload",
  //     }),
  // });
  // const createMultiImage = () => generateMultiImg.mutate({ imgs: images });

  const handleImageFile = async (imgFile: File) => {
    const result = isImage(imgFile.name);
    if (!result) {
      const error = "File type should be a image";
      toast.error(error, { id: imgFile.name });
      return;
    }
    const isImageLarge = validateSize(imgFile);
    if (isImageLarge) {
      const error = "File must be less or equal to 4MB";
      toast.error(error, { id: imgFile.name });
      return;
    }
    const resizedImg = (await resizeFile(imgFile)) as string;
    const imgUrl = resizedImg;
    const img = new Image();
    img.src = imgUrl;
    img.onload = (e) => {
      const image = e.target as HTMLImageElement;
      // set Images with orientation;
      if (image.width > image.height) {
        uploadSingleImg.mutate({ imgUrl, orientation: "landscape" });
        setToastCounter((prev) => prev + 1);
      } else {
        uploadSingleImg.mutate({ imgUrl, orientation: "portrait" });
        setToastCounter((prev) => prev + 1);
      }
    };
  };

  const handleImgs = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fileList: FileList = e.target.files;
    const filesArray: File[] = Array.from(fileList);
    filesArray.forEach(async (file) => {
      await handleImageFile(file);
    });
  };

  return (
    <>
      <div className="flex flex-col">
        {/* <button
          className="w-48 rounded-sm border-2 border-blue-400 py-2 px-1 text-white"
          onClick={createMultiImage}
        >
          Upload images
        </button> */}
        <button
          className="w-48 rounded-sm border-2 border-blue-400 py-2 px-1 text-white"
          onClick={() => setIsDeletingImages((prev) => !prev)}
        >
          Delete Images
        </button>
        <label className=" cursor-pointer">
          <div className="flex w-48 justify-center rounded-sm border-2 border-blue-400 py-2 px-1">
            Upload images
          </div>
          <input
            multiple
            className="hidden"
            type="file"
            onChange={handleImgs}
          />
        </label>
        <div>
          {/* use this when want to display image */}
          {/* {image && (
            <Image
              alt="card"
              width={200}
              height={200}
              src={imgSrc}
              className="my-5 h-auto w-48 basis-1/2 border-2 border-red-200"
            />
          )} */}
        </div>
      </div>
    </>
  );
};

export default ActionCard;
