interface ButtonProp {
  name: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
const Button: React.FC<ButtonProp> = (props) => {
  return (
    <div className="flex justify-center w-full">
      <button
        className="px-3 mt-5 py-4 w-full bg-[#F9F9F9] text-black rounded-lg"
        onClick={props.onClick}
      >
        {props.name}
      </button>
    </div>
  );
};

export default Button;
