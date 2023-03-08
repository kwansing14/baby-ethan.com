import { clsx } from "clsx";

interface Prop {
  stage: number;
}

const BottomBullets: React.FC<Prop> = ({ stage }) => {
  return (
    <>
      <div className="flex gap-4">
        <div
          className={clsx(
            "h-2 rounded-full bg-white transition-all",
            { "w-12": stage === 1 },
            { "w-2": stage !== 1 }
          )}
        />
        <div
          className={clsx(
            "h-2 rounded-full bg-white transition-all",
            { "w-12": stage === 2 },
            { "w-2": stage !== 2 }
          )}
        />
        <div
          className={clsx(
            "h-2 rounded-full bg-white transition-all",
            { "w-12": stage === 3 },
            { "w-2": stage !== 3 }
          )}
        />
      </div>
    </>
  );
};

export default BottomBullets;
