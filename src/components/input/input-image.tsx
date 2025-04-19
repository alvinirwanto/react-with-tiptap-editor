import { useEffect, useRef, useState } from 'react';
import { Image, Pencil, Trash2 } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Control } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface InputPhotoProps {
    name: string;
    label?: string;
    control: Control<any>;
    qa: string;
    linkImage?: string;
    info: string;
    disabled?: boolean;
    fileType?: string;
    showError?: boolean;
    error?: string;
    trigger?: any;
    shouldTrigger?: boolean;
    pathTriggerFieldTarget?: any;
    watch?: any;
    connectSchemaName?: string;
    setValue?: any;
}

export default function InputImage({
    name,
    control,
    qa,
    label,
    linkImage,
    info,
    disabled,
    fileType,
    showError = true,
    error,
    trigger,
    shouldTrigger = false,
    pathTriggerFieldTarget,
    watch,
    connectSchemaName,
    setValue
}: Readonly<InputPhotoProps>) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(linkImage || null);

    useEffect(() => {
        setImageSrc(linkImage || null);
    }, [linkImage]);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleImageChange = (event: any, onChange: any) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            onChange([file]); // Pass file as an array
            setHoverShowEdit(false)
        }
    };

    const handleRemoveImage = (onChange: any) => {
        setValue(connectSchemaName, '')
        setImageSrc(null);
        setSelectedImage(null);

        onChange([]); // Clear the file array

        // Reset the file input so the same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset the input value
        }
    };

    const [hoverShowEdit, setHoverShowEdit] = useState(false);


    const watchedValue = watch ? watch(name) : undefined;

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (!shouldTrigger) return;

        // Skip effect on first render
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (watchedValue !== undefined) {
            trigger(pathTriggerFieldTarget);
        }
    }, [
        shouldTrigger,
        control,
        pathTriggerFieldTarget,
        watchedValue
    ]);


    return (
        <FormField
            name={name}
            control={control}
            defaultValue=""
            render={({ field: { onChange, value, ...field }, fieldState }) => (
                <FormItem className={cn(
                    'flex flex-col gap-1',
                    label ? "space-y-1" : "space-y-0",
                    (fieldState.error || error) ? '' : 'mt-0 mb-0'
                )}
                >
                    <FormLabel className={cn(fieldState.error || error) && "text-destructive"}>
                        {label}
                    </FormLabel>
                    <FormControl>
                        <>
                            <input
                                qa-upload-file={qa}
                                type="file"
                                id={name}
                                disabled={disabled}
                                accept={fileType ?? '.png, .jpg, .jpeg'}
                                {...field}
                                ref={fileInputRef}
                                onChange={(event) => {
                                    handleImageChange(event, onChange);
                                }}
                                className='hidden'
                            />

                            {/* Input view */}
                            <div
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const file = e.dataTransfer.files[0];
                                    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
                                        const imageUrl = URL.createObjectURL(file);
                                        setSelectedImage(imageUrl);
                                        onChange([file]);
                                    }
                                }}
                                onMouseEnter={() => setHoverShowEdit(true)}
                                onMouseLeave={() => setHoverShowEdit(false)}
                                className={cn(
                                    'relative w-full rounded grid place-items-center p-1 overflow-hidden',
                                    disabled ? 'cursor-not-allowed' : 'cursor-pointer',
                                    (selectedImage || imageSrc) ? 'h-[15rem]' : 'h-[5rem]',
                                    (fieldState.error || error)
                                        ? 'border-2 border-dashed border-rose-500 bg-rose-100'
                                        : 'bg-white border-2 border-dashed border-gray-300',
                                    (hoverShowEdit && (!selectedImage || !imageSrc) && !disabled) && 'bg-gray-200'
                                )}
                            >

                                {/* Show BACKGROUND image that uploaded */}
                                {
                                    (selectedImage || imageSrc) && (
                                        <img
                                            src='/checkerboard-pattern.jpg'
                                            alt='img-input'
                                            className='absolute w-full h-[15rem] z-10 object-cover opacity-[.05]'
                                        />
                                    )
                                }

                                {/* Show edit and delete button when hover */}
                                {(hoverShowEdit && !disabled) && (
                                    selectedImage || imageSrc ? (
                                        <div
                                            className={cn(
                                                'absolute z-[50] w-full h-full flex items-center justify-center gap-2 text-white cursor-pointer',
                                                (imageSrc || selectedImage) && 'bg-[#00000091]'
                                            )}
                                        >
                                            <label htmlFor={name} className='flex justify-center items-center px-3 gap-2 w-[6rem] text-xs p-2 rounded transition duration-300 hover:bg-blue-pnm hover:text-white text-blue-pnm bg-white cursor-pointer'>
                                                <Pencil className='w-4 h-4' /><span>Edit</span>
                                            </label>

                                            {
                                                // selectedImage && (
                                                <button
                                                    qa-button='delete-image'
                                                    type='button'
                                                    onClick={() => handleRemoveImage(onChange)}
                                                    className='flex justify-center items-center px-3 gap-2 w-[6rem] text-xs p-2 rounded transition duration-300 bg-white hover:bg-rose-500 hover:text-white text-rose-500 cursor-pointer'
                                                >
                                                    <Trash2 className='w-4 h-4' /><span>Hapus</span>
                                                </button>
                                                // )
                                            }
                                        </div>
                                    ) : <label htmlFor={name} className='absolute z-[50] w-full h-full cursor-pointer'>{''}</label>
                                )}

                                {/* View Input */}
                                {
                                    selectedImage || imageSrc ? (
                                        // Show image that uploaded
                                        <img
                                            src={selectedImage ?? imageSrc ?? undefined}
                                            alt="img-input"
                                            className="z-[20] w-[95%] h-[13.5rem] object-contain"
                                        />

                                    ) : (
                                        <div
                                            className={cn(
                                                'w-full flex justify-start items-center gap-4 px-2',
                                                (fieldState.error || error) ? 'text-rose-500' : 'text-gray-600'
                                            )}
                                        >
                                            <Image className={cn(
                                                (fieldState.error || error) ? 'text-rose-500' : 'text-blue-pnm',
                                                'h-[50px] w-[50px]'
                                            )} />
                                            <div className='flex flex-col justify-center gap-1'>
                                                <span className='font-semibold'>Upload Foto</span>
                                                <p className="text-center text-gray-400 text-xs font-medium">{info}</p>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </>
                    </FormControl>
                    {
                        showError
                            ? <FormMessage />
                            : ''
                    }
                </FormItem>
            )}
        />
    );
}
