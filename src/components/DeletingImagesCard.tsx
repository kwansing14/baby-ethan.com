import { api } from "@/src/utils/api";
import toast from "react-hot-toast";

interface Prop {
  setIsDeletingImages: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDeleteImages: string[];
}

const DeletingImagesCard: React.FC<Prop> = ({
  setIsDeletingImages,
  selectedDeleteImages,
}) => {
  const deleteImages = api.image.deleteMultipleImages.useMutation({
    onMutate: () => toast.loading("Deleting...", { id: "imageDelete" }),
    onSuccess: () => toast.success("Delete Success!", { id: "imageDelete" }),
    onError: (e) =>
      toast.error(`Error: ${e.data?.code || ""}`, {
        id: "imageDelete",
      }),
  });

  const handleDelete = () => {
    deleteImages.mutate({ ids: selectedDeleteImages });
    setIsDeletingImages(false);
  };

  return (
    <div className="flex flex-col">
      <button onClick={handleDelete}>Delete</button>
      <button onClick={() => setIsDeletingImages(false)}>Back</button>
    </div>
  );
};
export default DeletingImagesCard;
