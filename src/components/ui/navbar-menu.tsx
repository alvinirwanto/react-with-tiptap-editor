import React, { useMemo } from "react";
import { motion } from "framer-motion";

import { Link, useLocation } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const transition = {
    type: "spring",
    mass: 0.5,
    damping: 11.5,
    stiffness: 100,
    restDelta: 0.001,
    restSpeed: 0.001,
};

export const MenuItemChild = ({
    setActive,
    active,
    item,
    children,
    activeLink
}: {
    setActive: (item: string) => void;
    active: string | null;
    item: any;
    children?: React.ReactNode;
    activeLink?: string;
}) => {

    const isActive = useMemo(() => {
        return item?.child?.some((subMenu: any) => activeLink?.includes(subMenu.link))
    }, [item, activeLink])

    return (
        <div onMouseEnter={() => setActive(item.name)} className="relative">
            <div className="flex items-center gap-2">
                <motion.p
                    transition={{ duration: 0.3 }}
                    className={cn(
                        isActive ? 'text-blue-pnm font-bold' : 'text-neutral-600',
                        "cursor-pointer hover:text-black"
                    )}
                >
                    {item.name}
                </motion.p>
                <ChevronDown className="h-4 w-4" />
            </div>

            {active !== null && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={transition}
                >
                    {active === item.name && (
                        // <div className="absolute top-[calc(100%_+_.5rem)] left-1/2 transform -translate-x-1/2 pt-4">
                        <div className="absolute top-[calc(100%_+_.5rem)] pt-4">
                            <motion.div
                                transition={transition}
                                layoutId="active" // layoutId ensures smooth animation
                                className="bg-white backdrop-blur-sm rounded-sm overflow-hidden border border-gray-200 shadow-xl"
                            >
                                <motion.div
                                    layout // layout ensures smooth animation
                                    className="w-max h-full p-2"
                                >
                                    {children}
                                </motion.div>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export const MenuItem = ({
    activeLink,
    link,
    children,
    ...rest
}: {
    activeLink?: string;
    children: React.ReactNode;
    link: any;
}) => {

    const location = useLocation();

    const isActive = () => {
        if (link.link === '/') {
            const isRootActive = location.pathname === '/' || location.pathname === '';
            return isRootActive;
        }

        const isActive = location.pathname.startsWith(link.link);
        return isActive;
    };

    return (
        <Link
            {...rest}
            to={link.link}
            className={cn(isActive() ? "font-bold text-blue-pnm" : "text-neutral-600 hover:text-black")}
        >
            {children}
        </Link>
    );
};


export const Menu = ({
    setActive,
    children,
}: {
    setActive: (item: string | null) => void;
    children: React.ReactNode;
}) => {
    return (
        <nav
            onMouseLeave={() => setActive(null)}
            className="relative rounded-full shadow-input flex justify-center space-x-8 px-8 py-6"
        >
            {children}
        </nav>
    );
};

export const HoveredLink = ({ children, ...rest }: any) => {
    return (
        <Link
            {...rest}
            className="px-3 py-2 rounded-sm text-neutral-600 hover:bg-gray-100 hover:text-black"
        >
            {children}
        </Link>
    );
};
