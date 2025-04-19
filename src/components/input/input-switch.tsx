import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Control } from "react-hook-form"
import { Switch } from "../ui/switch"
import { cn } from "@/lib/utils" 
import { Label } from "../ui/label"

interface InputSwitchProps {
    control: Control<any>
    name: string
    description?: string
    label?: string
    activeLabel?: string
    inactiveLabel?: string
    disabled?: boolean
    qa: string
    onChange?: (checked: boolean) => void; // Add onChange prop
}

export default function InputSwitch({
    control,
    name,
    description,
    label,
    activeLabel = "Active",
    inactiveLabel = "Inactive",
    disabled = false,
    qa,
    onChange, // Use onChange prop
}: Readonly<InputSwitchProps>) {
    
    return (
        <FormField
            control={control}
            name={name}
            defaultValue=""
            render={({ field, fieldState }) => (
                <FormItem className={cn('w-full', label ? "space-y-1" : "space-y-0")}>
                    {label && <FormLabel>{label}</FormLabel>}

                    <FormControl>
                        <div className="flex items-center gap-4">
                            <Switch
                                id={name}
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                    field.onChange(checked);  // Update the field value
                                    if (onChange) {
                                        onChange(checked); // Call onChange if defined
                                    }
                                }}
                                disabled={disabled}
                                qa-switch={qa || `qa-switch-${name}`}
                                {...field}
                            />

                            <Label
                                htmlFor={name}
                                className={cn(
                                    "font-medium text-sm",
                                    field.value ? "text-black" : "text-gray-400"
                                )}>
                                {field.value ? activeLabel : inactiveLabel}
                            </Label>
                        </div>
                    </FormControl>

                    {description && (
                        <FormDescription className="text-xs">{description}</FormDescription>
                    )}

                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
