import { useEffect } from 'react';
import { Control, FieldValues, FieldPath } from 'react-hook-form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

interface InputSelectProps<T> {
    name: FieldPath<FieldValues>;
    control: Control<any>;
    disabled?: boolean;
    placeholder: string;
    qa: string;
    label?: string;
    labelFilter?: string;
    isReset?: boolean;
    loading?: boolean;
    listData: T[];
    required?: boolean;
    renderLabel?: (item: T) => string;
    readOnly?:boolean;
}

export default function InputSelect<T>({
    name,
    label,
    labelFilter,
    control,
    disabled,
    placeholder,
    isReset = true,
    qa,
    listData,
    loading,
    required,
    renderLabel,
    readOnly
}: Readonly<InputSelectProps<T>>) {

    useEffect(() => {
        // Function to add custom attributes to the select and option elements
        const addCustomAttributes = () => {
            const nativeSelect = document.querySelectorAll(`select[aria-hidden="true"]`);
            nativeSelect.forEach(selectElement => {
                if (selectElement) {
                    const qaTrigger = selectElement.closest(`div`)?.querySelector(`[qa-select-trigger="${qa}"]`);
                    if (qaTrigger) {
                        selectElement.setAttribute('qa-select', qa ?? '');

                        Array.from(selectElement.querySelectorAll('option')).forEach((option, i) => {
                            option.setAttribute('qa-select-option', `${qa}-option-${i}`);
                        });
                    }
                }
            });
        };

        // Set up MutationObserver to watch for changes in the DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    addCustomAttributes();
                }
            });
        });

        // Observe changes to the body or a container where the <select> is rendered
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Initial check for existing elements
        addCustomAttributes();

        return () => {
            observer.disconnect();
        };
    }, [qa, listData]);

    return (
        <FormField
            name={name}
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
                <FormItem className={cn('w-full', label ? "space-y-1" : "space-y-0")}>
                    <FormLabel className={cn(fieldState.error && "text-destructive")}>
                        {label} {required && <span className='text-rose-500 text-base'>*</span>}
                    </FormLabel>
                    <FormControl>
                        <Select
                            disabled={disabled}
                            value={field.value ? (renderLabel ? renderLabel(field.value) : String(field.value)) : ""}
                            onValueChange={(value) => {
                                const selectedItem = listData.find(item => {
                                    return renderLabel ? renderLabel(item) === value : String(item) === value;
                                });
                                field.onChange(selectedItem ?? null);
                            }}>

                            <SelectTrigger
                                qa-select-trigger={qa}
                                className={cn(
                                    readOnly && 'pointer-events-none',
                                    fieldState.error && "bg-rose-100 border-rose-500",
                                    'relative'
                                )}
                            >
                                <SelectValue placeholder={placeholder} />
                                {
                                    labelFilter && (
                                        <span className='absolute -top-[11px] left-2 text-[11px] bg-white px-1 text-gray-500'>
                                            {labelFilter}
                                        </span>
                                    )
                                }
                            </SelectTrigger>

                            <SelectContent
                                qa-select={qa}
                                className='max-h-[250px] relative'
                            >
                                {listData?.map((item, index) => (
                                    <SelectItem
                                        qa-select-option={qa}
                                        data-custom-attribute="value1"
                                        className='cursor-pointer py-2'
                                        key={renderLabel ? renderLabel(item === '' ? ('-' as T) : item) : String(item === '' ? '-' : item) + index}
                                        value={renderLabel ? renderLabel(item === '' ? ('-' as T) : item) : String(item === '' ? '-' : item)}
                                    >
                                        {
                                            renderLabel
                                                ? renderLabel(item === '' ? ('-' as T) : item)
                                                : String(item === '' ? '-' : item)
                                        }
                                    </SelectItem>
                                ))}
                                {
                                    isReset && (
                                        <div className="p-1 fixed top-1 right-1">
                                            <Button
                                                qa={`${qa}-reset`}
                                                type="button"
                                                onClick={() => field.onChange(null)}
                                                className="w-fit h-fit text-xs py-[7px] px-4 rounded-sm flex gap-1 bg-rose-100 border-px border-rose-200 text-rose-500 hover:bg-rose-500 hover:text-white"
                                            >
                                                <X className='h-4 w-4' />
                                                Reset
                                            </Button>
                                        </div>
                                    )
                                }
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <div className="pt-1">
                        <FormMessage />
                    </div>
                </FormItem>
            )}
        />
    );
}
