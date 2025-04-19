import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Control } from "react-hook-form";

import { Timer } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface InputTimePickerProps {
    control: Control<any>;
    name: string;
    disabled?: boolean;
    qa: string;
    error?: string;
    label?: string;
}

export default function InputTimePicker({
    control,
    name,
    disabled,
    error,
    label,
    qa,
}: Readonly<InputTimePickerProps>) {
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);

    const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
    const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

    return (
        <FormField
            control={control}
            name={name}
            defaultValue=""
            render={({ field, fieldState }) => {
                const [hour, setHour] = useState(() => {
                    const initialValue = field.value || "";
                    return initialValue.split(":")[0];
                });

                const [minute, setMinute] = useState(() => {
                    const initialValue = field.value || "";
                    return initialValue.split(":")[1];
                });

                // Handle hour input (restricts 00-23)
                const handleHourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                    let value = event.target.value.replace(/D/g, ""); // Allow only numbers

                    if (value === "") {
                        setHour("00"); // Allow deletion
                        return;
                    }

                    if (parseInt(value) > 23) value = "23"; // Limit max value
                    if (value.length > 2) return; // Max length 2 digits

                    setHour(value);
                };

                // Handle minute input (restricts 00-59)
                const handleMinuteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                    let value = event.target.value.replace(/D/g, ""); // Allow only numbers

                    if (value === "") {
                        setMinute("00"); // Allow deletion
                        return;
                    }

                    if (parseInt(value) > 59) value = "59"; // Limit max value
                    if (value.length > 2) return; // Max length 2 digits

                    setMinute(value);
                };

                const toggleDropdown = (event: React.MouseEvent) => {
                    event.stopPropagation();
                    setShowDropdown(true);
                };

                const handleHourSelect = (selectedHour: string) => {
                    setHour(selectedHour);
                    field.onChange(`${selectedHour}:${minute}`);
                };

                const handleMinuteSelect = (selectedMinute: string) => {
                    setMinute(selectedMinute);
                    field.onChange(`${hour}:${selectedMinute}`);
                    setShowDropdown(false);
                };

                useEffect(() => {
                    if (showDropdown) {
                        setTimeout(() => {
                            const selectedHour = document.querySelector(".hours button.bg-blue-pnm");
                            const selectedMinute = document.querySelector(".minutes button.bg-blue-pnm");

                            if (selectedHour) {
                                selectedHour.scrollIntoView({ block: "center" });
                            }

                            if (selectedMinute) {
                                selectedMinute.scrollIntoView({ block: "center" });
                            }
                        }, 50);
                    }
                }, [showDropdown, hour, minute]);

                return (
                    <FormItem className={cn('w-full', label ? "space-y-1" : "space-y-0")}>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                            <Popover open={showDropdown && !disabled} onOpenChange={setShowDropdown}>
                                <PopoverTrigger asChild>
                                    <div className={cn(
                                        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
                                        (fieldState.error || error) ? 'bg-rose-100 border-rose-500' : 'bg-white border-gray-300',
                                        'h-10 flex justify-between items-center border font-medium pl-2 pr-3 py-2 w-full text-center text-sm rounded-md'
                                    )}>
                                        <div className="flex items-center">
                                            <input
                                                qa-time-picker-hour={qa}
                                                type="text"
                                                value={hour}
                                                onChange={(e) => {
                                                    setHour(e.target.value)
                                                    handleHourChange(e)
                                                }}
                                                onClick={toggleDropdown}
                                                className="w-7 px-1 py-0.5 text-center bg-transparent focus:bg-blue-pnm focus:text-white outline-none rounded-sm"
                                                placeholder="--"
                                                disabled={disabled}
                                            />
                                            <span className="mb-[1px]">:</span>
                                            <input
                                                qa-time-picker-minutes={qa}
                                                type="text"
                                                value={minute}
                                                onChange={(e) => {
                                                    setMinute(e.target.value)
                                                    handleMinuteChange(e)
                                                }}
                                                onClick={toggleDropdown}
                                                className="w-7 px-1 py-0.5 text-center bg-transparent focus:bg-blue-pnm focus:text-white outline-none rounded-sm"
                                                placeholder="--"
                                                disabled={disabled}
                                            />

                                        </div>
                                        <Timer className="h-4 w-4" />
                                    </div>
                                </PopoverTrigger>

                                <PopoverContent
                                    ref={dropdownRef}
                                    align="start"
                                    side="bottom"
                                    className="w-auto bg-white border border-gray-300 rounded-md shadow-lg flex font-medium px-1 py-2"
                                >
                                    {/* HOUR SELECTION */}
                                    <div className="hours max-h-52 flex flex-col space-y-1 overflow-y-auto border-r">
                                        {hours.map((h) => (
                                            <button
                                                key={h}
                                                type="button"
                                                className={`px-4 py-2 cursor-pointer rounded-sm mx-1.5 text-sm ${h === hour ? "bg-blue-pnm text-white" : "hover:bg-gray-200"
                                                    }`}
                                                onClick={() => handleHourSelect(h)}
                                            >
                                                {h}
                                            </button>
                                        ))}
                                    </div>

                                    {/* MINUTE SELECTION */}
                                    <div className="minutes max-h-52 flex flex-col space-y-1 overflow-y-auto">
                                        {minutes.map((m) => (
                                            <button
                                                key={m}
                                                type="button"
                                                className={`px-4 py-2 cursor-pointer rounded-sm mx-1.5 text-sm ${m === minute ? "bg-blue-pnm text-white" : "hover:bg-gray-200"
                                                    }`}
                                                onClick={() => handleMinuteSelect(m)}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </PopoverContent>
                            </Popover>
                            {/* <div className="relative w-full">
                                <div className="h-10 flex justify-between items-center border border-gray-300 font-medium px-2 py-2 w-full text-center text-sm cursor-pointer rounded-lg bg-white">
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="text"
                                            value={hour}
                                            readOnly
                                            onClick={toggleDropdown}
                                            className="w-7 px-1 py-0.5 text-center focus:bg-blue-pnm focus:text-white outline-none rounded-sm"
                                            placeholder="HH"
                                        />
                                        <span className="mb-[1px]">:</span>
                                        <input
                                            type="text"
                                            value={minute}
                                            readOnly
                                            onClick={toggleDropdown}
                                            className="w-7 px-1 py-0.5 text-center focus:bg-blue-pnm focus:text-white outline-none rounded-sm"
                                            placeholder="MM"
                                        />
                                    </div>

                                    <Timer className="h-4 w-4" />
                                </div>

                                {showDropdown && (
                                    <div
                                        ref={dropdownRef}
                                        className="absolute left-0 mt-2 py-2 pr-1 bg-white border border-gray-300 rounded-md shadow-lg flex z-[500]"
                                    >
                                        {/* HOUR SELECTION */}
                            {/* <div className="hours max-h-40 flex flex-col space-y-1 overflow-y-auto border-r">
                                            {hours.map((h) => (
                                                <button
                                                    key={h}
                                                    className={`px-4 py-2 cursor-pointer rounded-sm mx-1.5 text-sm ${h === hour ? "bg-blue-pnm text-white" : "hover:bg-gray-200"
                                                        }`}
                                                    onClick={() => handleHourSelect(h)}
                                                >
                                                    {h}
                                                </button>
                                            ))}
                                        </div> */}

                            {/* MINUTE SELECTION */}
                            {/* <div className="minutes max-h-40 flex flex-col space-y-1 overflow-y-auto">
                                            {minutes.map((m) => (
                                                <button
                                                    key={m}
                                                    className={`px-4 py-2 cursor-pointer rounded-sm mx-1.5 text-sm ${m === minute ? "bg-blue-pnm text-white" : "hover:bg-gray-200"
                                                        }`}
                                                    onClick={() => handleMinuteSelect(m)}
                                                >
                                                    {m}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>  */}
                        </FormControl>
                        <div className="pt-1">
                            {error ? (
                                <FormMessage>{error.replace(/"/g, "")}</FormMessage>
                            ) : (
                                <FormMessage />
                            )}
                        </div>
                    </FormItem>
                );
            }}
        />
    );
}
