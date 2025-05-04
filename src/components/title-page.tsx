import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const titleVariants = cva("font-semibold text-xl w-full text-blue-pnm", {
    variants: {
        size: {
            default: "text-2xl font-bold",
            md: 'font-bold text-blue-pnm text-[17px] mt-1',
            sm: "text-sm font-medium",
            lg: "text-xl font-bold",
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
    size?: "default" | "sm" | "lg" | "md" | "icon" | "xs";
    tag?: "h1" | "h2" | 'h3';
    prefix?: React.ReactNode;
    className?: string;
}

export default function TitlePage({
    title,
    size = "default",
    tag,
    prefix,
    className
}: Readonly<TitlePageProps>) {
    return (
        <div className={cn("flex items-center space-x-2")}>
            {
                prefix && <div>{prefix}</div>
            }
            {
                tag === 'h1' ?
                    <h1 className={cn(titleVariants({ size }), className, "transition-all duration-300")}>
                        {title}
                    </h1>
                    : tag === 'h2'
                        ? <h2 className={cn(titleVariants({ size }), className, "transition-all duration-300")}>
                            {title}
                        </h2>
                        : <h3 className={cn(titleVariants({ size }), className, "transition-all duration-300")}>
                            {title}
                        </h3>
            }
        </div >
    );
}
