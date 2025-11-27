import type { FC } from "react";
import { Toaster as SonnerToaster } from "sonner";

const Toaster: FC = () => {
    return (
        <SonnerToaster
            // position and appearance tuned to site aesthetic
            position="top-right"
            richColors
            duration={8000}
        />
    );
};

export default Toaster;
