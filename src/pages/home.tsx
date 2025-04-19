import { format } from "date-fns";
import { id } from 'date-fns/locale';
import animationData from '../assets/lotties/loading-animation-3.json'
import Lottie from 'react-lottie-player';

export default function Home() {

    // function extractName(name: string) {
    //     let nameParts = name?.split(" ");
    //     if (nameParts?.[0]?.length < 3) {
    //         return nameParts.slice(0, 2).join(" ");
    //     } else {
    //         return nameParts[0];
    //     }
    // }

    // const detailUser = JSON.parse(localStorage.getItem('user-data') ?? '{}');

    return (
        <div className="flex flex-col gap-1 m-10 h-[calc(100vh-92px)]">
            {/* <h1 className='text-4xl font-bold'>Halo, {extractName(detailUser?.name)}</h1> */}
            <h1 className='text-4xl font-bold'>Halo, Budi</h1>
            <span className="text-lg">
                {format(new Date(), "dd MMMM yyyy HH:mm", { locale: id })}
            </span>


            <div className="w-full flex justify-center mt-10">
                <Lottie
                    loop
                    play={true}
                    animationData={animationData}
                    speed={1}
                    style={{ width: 300, height: 300 }}
                    rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
                />
            </div>
        </div>
    )
}
