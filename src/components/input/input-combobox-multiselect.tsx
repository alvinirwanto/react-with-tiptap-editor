import { ArrowUpRight, Check, ChevronsUpDown, LoaderCircle, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useRef, useState } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import ModalChildren from "../modals/modal-children";

interface InputComboboxMultipleSelectProps<T> {
    name: FieldPath<FieldValues>;
    label?: string;
    disabled?: boolean;
    control: Control<any>;
    loading?: boolean;
    placeholder?: string;
    placeholderInput?: string;
    noDataPlaceholder?: string;
    qa: string;
    listData: any;
    renderLabel: (item: T) => string;
    compareFn?: (item: T, value: T | null) => boolean; // Function to compare item with the current value
    onInputChange?: (inputValue: string) => void;
    maxVisibleBadges?: number;
    titleModal?: string;
    showBadges?:boolean;
}
export default function InputComboboxMultipleSelect<T>({
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
    compareFn,
    showBadges = true,
    maxVisibleBadges = 5,
    titleModal = 'List Peserta Terpilih'
}: Readonly<InputComboboxMultipleSelectProps<T>>) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [openCombobox, setOpenCombobox] = useState(false);
    const [inputValue, setInputValue] = useState<string>("");
    const [selectedValues, setSelectedValues] = useState<any[]>([]);

    const toggleFramework = (item: T | string, field: any) => {
        setSelectedValues((current) => {
            const exists = current.some((selected) =>
                typeof item === "string"
                    ? selected === item
                    : compareFn?.(selected, item)
            );

            let updatedValues;
            if (exists) {
                updatedValues = current.filter((selected) =>
                    typeof item === "string"
                        ? selected !== item
                        : !compareFn?.(selected, item)
                );
            } else {
                updatedValues = [...current, item];
            }

            field.onChange(updatedValues); // Ensure form state is updated
            return updatedValues;
        });
    };



    const onComboboxOpenChange = (value: boolean) => {
        inputRef.current?.blur();
        setOpenCombobox(value);
    };

    const resetValues = (field: any) => {
        // Reset the local selected values state
        setSelectedValues([]);

        // Reset the form state
        field.onChange([]);
    };


    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (openCombobox === false) {
            setInputValue('')
            setSelectedValues([])
        }
    }, [open])

    const [showAll] = useState(false);

    const [modalViewAllOpen, setModalViewAllOpen] = useState(false)

    return (
        <FormField
            name={name}
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => {

                useEffect(() => {
                    setSelectedValues(field.value || []);
                }, [field.value]);

                return (
                    <FormItem className={cn('w-full', label ? "space-y-1" : "space-y-0")}>
                        <FormLabel className={cn(fieldState.error && "text-destructive")}>
                            {label}
                        </FormLabel>
                        <FormControl>
                            <div className="w-full">
                                <Popover open={openCombobox} onOpenChange={onComboboxOpenChange}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            qa={qa}
                                            variant="outline"
                                            ref={buttonRef}
                                            role="combobox"
                                            aria-expanded={openCombobox}
                                            disabled={disabled}
                                            className={cn(
                                                fieldState.error && "bg-rose-100 border-rose-500",
                                                "w-full justify-between font-normal px-3 disabled:opacity-90 disabled:cursor-not-allowed"
                                            )}
                                        >
                                            <span className="truncate">
                                                {selectedValues.length === 0 && placeholder}
                                                {selectedValues.length === 1 && renderLabel(selectedValues[0])}
                                                {selectedValues.length === 2 &&
                                                    selectedValues.map((item) => renderLabel(item)).join(", ")}

                                                {selectedValues.length > 2 &&
                                                    `${selectedValues.length} data selected`}
                                            </span>
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        side="bottom"
                                        align="start"
                                        className="p-0 z-[999] pointer-events-auto h-full"
                                        style={{ width: buttonRef.current?.offsetWidth }}
                                    >
                                        <Command loop>
                                            <CommandInput
                                                ref={inputRef}
                                                placeholder={placeholderInput}
                                                value={inputValue}
                                                onValueChange={(value) => {
                                                    setInputValue(value);
                                                    onInputChange?.(value); // Call the `onInputChange` prop if provided
                                                }}
                                            />

                                            <CommandList>
                                                {
                                                    loading
                                                        ? <div className="w-full !h-[150px] flex justify-center items-center">
                                                            <LoaderCircle className='animate-spin' />
                                                        </div>
                                                        : <>
                                                            <CommandEmpty>{noDataPlaceholder ?? 'Data tidak ditemukan'}</CommandEmpty>
                                                            <CommandGroup className="max-h-[250px] overflow-auto relative">
                                                                {listData.map((item: T, index: number) => {
                                                                    const isActive = selectedValues.some((selected) => compareFn?.(selected, item));
                                                                    return (
                                                                        <CommandItem
                                                                            key={index || `index-${index}`}
                                                                            value={renderLabel(item)}
                                                                            onSelect={() => toggleFramework(item, field)}  // Pass `field` here
                                                                        >

                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    isActive ? "opacity-100" : "opacity-0",
                                                                                )}
                                                                            />
                                                                            <div className="flex-1">{renderLabel(item)}</div>
                                                                        </CommandItem>
                                                                    );
                                                                })}
                                                                <div className="p-1 fixed top-1 right-2">
                                                                    <Button
                                                                        qa={`${qa}-reset`}
                                                                        type="button"
                                                                        onClick={() => resetValues(field)}
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
                                {
                                    (selectedValues.length > 0 && showBadges) && (
                                        <div className="mt-3 max-h-24 overflow-y-auto flex flex-wrap w-full items-center">
                                            {(showAll ? selectedValues : selectedValues.slice(0, maxVisibleBadges)).map((item: any, index: number) => (
                                                <Badge
                                                    key={item.id || `index-${index}`}
                                                    variant="outline"
                                                    className="transition-all duration-300 mr-2 mb-3 bg-blue-100 text-blue-500 hover:bg-orange-100 hover:text-orange-500 px-4 py-[5px] text-[13px] group flex-shrink-0"
                                                >
                                                    <span>{renderLabel(item)}</span>
                                                    {
                                                        !disabled && (
                                                            <button
                                                                disabled={disabled}
                                                                type="button"
                                                                onClick={() => {
                                                                    // Remove the item from selectedValues
                                                                    const updatedSelectedValues = selectedValues.filter((selected) => !compareFn?.(selected, item));

                                                                    // Update local state
                                                                    setSelectedValues(updatedSelectedValues);

                                                                    // Update form state
                                                                    field.onChange(updatedSelectedValues);
                                                                }}
                                                                className="ml-2 text-orange-500 hover:text-rose-500 hidden group-hover:block"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                        )
                                                    }
                                                </Badge>
                                            ))}
                                            {selectedValues.length > maxVisibleBadges && !showAll && (
                                                <button
                                                    type="button"
                                                    onClick={() => setModalViewAllOpen(true)}
                                                >
                                                    <Badge
                                                        className="cursor-pointer w-fit flex items-center gap-2 transition-all duration-300 mr-2 mb-3 bg-white border-blue-500 text-blue-500 hover:bg-blue-100 px-4 py-[5px] text-[13px] group"
                                                    >
                                                        Lihat Semua
                                                        <ArrowUpRight className="h-4 w-4" />
                                                    </Badge>
                                                </button>
                                            )}
                                        </div>
                                    )
                                }


                                {/* Detail Modal */}
                                <ModalChildren
                                    isOpen={modalViewAllOpen}
                                    onClose={() => setModalViewAllOpen(false)}
                                    title={titleModal}
                                >
                                    <div className="my-4 flex flex-wrap items-center gap-4">
                                        {selectedValues.map((item: any) => (
                                            <Badge
                                                key={item.id}
                                                variant="outline"
                                                className="transition-all duration-300 bg-blue-100 text-blue-500 hover:bg-orange-100 hover:text-orange-500 px-4 py-[5px] text-[13px] group flex-shrink-0"
                                            >
                                                <span>{renderLabel(item)}</span>
                                                {
                                                    !disabled && (
                                                        <button
                                                            disabled={disabled}
                                                            type="button"
                                                            onClick={() => {
                                                                const updatedSelectedValues = selectedValues.filter((selected) => !compareFn?.(selected, item));
                                                                setSelectedValues(updatedSelectedValues);

                                                                // Update form state
                                                                field.onChange(updatedSelectedValues);
                                                            }}
                                                            className="ml-2 text-orange-500 hover:text-rose-500 hidden group-hover:block"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    )
                                                }
                                            </Badge>
                                        ))}
                                    </div>
                                </ModalChildren>

                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )
            }}
        />
    );
}
