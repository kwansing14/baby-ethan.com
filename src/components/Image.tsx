import Image from "next/image";
import { clsx } from "clsx";

interface ImageProps {
  imageData:
    | {
        image_url: string;
        orientation: string;
        id: string;
      }
    | undefined;
  setSelectedDeleteImages: React.Dispatch<React.SetStateAction<string[]>>;
  isDeletingImages: boolean;
  selectedDeleteImages: string[];
}

const ImageComponent: React.FC<ImageProps> = ({
  imageData,
  setSelectedDeleteImages,
  isDeletingImages,
  selectedDeleteImages,
}) => {
  const clickHandler = (id: string) => {
    if (isDeletingImages) {
      if (selectedDeleteImages.includes(id)) {
        setSelectedDeleteImages(
          selectedDeleteImages.filter((item) => item !== id)
        );
      } else {
        setSelectedDeleteImages((prev) => [...prev, id]);
      }
    }
  };

  const checkId = (id: string) => {
    if (isDeletingImages) {
      return selectedDeleteImages.includes(id);
    }
    return false;
  };

  if (imageData?.orientation === "landscape") {
    return (
      <div className="relative aspect-[4.127/3]">
        <Image
          alt="photo 1"
          className={clsx(
            "transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110",
            { "cursor-pointer border": checkId(imageData?.id) }
          )}
          style={{
            transform: "translate3d(0, 0, 0)",
            objectFit: "cover",
          }}
          src={imageData?.image_url || ""}
          fill
          sizes="(max-width: 640px) 100vw,
            (max-width: 1280px) 50vw,
            (max-width: 1536px) 33vw,
            25vw"
          onClick={() => clickHandler(imageData?.id)}
          // placeholder="blur"
          // blurDataURL={blurDataUrl}
        />
      </div>
    );
  }
  if (imageData?.orientation === "portrait") {
    return (
      <div className="relative aspect-[3/4.5] row-span-2">
        <Image
          alt="photo 1"
          className={clsx(
            "transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110",
            { border: checkId(imageData?.id) }
          )}
          style={{
            transform: "translate3d(0, 0, 0)",
            objectFit: "cover",
          }}
          src={imageData?.image_url || ""}
          fill
          sizes="(max-width: 640px) 100vw,
            (max-width: 1280px) 50vw,
            (max-width: 1536px) 33vw,
            25vw"
          onClick={() => clickHandler(imageData?.id)}
        />
      </div>
    );
  }
  return null;
};

export default ImageComponent;
