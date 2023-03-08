import Resizer from "react-image-file-resizer";

export const resizeFile = (file: File) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      1024, // max width
      1024, // max height
      "JPEG", // output format
      90, // quality
      0,
      (uri) => {
        resolve(uri);
      },
      "base64"
    );
  });

