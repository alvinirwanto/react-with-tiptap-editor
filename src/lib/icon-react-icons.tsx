import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as GoIcons from 'react-icons/go';
import * as PiIcons from 'react-icons/pi';
import { FC } from 'react';
import { cn } from './utils';

const ICONS = {
    fa: FaIcons,
    md: MdIcons,
    go: GoIcons,
    pi: PiIcons,
} as const;

type IconLibraries = keyof typeof ICONS;

interface IconReactIconsProps {
    lib: IconLibraries;
    iconName: string;
    className?: string;
}

const IconReactIcons: FC<IconReactIconsProps> = ({ lib, iconName, className }) => {
    const LibraryIcons = ICONS[lib];

    if (!LibraryIcons) {
        console.error(`Library "${lib}" not found`);
        return null;
    }

    const SelectedIcon = (LibraryIcons as any)[iconName];
    if (!SelectedIcon) {
        console.error(`Icon "${iconName}" not found in library "${lib}"`);
        return null;
    }

    return <SelectedIcon className={cn(className)} />;
};

export default IconReactIcons;
