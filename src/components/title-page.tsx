import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const titleVariants = cva("font-semibold text-xl w-full text-blue-pnm", {
    variants: {
        size: {
            default: "text-2xl font-bold",
            sm: "text-sm font-medium",
            lg: "text-2xl font-bold",
            icon: "text-lg",
            xs: "text-xs font-light",
        },
    },
    defaultVariants: {
        size: "default",
    },
});

interface TitlePageProps {
    title: string;
    size?: "default" | "sm" | "lg" | "icon" | "xs";
}

export default function TitlePage({
    title,
    size = "default",
}: Readonly<TitlePageProps>) {
    return (
        <h1 className={cn(titleVariants({ size }), "transition-all duration-300")}>
            {title}
        </h1>
    );
}
