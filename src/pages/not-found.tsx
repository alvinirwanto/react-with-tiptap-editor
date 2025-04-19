import Lottie from 'react-lottie-player';
import animationData from '../assets/lotties/404.json';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';


export default function NotFound() {
    const navigate = useNavigate()

    return (
        <div className='w-full h-screen grid place-items-center relative'>
            <Lottie
                loop={true}
                play={true}
                animationData={animationData}
                style={{ width: 700, height: 700 }}
                rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
                className='-mt-16'
            />
            <Button
                qa='button-back-not-found'
                onClick={() => navigate({ to: '/' })}
                className='absolute bottom-16'
            >
                Back to Home
            </Button>
        </div>
    )
}