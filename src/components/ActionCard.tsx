import { useState } from "react";
import toast from "react-hot-toast";
import { isImage, validateSize } from "@/src/utils/fileValidation";
import { api } from "@/src/utils/api";
import { resizeFile } from "@/src/utils/imageResizer";

interface Prop {
  setIsDeletingImages: React.Dispatch<React.SetStateAction<boolean>>;
}

const ActionCard: React.FC<Prop> = ({ setIsDeletingImages }) => {
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

  const handleImageFile = async (imgFile: File) => {
    console.log(imgFile);
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
        uploadSingleImg.mutate({
          imgUrl,
          lastModified: imgFile.lastModified.toString(),
          orientation: "landscape",
        });
        setToastCounter((prev) => prev + 1);
      } else {
        uploadSingleImg.mutate({
          imgUrl,
          lastModified: imgFile.lastModified.toString(),
          orientation: "portrait",
        });
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
      </div>
    </>
  );
};

export default ActionCard;
