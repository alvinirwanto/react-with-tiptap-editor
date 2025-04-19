import * as Icons from 'lucide-react';
import { FC } from 'react';
import { cn } from './utils';

type IconName = keyof typeof Icons;

interface IconLucideProps {
    iconName: IconName;
    className?: string;
    strokeWidth?: number;
}

const IconLucide: FC<IconLucideProps> = ({ iconName, className, strokeWidth, ...props }) => {
    const LucideIcon = Icons[iconName] as React.ComponentType<any>;

    return LucideIcon ? <LucideIcon className={cn(className)} strokeWidth={strokeWidth} {...props} /> : null;
};

export default IconLucide;
