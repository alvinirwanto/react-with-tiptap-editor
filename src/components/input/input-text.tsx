import { useEffect, useRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Control } from 'react-hook-form';

interface InputTextProps {
    control: Control<any>;
    name: string;
    startAdorn?: React.ReactNode | string;
    endAdorn?: React.ReactNode | string;
    loading?: boolean;
    type?: string;
    input_variant?: string;
    description?: string;
    qa: string;
    error?: string;
    label?: string;
    placeholder?: string;
    size?: string;
    className?: string;
    disabled?: boolean;
    isCenter?: boolean;
    showError?: boolean;
    trigger?: any;
    shouldTrigger?: boolean;
    pathTriggerFieldTarget?: any;
    watch?: any;
    fieldArrayLength?: number;
    max?: number;
    required?: boolean;
    value?: string;
    readOnly?: boolean;
}

export default function InputText({
    control,
    name,
    startAdorn,
    endAdorn,
    loading,
    description,
    disabled,
    qa,
    type = 'text',
    input_variant = 'default',
    error,
    label,
    placeholder,
    size,
    isCenter,
    className,
    showError = true,
    trigger,
    shouldTrigger = false,
    pathTriggerFieldTarget,
    watch,
    max,
    fieldArrayLength = 0,
    required,
    value,
    readOnly
}: Readonly<InputTextProps>) {

    const watchedValue = watch ? watch(name) : undefined;

    const isFirstRender = useRef(true);


    const previousFieldArrayLength = useRef<number>(fieldArrayLength);

    useEffect(() => {
        if (!shouldTrigger) return;

        // Skip effect on first render
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Skip effect if a field was removed (field count decreased)
        if (fieldArrayLength < previousFieldArrayLength.current) {
            previousFieldArrayLength.current = fieldArrayLength; // Update count
            return;
        }

        previousFieldArrayLength.current = fieldArrayLength; // Update ref after validation

        if (watchedValue !== undefined) {
            trigger(pathTriggerFieldTarget);
        }
    }, [
        shouldTrigger,
        control,
        pathTriggerFieldTarget,
        watchedValue,
        fieldArrayLength, // Track field count changes
    ]);


    const [inputType, setInputType] = useState(type);

    const togglePasswordVisibility = () => {
        setInputType(prevType => prevType === 'password' ? 'text' : 'password');
    };

    const handleKeyDown = (type: string, e: any) => {
        // Allow navigation keys, backspace, etc.
        const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab', ' '];

        if (e.ctrlKey || e.metaKey) {
            return;
        }

        if (allowedKeys.includes(e.key)) return;

        if (type === 'number') {
            if (['.'].includes(e.key)) return;
            if (!/^\d$/.test(e.key)) {
                e.preventDefault();
            }
        }

        if (type === 'Alphabetic') {
            if (!/^[a-zA-Z.,-]$/.test(e.key)) {
                e.preventDefault();
            }
        }

        if (type === 'Numeric') {
            if (!/^[0-9]$/.test(e.key)) {
                e.preventDefault();
            }
        }

        if (type === 'Alphanumeric') {
            if (!/^[a-zA-Z0-9.,-]$/.test(e.key)) {
                e.preventDefault();
            }
        }
    };


    // const handleFocus = (type: string, e: React.FocusEvent<HTMLInputElement>) => {
    //     if (type === 'number') {
    //         const input = e.target;
    //         if (input.value === "0") {
    //             input.value = ""; // Clear the value if it's 0
    //         }
    //     }
    // };

    // const handleBlur = (type: string, e: React.FocusEvent<HTMLInputElement>) => {
    //     if (type === 'number') {
    //         const input = e.target;
    //         if (e.target.value === "") {
    //             input.value = "0"; // Restore value to 0 if input is empty
    //         }
    //     }
    // };

    const handleChange = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (type === 'number') {
            let value = e.target.value.replace(/D/g, ""); // Allow only numbers
            const input = e.target

            if (max !== undefined && parseInt(value) > Number(max)) {
                input.value = max.toString(); // Limit max value
            }
        }
    };

    return (
        <FormField
            control={control}
            name={name}
            defaultValue=""
            render={({ field, fieldState }) => (
                <FormItem className={cn('w-full', label ? "space-y-1" : "space-y-0")}>
                    <FormLabel>
                        {label} {required && <span className='text-rose-500 text-base'>*</span>}
                    </FormLabel>
                    <FormControl>
                        <div className="relative flex items-center">
                            <Input
                                {...field}
                                step="any"
                                value={value}
                                onChange={(e) => {
                                    if (type === 'number') {
                                        handleChange(type, e);
                                    }
                                    field.onChange(e);
                                }}
                                onKeyDown={(e) => handleKeyDown(type, e)}
                                // onFocus={(e) => handleFocus(type, e)}
                                onBlur={(e) => {
                                    field.onBlur();
                                    // handleBlur(type, e);
                                }}
                                onPaste={(e) => {
                                    const clipboardData = e.clipboardData || (window as any).clipboardData;
                                    const pastedText = clipboardData.getData('text');

                                    let filteredText = '';

                                    // Apply specific filtering logic based on the type
                                    if (type === 'number') {
                                        filteredText = pastedText.replace(/[^0-9.]/g, ''); // Only numbers and decimal points
                                    } else if (type === 'Alphabetic') {
                                        filteredText = pastedText.replace(/[^a-zA-Z.,-]/g, ''); // Only alphabetic characters and allowed punctuation
                                    } else if (type === 'Alphanumeric') {
                                        filteredText = pastedText.replace(/[^a-zA-Z0-9.,-]/g, ''); // Alphanumeric with punctuation
                                    } else {
                                        filteredText = pastedText; // No filtering for other types
                                    }

                                    // Prevent default paste behavior
                                    e.preventDefault();

                                    // Update the form field value
                                    field.onChange(filteredText);
                                }}
                                data-type={type}
                                // datatype={type}
                                input_variant={input_variant}
                                min={0}
                                qa-input={qa}
                                type={type === 'number' ? 'text' : inputType}
                                disabled={disabled}
                                readOnly={readOnly}
                                placeholder={placeholder}
                                className={cn(
                                    (fieldState.error || error) && "bg-rose-100 !border-rose-500",
                                    size === 'lg' && 'h-[50px]',
                                    startAdorn && 'pl-[50px]',
                                    isCenter && 'text-center',
                                    'text-black',
                                    className
                                )}
                            />
                            {
                                <div className='absolute left-[12px] top-[10px] text-sm'>{startAdorn}</div>
                            }
                            {
                                <div className='h-full absolute right-[12px] top-[10px] rounded-md text-sm'>{endAdorn}</div>
                            }
                            {
                                type === 'password' && (
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        aria-label={inputType === 'password' ? "Hide password" : "Show password"}
                                        className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {inputType === 'password' ? <Eye className='h-4 w-4' /> : <EyeOff className='h-4 w-4' />}
                                    </button>
                                )
                            }
                        </div>
                    </FormControl>
                    {
                        description && (
                            <FormDescription className='text-xs'>
                                {description}
                            </FormDescription>
                        )
                    }
                    {
                        showError && (
                            <div className={cn(
                                (fieldState.error || error) && 'pt-1'
                            )}>
                                <FormMessage />
                            </div>
                        )
                    }
                </FormItem>
            )}
        />
    )
}
