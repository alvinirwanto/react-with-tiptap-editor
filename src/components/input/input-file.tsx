import { useRef, useState } from 'react';
import { CloudUpload, FileText, Pencil, Trash2 } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Control } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface InputPhotoProps {
    name: string;
    label?: string;
    control: Control<any>;
    qa: string;
    linkPhoto?: string;
    info?: string;
    disabled?: boolean;
    fileType?: string;
}

export default function InputFile({
    name,
    control,
    qa,
    label,
    linkPhoto,
    info,
    disabled,
    fileType
}: Readonly<InputPhotoProps>) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (event: any, onChange: any) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file); // Set file state
            onChange([file]);        // Update the form field's value
            setHoverShowEdit(false)
        }
    };

    const handleRemoveFile = (onChange: any) => {
        setSelectedFile(null); // Reset local file state
        onChange([]);        // Reset form field value

        // Reset file input value
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset input field so that the same file can be re-uploaded
        }
    };

    const [hoverShowEdit, setHoverShowEdit] = useState(false);

    function clipText(text: string, maxLength = 30) {
        if (text.length <= maxLength) {
            return text;
        }

        const beginning = text.slice(0, maxLength / 2);
        const end = text.slice(text.length - maxLength / 2);

        return beginning + '...' + end;
    }

    return (
        <FormField
            name={name}
            control={control}
            defaultValue=""
            render={({ field: { onChange, value, ...field }, fieldState }) => (
                <FormItem className={cn(
                    'flex flex-col gap-1',
                    label ? "space-y-1" : "space-y-0",
                    fieldState.error ? 'mt-3 -mb-3' : 'mt-0 mb-0'
                )}
                >
                    <FormLabel className={`${fieldState.error && "text-destructive"}`}>
                        {label}
                    </FormLabel>
                    <FormControl>
                        <>
                            <input
                                qa-upload-file={qa}
                                type="file"
                                id={name}
                                disabled={disabled}
                                accept={fileType}
                                {...field}
                                ref={fileInputRef}
                                onChange={(event) => {
                                    handleFileChange(event, onChange);
                                }}
                                className='hidden'
                            />
                            <div
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const file = e.dataTransfer.files[0];
                                    if (file) {
                                        onChange([file]);
                                        setSelectedFile(file)
                                        setHoverShowEdit(false)
                                    }
                                }}
                                onMouseEnter={() => setHoverShowEdit(true)}
                                onMouseLeave={() => setHoverShowEdit(false)}
                                className={cn(
                                    'relative h-[11rem] w-full xl:w-full rounded overflow-clip grid place-items-center p-1',
                                    disabled ? 'cursor-not-allowed' : 'cursor-pointer',
                                    fieldState.error ? 'border-2 border-dashed border-rose-500 bg-rose-100' : 'border-2 border-dashed border-gray-300',
                                    (hoverShowEdit && !disabled) && 'bg-gray-200',
                                    disabled && 'bg-gray-200'
                                )}
                            >

                                {(hoverShowEdit && !disabled) && (
                                    selectedFile || linkPhoto ? (
                                        <div className={`absolute z-[50] w-full h-full flex items-center justify-center gap-2 text-white cursor-pointer 
                                            ${(linkPhoto || selectedFile) && 'bg-[#00000091]'}`}
                                        >
                                            <label htmlFor={name} className='flex justify-center items-center px-3 gap-2 w-[6rem] text-xs py-2 rounded transition duration-300 hover:bg-blue-pnm hover:text-white text-black bg-white cursor-pointer'>
                                                <Pencil className='w-4 h-4' /><span>Edit</span>
                                            </label>

                                            {
                                                selectedFile && (
                                                    <button onClick={() => handleRemoveFile(onChange)} className='flex justify-center items-center px-3 gap-2 w-[6rem] text-xs py-2 rounded transition duration-300 bg-white hover:bg-rose-500 hover:text-white text-rose-500 cursor-pointer'>
                                                        <Trash2 className='w-4 h-4' /><span>Hapus</span>
                                                    </button>
                                                )
                                            }
                                        </div>
                                    ) : <label htmlFor={name} className='absolute z-[50] w-full h-full cursor-pointer mb-2'>{''}</label>
                                )}

                                {
                                    selectedFile
                                        ? <div className={`flex flex-col gap-6 items-center justify-center relative p-8 ${fieldState.error ? 'text-rose-500' : 'text-gray-600'}`}>
                                            <FileText className={`scale-150 xl:scale-[5] mb-4 text-blue-50 absolute z-10`} />

                                            <div className='z-30 flex flex-col items-center gap-1'>
                                                <span className='text-center text-blue-pnm font-medium'>{clipText(selectedFile?.name, 35)}</span>
                                                <p className="text-center text-gray-400 text-[9px] xl:text-xs">{clipText(selectedFile?.type, 30)}</p>
                                                <p className="text-center text-[9px] xl:text-xs max-w-[90%] font-semibold">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        : <div className={`flex flex-col gap-2 items-center justify-center p-8 ${fieldState.error ? 'text-rose-500' : 'text-gray-600'}`}>
                                            <CloudUpload />
                                            <span className='text-base font-semibold'>Click or drag file to this area to upload</span>
                                            <p className="text-center text-gray-500 text-sm xl:text-xs max-w-[90%]">{info}</p>
                                        </div>
                                }

                            </div>
                        </>
                    </FormControl>
                    <FormMessage />
                </ FormItem>
            )}
        />
    );
}
