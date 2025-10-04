interface ButtonProp {
    name: string;
}
const Button: React.FC<ButtonProp> = (props) => {
    return (
        <div className="flex justify-center w-full">
            <button className="px-3 py-2.5 w-full bg-[#74FFA7] text-black rounded-lg">{props.name}</button>
        </div>
    );
}

export default Button;
