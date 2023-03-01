
interface ButtonProps {
  pic?: string;
  text?: string;
  func?: () => void;
  onClick?: () => void;
  hasDropDown?: boolean;
  style?: string;
  children?: React.ReactNode | string;
}

const ButtonComponent: React.FC<ButtonProps> = ({
  pic,
  text,
  onClick,
  children,
}) => {
  return (
    <div className="overflow-hidden rounded-lg">
      <div
        className="flex items-center gap-1 hover:cursor-pointer"
        onClick={onClick}
      >
        {pic && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="w-8" src={pic} referrerPolicy={"no-referrer"} alt='profile_pic'/>
        )}
        {text && <div className="whitespace-nowrap text-white">{text}</div>}
        {children && <div className="">{children}</div>}
      </div>
    </div>
  );
};

export default ButtonComponent;
