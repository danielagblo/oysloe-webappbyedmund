interface ButtonProp {
  name: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}
const Button: React.FC<ButtonProp> = (props) => {
  return (
    <div className="flex justify-center w-full">
      <button
        type={props.type ?? 'button'}
        className="px-3 mt-5 py-4 w-full bg-[#F9F9F9] text-black rounded-lg disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:scale-95 active:scale-105 hover:shadow-sm cursor-pointer hover:bg-gray-100 transition"
        onClick={props.onClick}
        disabled={props.disabled}
      >
        {props.name}
      </button>
    </div>
  );
};

export default Button;
