import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils";
import { Control, FieldPath, FieldValues } from "react-hook-form";

interface InputRadioGroupProps<T> {
    name: FieldPath<FieldValues>;
    control: Control<any>;
    disabled?: boolean;
    qa: string;
    label?: string;
    loading?: boolean;
    listData: T[];
    renderLabel?: (item: T) => string;
    type?: string;
    direction?: "vertical" | "horizontal"
}


export default function InputRadioGroup<T>({
    name,
    control,
    disabled,
    qa,
    label,
    loading,
    listData,
    renderLabel,
    type,
    direction = 'horizontal'
}: Readonly<InputRadioGroupProps<T>>) {
    return (
        <div>
            <FormField
                control={control}
                name={name}
                defaultValue=""
                render={({ field, fieldState }) => (
                    <FormItem className={cn('w-full', label ? "space-y-1" : "space-y-0")}>
                        <FormLabel>{label}</FormLabel>
                        <FormControl className={cn(
                            type === 'input' && "h-10 flex items-center"
                        )}>
                            <RadioGroup
                                disabled={disabled}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className={cn(
                                    direction === 'horizontal'
                                        ? "flex items-center gap-5"
                                        : "flex flex-col gap-3"
                                )}
                            >
                                {listData?.map((item, index) => (
                                    <FormItem
                                        key={renderLabel ? renderLabel(item) : String(item) + index}
                                        className="flex items-center gap-2"
                                    >
                                        <FormControl>
                                            <RadioGroupItem
                                                qa-radio-option={qa}
                                                value={renderLabel ? renderLabel(item) : String(item)}
                                                className={
                                                    (fieldState.error) && "bg-rose-100 !border-rose-500"
                                                }
                                            />
                                        </FormControl>
                                        <FormLabel className={
                                            cn(
                                                (fieldState.error) && "text-rose-500",
                                                'text-sm font-normal !m-0'
                                            )
                                        }>
                                            {renderLabel ? renderLabel(item) : String(item)}
                                        </FormLabel>
                                    </FormItem>
                                ))}

                            </RadioGroup>
                        </FormControl>
                        <div className='pt-1'>
                            <FormMessage />
                        </div>
                    </FormItem>
                )}
            />
        </div>
    )
}
