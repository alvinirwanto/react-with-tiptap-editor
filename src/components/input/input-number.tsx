import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Control } from 'react-hook-form';

import { NumericFormat, NumericFormatProps } from 'react-number-format';

interface InputNumberProps extends NumericFormatProps {
    control: Control<any>;
    name: string;
    description?: string;
    qa: string;
    error?: string;
    label?: string;
    className?: string;
    disabled?: boolean;
    required?: boolean;
    readOnly?: boolean;
    showError?: boolean;
    isCenter?: boolean;
}


export default function InputNumber({
    control,
    name,
    description,
    disabled,
    qa,
    error,
    label,
    showError = true,
    required,
    isCenter,
    className,
    ...props
}: Readonly<InputNumberProps>) {


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
                            <NumericFormat
                                {...props}
                                value={field.value}
                                onValueChange={(values) => {
                                    field.onChange(values.floatValue ?? '');
                                }}
                                customInput={Input}
                                disabled={disabled}
                                className={cn(
                                    (fieldState.error || error) && "bg-rose-100 !border-rose-500",
                                    isCenter && 'text-center',
                                    'text-black',
                                    className
                                )}
                            />

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
