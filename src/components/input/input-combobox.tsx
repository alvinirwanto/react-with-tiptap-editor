import { Check, ChevronsUpDown, LoaderCircle, Plus, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useRef, useState } from "react"
import { Control, FieldPath, FieldValues } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"

interface InputComboboxProps<T> {
    name: FieldPath<FieldValues>;
    label?: string;
    disabled?: boolean;
    control?: Control<any>;
    loading?: boolean;
    placeholder?: string;
    placeholderInput?: string;
    noDataPlaceholder?: string;
    qa: string;
    listData: T[];
    required?: boolean;
    renderLabel: (item: T) => string;
    compareFn: (item: T, value: T | null) => boolean; // Function to compare item with the current value
    onInputChange?: (inputValue: string) => void;
    readOnly?: boolean;
    addNewItem?: any;
    addNewItemFn?: () => void;
}
export default function InputCombobox<T>({
    name,
    control,
    disabled,
    loading,
    qa,
    label,
    placeholder,
    placeholderInput,
    noDataPlaceholder,
    listData,
    onInputChange,
    renderLabel,
    required,
    compareFn,
    readOnly,
    addNewItem,
    addNewItemFn
}: Readonly<InputComboboxProps<T>>) {
    const [open, setOpen] = useState(false)
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (value: string) => {
        setInputValue(value);
        if (onInputChange) {
            onInputChange(value);
        }
    };

    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (open === false) {
            setInputValue('')
        }
    }, [open])

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
                        <Popover open={open} onOpenChange={setOpen} >
                            <PopoverTrigger asChild >
                                <Button
                                    ref={buttonRef}
                                    qa={qa}
                                    variant="outline"
                                    disabled={loading || disabled}
                                    aria-expanded={open}
                                    className={cn(
                                        readOnly && 'pointer-events-none',
                                        fieldState.error && "bg-rose-100 border-rose-500",
                                        "w-full justify-between font-normal px-3 disabled:opacity-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    )}
                                >
                                    {field.value && Object.keys(field.value).length > 0
                                        ? renderLabel
                                            ? renderLabel(field.value)
                                            : String(field.value)
                                        : placeholder}

                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                side="bottom"
                                align="start"
                                className="p-0 z-[999] pointer-events-auto h-full"
                                style={{ width: buttonRef.current?.offsetWidth }}
                            >
                                <Command className="!max-h-[300px]">
                                    <CommandInput
                                        qa-combobox-input={qa}
                                        placeholder={placeholderInput}
                                        value={inputValue}
                                        onValueChange={handleInputChange}
                                        className="pointer-events-auto"
                                        onMouseDown={(e) => e.stopPropagation()} // Prevent modal or other elements from blocking interaction
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <CommandList
                                        qa-combobox-list={qa}
                                    >
                                        {
                                            loading
                                                ? <div className="w-full !h-[150px] flex justify-center items-center">
                                                    <LoaderCircle className='animate-spin' />
                                                </div>
                                                : <>
                                                    <CommandEmpty>{noDataPlaceholder ?? 'Data tidak ditemukan'}</CommandEmpty>
                                                    <CommandGroup className="relative max-h-[250px] overflow-auto">
                                                        {listData.map((item, index) => (
                                                            <CommandItem
                                                                qa-combobox-option={item + String(index)}
                                                                className="cursor-pointer py-2"
                                                                key={renderLabel ? renderLabel(item) + index : String(item) + index}
                                                                value={renderLabel ? renderLabel(item) : String(item)}
                                                                onSelect={() => {
                                                                    const selectedItem = renderLabel ? listData.find((listItem) =>
                                                                        renderLabel(listItem) === renderLabel(item)
                                                                    ) : item;

                                                                    field.onChange(selectedItem && compareFn(selectedItem, field.value) ? null : selectedItem);
                                                                    setOpen(false);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        compareFn(item, field.value) ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {
                                                                    renderLabel
                                                                        ? renderLabel(item === '' ? ('-' as T) : item)
                                                                        : String(item === '' ? '-' : item)
                                                                }
                                                            </CommandItem>
                                                        ))}
                                                        {
                                                            addNewItem && (
                                                                <>
                                                                    <CommandSeparator className="my-1" />
                                                                    <CommandItem
                                                                        onSelect={addNewItemFn}
                                                                        className="cursor-pointer"
                                                                    >
                                                                        <Plus className='h-4 w-4 mr-2' />
                                                                        Tambah Baru
                                                                    </CommandItem>
                                                                </>
                                                            )
                                                        }

                                                        <div className="p-1 fixed top-1 right-2">
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
                                                    </CommandGroup>
                                                </>
                                        }

                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </FormControl>
                    <div className="pt-1">
                        <FormMessage />
                    </div>
                </FormItem>
            )}
        />
    )
}
