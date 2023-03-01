import Image from "next/image";

interface ImageProps {
  imageData:
    | {
        image_url: string;
        orientation: string;
      }
    | undefined;
}

const ImageComponent: React.FC<ImageProps> = ({ imageData }) => {
  if (imageData?.orientation === "landscape") {
    return (
      <div className="relative aspect-[4/3]">
        <Image
          alt="photo 1"
          className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
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
        />
      </div>
    );
  }
  if (imageData?.orientation === "portrait") {
    return (
      <div className="relative aspect-[3/4] sm:row-span-2 sm:aspect-auto">
        <Image
          alt="photo 1"
          className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
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
        />
      </div>
    );
  }
  return null;
};

export default ImageComponent;
