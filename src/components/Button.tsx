interface ButtonProp {
  name: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}
const Button: React.FC<ButtonProp> = (props) => {
  return (
    <div className="flex justify-center w-full">
      <button
        type={props.type ?? "button"}
        className={`px-3 mt-5 py-2 w-full text-black rounded-lg disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:scale-95 active:scale-105 hover:shadow-sm cursor-pointer transition ${props.className ? props.className : "bg-[#F9F9F9] hover:bg-gray-100"}`}
        onClick={props.onClick}
        disabled={props.disabled}
      >
        {props.name}
      </button>
    </div>
  );
};

export default Button;
