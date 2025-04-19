import { Textarea } from '../ui/textarea'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { cn } from '@/lib/utils';
import { Control } from 'react-hook-form';
import { useEffect, useRef } from 'react';

interface InputTextareaProps {
    control: Control<any>;
    name: string;
    disabled?: boolean;
    qa: string;
    loading?: boolean;
    error?: string;
    label?: string;
    placeholder?: string;
    rows?: number;
    trigger?: any;
    shouldTrigger?: boolean;
    pathTriggerFieldTarget?: any;
    watch?: any;
    readOnly?:boolean;
}
export default function InputTextarea({
    control,
    name,
    disabled,
    loading,
    error,
    label,
    qa,
    placeholder,
    rows,
    trigger,
    shouldTrigger = false,
    pathTriggerFieldTarget,
    watch,
    readOnly
}: Readonly<InputTextareaProps>) {

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
            control={control}
            name={name}
            defaultValue=""
            render={({ field, fieldState }) => (
                <FormItem className={cn('w-full', label ? "space-y-1" : "space-y-0")}>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Textarea
                            qa-textarea={qa}
                            disabled={disabled}
                            readOnly={readOnly}
                            placeholder={placeholder}
                            rows={rows}
                            {...field}
                            className={cn(
                                fieldState.invalid || error ? 'bg-rose-100 border-rose-500' : '',
                                'text-black'
                            )}
                        />
                    </FormControl>
                    <div className='pt-1'>
                        {
                            error
                                ? <FormMessage>
                                    {error?.replace(/"/g, '')}
                                </FormMessage>
                                : <FormMessage />
                        }
                    </div>
                </FormItem>
            )}
        />
    );
}