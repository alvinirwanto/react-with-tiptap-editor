import { Check, X } from 'lucide-react';

// const listProgress = [
//     {
//         "id_log_idea": 8,
//         "id_idea": 19,
//         "id_status": 1,
//         "created_by": "A9EF6C125742C8CEFD416229AFDAD3F5",
//         "created_date": "2024-10-11T15:27:48.62Z",
//         "active": "1",
//         "status": {
//             "id_status": 1,
//             "nama_status": "Start",
//             "id_tahap": 1,
//             "tahap": {
//                 "id_tahap": 1,
//                 "nama_tahap": "Start"
//             }
//         }
//     },
//     {
//         "id_log_idea": 8,
//         "id_idea": 19,
//         "id_status": 1,
//         "created_by": "A9EF6C125742C8CEFD416229AFDAD3F5",
//         "created_date": "2024-10-11T15:27:48.62Z",
//         "active": "1",
//         "status": {
//             "id_status": 1,
//             "nama_status": "Start",
//             "id_tahap": 1,
//             "tahap": {
//                 "id_tahap": 1,
//                 "nama_tahap": "Start"
//             }
//         }
//     },
//     {
//         "id_log_idea": 8,
//         "id_idea": 19,
//         "id_status": 1,
//         "created_by": "A9EF6C125742C8CEFD416229AFDAD3F5",
//         "created_date": "2024-10-11T15:27:48.62Z",
//         "active": "1",
//         "status": {
//             "id_status": 6,
//             "nama_status": "Start",
//             "id_tahap": 1,
//             "tahap": {
//                 "id_tahap": 1,
//                 "nama_tahap": "Start"
//             }
//         }
//     },

// ];

interface StepsProps {
    listProgress: any;
}

const listSteps = [
    {
        id: 1,
        name: 'Submit Innovation'
    },
    {
        id: 2,
        name: 'Seleksi 30 Besar'
    },
    {
        id: 3,
        name: 'Semifinal 15 Besar'
    },
    {
        id: 4,
        name: 'Final 6 Besar'
    },
    {
        id: 5,
        name: 'Batch Selesai'
    }
];

export default function Steps(
    {
        listProgress
    }
        : Readonly<StepsProps>
) {
    const currentStep = listProgress?.length;
    const totalSteps = listSteps?.length;

    // Check if the last step failed
    const lastProgressItem = listProgress?.[listProgress?.length - 1];
    const isFailed = lastProgressItem && (lastProgressItem?.status?.id_status === 3 || lastProgressItem?.status?.id_status === 6 || lastProgressItem?.status?.id_status === 9);

    const persentage = isFailed ? (currentStep - 1) : currentStep

    const lineWidthPercentage = (persentage / totalSteps) * 100;
    const lineWidthPercentageError = (currentStep / totalSteps) * 100;

    return (
        <>
            {
                listProgress && (
                    <div className='flex justify-between relative w-full'>
                        {/* Gray line (Full width) */}
                        <hr className='absolute top-4 z-10 w-full border-2 border-gray-200' />

                        {/* Blue line (Dynamic width based on currentStep) */}
                        <hr
                            className='absolute top-3.5 z-30 border-[3px] border-green-400'
                            style={{ width: `${lineWidthPercentage}%`, transition: 'width 0.3s ease-in-out' }}
                        />

                        {isFailed && (
                            <hr
                                className='absolute top-3.5 z-20 border-[3px] border-rose-400'
                                style={{ width: `${lineWidthPercentageError}%`, transition: 'width 0.3s ease-in-out' }}
                            />
                        )}


                        {/* Steps */}
                        <div className='grid w-full' style={{ gridTemplateColumns: `repeat(${listSteps?.length}, minmax(0, 1fr))` }}>
                            {
                                listSteps.map((step, i) => {
                                    // Find matching progress item (if any)
                                    const progressItem = listProgress[i];
                                    const isCompleted = i < currentStep; // Steps that are completed
                                    const isFailed = progressItem && (progressItem?.status?.id_status === 3 || progressItem?.status?.id_status === 6 || progressItem?.status?.id_status === 9)

                                    // Show div with the step ID if the step is beyond the progress
                                    const isBeyondProgress = i + 1 > currentStep;

                                    return (
                                        <div
                                            key={step.id}
                                            className={`flex flex-col items-center gap-2  z-30 font-medium ${isFailed ? 'text-rose-400' : (isCompleted ? 'text-green-400' : 'text-gray-400')}`}
                                        >
                                            {/* Icon or div with ID based on progress */}
                                            {isFailed ? (
                                                <div className={`w-full flex items-center justify-center`}>
                                                    <X strokeWidth={3} className='w-8 h-8 text-white font-bold bg-rose-400 rounded-full p-1.5 ring-8 ring-white' />
                                                </div>
                                            ) : (
                                                isBeyondProgress ? (
                                                    <div className={`w-full flex items-center justify-center`}>
                                                        <div className='w-8 h-8 rounded-full bg-white border-[3.5px] ring-8 ring-white flex justify-center items-center text-sm'>
                                                            <div className='w-4 h-4 bg-gray-200 rounded-full'></div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className={`w-full flex items-center justify-center`}>
                                                        <Check
                                                            strokeWidth={3}
                                                            className={`w-8 h-8 ${isCompleted ? 'text-white' : 'text-gray-300'} font-bold bg-green-400 p-1.5 rounded-full ring-8 ring-white`}
                                                        />
                                                    </div>
                                                )
                                            )}
                                            <div className={`w-full flex text-sm justify-center`}>
                                                <span>{step?.name}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                )
            }
        </>
    );
}

// ${i === 0 ? 'justify-start' : i + 1 === totalSteps ? 'justify-end' : 'justify-center'}