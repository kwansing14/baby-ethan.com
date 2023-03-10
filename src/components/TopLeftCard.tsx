import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { RxThickArrowLeft } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";
// import clsx from "clsx";
import SvgAnimation from "@/src/components/SvgAnimation";
import LoginButton from "@/src/components/loginButton";
import ActionCard from "@/src/components/ActionCard";
import BottomBullets from "@/src/components/BottomBullets";
import DeletingImagesCard from "@/src/components/DeletingImagesCard";
import { isAdmin } from "@/src/utils/admins";

interface Prop {
  isDeletingImages: boolean;
  setIsDeletingImages: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDeleteImages: string[];
}

const TopLeftCard: React.FC<Prop> = ({
  isDeletingImages,
  setIsDeletingImages,
  selectedDeleteImages,
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
      <div className="relative row-span-1 aspect-[3/3] sm:aspect-[4.127/3] rounded-lg bg-black lg:row-span-2 lg:aspect-[3/4.5]">
        <div className="flex h-full w-full flex-col items-center">
          <div className="mt-1 flex h-auto w-10/12 md:w-full justify-center xl:mt-12">
            <SvgAnimation />
          </div>
          <div className="text-2xl md:mt-1 md:mb-1 xl:mb-6 xl:mt-6">
            {"Ethan's photos gallery!"}
          </div>
          <div className="flex w-8/12 flex-col items-center gap-4 sm:gap-2">
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 bg-slate-400" />
              Birthday: 3th Mar 2023
            </div>
          </div>
          <div className="mt-2 mb-8 flex h-full flex-col justify-end sm:mb-2 md:mb-6 xl:mt-16 xl:mb-16">
            {session?.user && (
              <button
                className="w-48 rounded-sm border-2 border-gray-600 py-1 transition-all duration-300 hover:bg-slate-500"
                onClick={() => setCardSwitched(true)}
              >
                Actions
              </button>
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
