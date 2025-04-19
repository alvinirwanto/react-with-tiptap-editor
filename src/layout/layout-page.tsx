import { slideIn } from "@/lib/animation";
import { motion } from "framer-motion";
import { CircleArrowLeft } from "lucide-react";

interface LayoutPageProps {
    isBack?: boolean;
    childrenHead?: React.ReactNode;
    children: React.ReactNode;
}

export default function LayoutPage({
    isBack,
    childrenHead,
    children
}: Readonly<LayoutPageProps>) {

    const handleBackClick = () => {
        window.history.back();
    };


    return (
        <div className="flex flex-col gap-2 z-20 relative h-[calc(100vh-92px)] overflow-auto">
            {
                childrenHead && (
                    <motion.div
                        variants={slideIn({ direction: 'down', duration: 0.5 })}
                        initial="initial"
                        animate="enter"
                        exit="exit"
                        className="w-full h-[40px] z-20 flex items-center gap-3 pr-2"
                    >
                        {
                            isBack && (
                                <button onClick={handleBackClick}>
                                    <CircleArrowLeft className="h-8 w-8 text-blue-pnm hover:text-blue-900" />
                                </button>
                            )
                        }
                        {childrenHead}
                    </motion.div>
                )
            }
            <motion.div
                variants={slideIn({ direction: 'up', duration: 0.35, delay: 0.1, opacity: 1 })}
                initial="initial"
                animate="enter"
                exit="exit"
                className="w-full h-full bg-white rounded-md p-4 overflow-auto"
            >
                {children}
            </motion.div>
        </div>
    )
}
