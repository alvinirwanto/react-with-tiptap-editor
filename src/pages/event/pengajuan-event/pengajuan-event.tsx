import { useEffect, useState } from 'react'
import FormEventInformasiAcara from './form/form-event-informasi-acara/form-event-informasi-acara';
import FormEventDeviasi from './form/form-event-deviasi/form-event-deviasi';
import FormEventInputPeserta from './form/form-event-input-peserta/form-event-input-peserta';
import FormEventPic from './form/form-event-pic/form-event-pic';
import FormEventRundowm from './form/form-event-rundown/form-event-rundown';
import FormEventMateri from './form/form-event-materi/form-event-materi';
import LayoutPage from '@/layout/layout-page';
import TitlePage from '@/components/title-page';
import { Button } from '@/components/ui/button';
import { PiSealCheckFill } from 'react-icons/pi';
import { cn } from '@/lib/utils';
import FormEventRencanaAnggaranBiaya from './form/form-event-rencara-anggaran-biaya/form-event-rencana-anggaran-biaya';

export default function PengajuanEvent() {

    const [step, setStep] = useState(1);

    const [formStatus, setFormStatus] = useState({
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
    });

    const [formData, setFormData] = useState({});

    const handleStepComplete = (stepNumber: number, values = {}) => {
        const updatedData = { ...formData, [`step${stepNumber}`]: values };

        setFormData(updatedData);

        const existingStorage = JSON.parse(localStorage.getItem('form-event-data') || '{}');
        localStorage.setItem('form-event-data', JSON.stringify({
            ...existingStorage,
            [`step${stepNumber}`]: values,
        }));
    };

    const handleUpdateStatus = (stepNumber: number, isValid: boolean) => {
        const updatedStatus = { ...formStatus, [stepNumber]: isValid };

        setFormStatus(updatedStatus);

        // Save the entire updated object
        localStorage.setItem('form-event-status', JSON.stringify(updatedStatus));
    };


    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const listOptionForm = [
        {
            step: 1,
            title: 'Informasi Acara',
            isRequired: true
        },
        {
            step: 2,
            title: 'Deviasi',
            isRequired: false
        },
        {
            step: 3,
            title: 'Input Peserta',
            isRequired: true
        },
        {
            step: 4,
            title: 'PIC Panitia & Trainer',
            isRequired: true
        },
        {
            step: 5,
            title: 'Rencana Anggaran Biaya',
            isRequired: true
        },
        {
            step: 6,
            title: 'Rundown',
            isRequired: true
        },
        {
            step: 7,
            title: 'Materi',
            isRequired: true
        }
    ]

    const stepTopMap: Record<number, string> = {
        1: 'top-3',
        2: 'top-15',
        3: 'top-27',
        4: 'top-39',
        5: 'top-51',
        6: 'top-63',
        7: 'top-75',
    };


    useEffect(() => {
        const stored = localStorage.getItem('form-event-status');

        if (stored) {
            const parsed = JSON.parse(stored);
            setFormStatus(parsed)
        }
    }, []);

    return (
        <LayoutPage
            className='bg-transparent p-0 overflow-clip'
            classNameChildren='w-full h-full'
            childrenHead={
                <TitlePage title="Pengajuan Event" />
            }
        >
            <div className='grid grid-cols-[1.1fr_5fr] gap-4'>
                <div className='bg-blue-pnm-2 rounded-md p-3 h-[calc(100vh-137px)] overflow-hidden flex flex-col gap-2 relative'>
                    <div
                        className={cn(
                            'w-[calc(100%-20px)] bg-white rounded-md h-10 absolute right-2.5 z-10 transition-all duration-350 ease-in-out',
                            stepTopMap[step] ?? ''
                        )}
                    ></div>
                    {
                        listOptionForm.map((item: any) => (
                            <Button
                                key={item.step}
                                variant={'ghost'}
                                className={cn('w-full rounded-sm flex justify-between z-30 hover:bg-white/50', step === item.step ? 'text-black' : 'text-white')}
                                qa={`button-form-pengajuan-event-${item.step}`}
                                onClick={() => setStep(item.step)}
                                // disabled={formStatus[item.step - 1 as keyof typeof formStatus] === false}
                            >
                                <h4 className='font-semibold tracking-wide'>
                                    {item.title} {item.isRequired && <span className='text-rose-500 text-[15px]'>*</span>}
                                </h4>
                                <div>
                                    {
                                        formStatus[item.step as keyof typeof formStatus] && <PiSealCheckFill className='h-5 w-5 text-green-pnm' />
                                    }
                                </div>
                            </Button>
                        ))
                    }
                </div>
                <div className='bg-white border-2 border-gray-100 py-3 px-4 h-[calc(100vh-137px)] rounded-md overflow-auto'>
                    {
                        step === 1 &&
                        <FormEventInformasiAcara
                            nextStep={nextStep}
                            onComplete={handleStepComplete}
                            updateStatus={handleUpdateStatus}
                        />
                    }
                    {
                        step === 2 &&
                        <FormEventDeviasi
                            nextStep={nextStep}
                            prevStep={prevStep}
                            onComplete={handleStepComplete}
                            updateStatus={handleUpdateStatus}
                        />
                    }
                    {
                        step === 3 &&
                        <FormEventInputPeserta
                            nextStep={nextStep}
                            prevStep={prevStep}
                            onComplete={handleStepComplete}
                            updateStatus={handleUpdateStatus}
                        />
                    }
                    {
                        step === 4 &&
                        <FormEventPic
                            nextStep={nextStep}
                            prevStep={prevStep}
                            onComplete={handleStepComplete}
                            updateStatus={handleUpdateStatus}
                        />
                    }
                    {
                        step === 5 &&
                        <FormEventRencanaAnggaranBiaya
                            nextStep={nextStep}
                            prevStep={prevStep}
                            onComplete={handleStepComplete}
                            updateStatus={handleUpdateStatus}
                        />
                    }
                    {
                        step === 6 &&
                        <FormEventRundowm
                            nextStep={nextStep}
                            prevStep={prevStep}
                            onComplete={handleStepComplete}
                            updateStatus={handleUpdateStatus}
                        />
                    }
                    {
                        step === 7 &&
                        <FormEventMateri
                            nextStep={nextStep}
                            prevStep={prevStep}
                            onComplete={handleStepComplete}
                            updateStatus={handleUpdateStatus}
                        />
                    }
                </div>
            </div>
        </LayoutPage>
    )
}
