import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { RxThickArrowLeft } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";
import clsx from "clsx";
import Link from "next/link";
import SvgAnimation from "@/src/components/SvgAnimation";
import LoginButton from "@/src/components/loginButton";
import ActionCard from "@/src/components/ActionCard";
import BottomBullets from "@/src/components/BottomBullets";
import DeletingImagesCard from "@/src/components/DeletingImagesCard";
import { isAdmin } from "@/src/utils/admins";
import { BsGithub } from "react-icons/bs";
import { TfiLayoutGrid2 } from "react-icons/tfi";
import { twMerge } from "tailwind-merge";

interface Prop {
  isDeletingImages: boolean;
  setIsDeletingImages: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDeleteImages: string[];
  gridLayout: string;
  setGridLayout: React.Dispatch<React.SetStateAction<string>>;
}

const TopLeftCard: React.FC<Prop> = ({
  isDeletingImages,
  setIsDeletingImages,
  selectedDeleteImages,
  gridLayout,
  setGridLayout,
}) => {
  const [cardSwitched, setCardSwitched] = useState(false);
  const [hoverLogout, setHoverLogout] = useState(false);
  // const [previewImage, setPreviewImage] = useState<File>();
  const [stage, setStage] = useState(1);
  const { data: session } = useSession();

  useEffect(() => {
    if (!isAdmin(session)) setStage(1.5);
    if (session?.user && isAdmin(session)) setStage(2);
    if (isDeletingImages) setStage(3);
  }, [session, isDeletingImages]);

  if (!cardSwitched) {
    return (
      <div
        className={twMerge(
          "relative row-span-1 aspect-[3/3] rounded-lg bg-black sm:aspect-[4.127/3] lg:row-span-2 lg:aspect-[3/4.5]",
          gridLayout === "grid-cols-1" && " aspect-[3/3]",
          gridLayout === "grid-cols-2" && "aspect-[4.127/3]"
        )}
      >
        <div className="flex h-full w-full flex-col items-center">
          <div
            className={twMerge(
              "mt-1 flex h-auto w-10/12 justify-center md:w-full xl:mt-12",
              gridLayout === "grid-cols-1" && "w-10/12",
              gridLayout === "grid-cols-2" && "w-6/12"
            )}
          >
            <SvgAnimation gridLayout={gridLayout} />
          </div>
          <div
            className={clsx(
              "md:mt-1 md:mb-1 xl:mb-6 xl:mt-6",
              gridLayout === "grid-cols-1" && "text-2xl",
              gridLayout === "grid-cols-2" && "text-sm"
            )}
          >
            {"Ethan's photos gallery!"}
          </div>
          <div className="flex h-full w-full flex-col items-end justify-end px-4 pb-4">
            {session?.user && (
              <button
                className="w-48 rounded-sm border-2 border-gray-600 py-1 transition-all duration-300 hover:bg-slate-500"
                onClick={() => setCardSwitched(true)}
              >
                Actions
              </button>
            )}
            {!session?.user && (
              <div className="flex w-full justify-between">
                <div className="w-6" />
                <div className="flex items-center gap-4 sm:hidden">
                  <div
                    className={clsx(
                      "rounded-sm border border-white",
                      gridLayout === "grid-cols-1" && "h-5 w-5",
                      gridLayout === "grid-cols-2" && "h-4 w-4"
                    )}
                    onClick={() => setGridLayout("grid-cols-1")}
                  />
                  <TfiLayoutGrid2
                    className={clsx(
                      gridLayout === "grid-cols-1" && "h-6 w-6",
                      gridLayout === "grid-cols-2" && "h-4 w-4"
                    )}
                    onClick={() => setGridLayout("grid-cols-2")}
                  />
                </div>
                <Link
                  href="https://github.com/kwansing14/baby-ethan.com"
                  target="_blank"
                >
                  <BsGithub className="h-6 w-6" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="col-span-1 row-span-1 h-[450px] overflow-hidden rounded-lg bg-slate-800 sm:h-auto md:col-span-1 md:h-[350px] xl:col-span-1 xl:row-span-2 xl:h-[590px]">
      <div className="p4 flex h-full w-full flex-col">
        <div id="backButton" className="mx-2 mt-2 flex justify-between">
          <button
            className="flex items-center gap-1 rounded-sm border border-gray-600 px-2 py-2 transition-all duration-300 hover:bg-slate-500"
            onClick={() => setCardSwitched(false)}
          >
            <RxThickArrowLeft className="h-4 w-4" />
            Back
          </button>
          {!session?.user && (
            <div className="flex items-center justify-center rounded-sm border border-gray-600 px-4">
              <CgProfile className="h-6 w-6" />
            </div>
          )}
          {session?.user && (
            <div className="relative">
              <button
                className="flex items-center justify-center gap-2 rounded-sm border border-gray-600 bg-slate-800 px-1 py-1"
                onMouseOver={() => setHoverLogout(true)}
                onMouseOut={() => setHoverLogout(false)}
              >
                <LoginButton />
                <div
                  className={
                    "absolute top-2 right-12 whitespace-pre transition-all duration-300" +
                    (hoverLogout ? " opacity-100" : " opacity-0")
                  }
                >
                  Click to logout
                </div>
              </button>
            </div>
          )}
        </div>
        <div className="flex h-full items-center justify-center">
          {stage === 1 && (
            <div className="rounded-sm border border-slate-400 py-2 px-4 transition-all duration-300 hover:bg-slate-700">
              <LoginButton />
            </div>
          )}
          {stage === 1.5 && (
            <div>
              <p>Welcome~!</p>
            </div>
          )}
          {stage === 2 && (
            <ActionCard
              // setPreviewImage={setPreviewImage}
              setIsDeletingImages={setIsDeletingImages}
            />
          )}
          {stage === 3 && (
            <DeletingImagesCard
              setIsDeletingImages={setIsDeletingImages}
              selectedDeleteImages={selectedDeleteImages}
            />
          )}
        </div>
        <div className="mb-12 flex flex-col items-center justify-end">
          <BottomBullets stage={stage} />
        </div>
      </div>
    </div>
  );
};

export default TopLeftCard;
