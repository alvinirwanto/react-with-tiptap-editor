import { easeInOut } from "framer-motion";

interface SlideInProps {
    direction?: 'left' | 'right' | 'up' | 'down';
    duration?: number;
    delay?: number;
    opacity?: number;
}

export const subMenuSlide = {
    initial: {
        y: '-30%',
        opacity: 0
    },
    enter: {
        y: '0%',
        opacity: 1,
        transition: { duration: 0.2, ease: easeInOut }
    },
    exit: {
        y: '-30%',
        opacity: 0,
        transition: { duration: 0.2, ease: easeInOut }
    }
};

export const slideIn = ({ direction, duration, delay, opacity }: SlideInProps) => ({
    initial: {
        x: direction === 'left' ? '-100%' : direction === 'right' ? '100%' : 0,
        y: direction === 'up' ? '100%' : direction === 'down' ? '-100%' : 0,
        opacity: opacity ?? 0
    },
    enter: {
        x: '0%',
        y: '0%',
        opacity: 1,
        transition: { duration: duration, delay: delay ?? 0, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] }
    },
    exit: {
        x: direction === 'left' ? '-100%' : direction === 'right' ? '100%' : 0,
        y: direction === 'up' ? '100%' : direction === 'down' ? '-100%' : 0,
        opacity: opacity ?? 0,
        transition: { duration: duration, delay: delay ?? 0, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] }
    }
});
