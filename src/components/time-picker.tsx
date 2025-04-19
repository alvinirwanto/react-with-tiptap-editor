import { Timer } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

const TimePicker = () => {
    const [hour, setHour] = useState("--");
    const [minute, setMinute] = useState("--");
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
    const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

    // Toggle dropdown on input click
    const toggleDropdown = (event: React.MouseEvent) => {
        event.stopPropagation();
        setShowDropdown(!showDropdown);
    };

    // Handle hour input (restricts 00-23)
    const handleHourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value.replace(/D/g, ""); // Allow only numbers

        if (value === "") {
            setHour(""); // Allow deletion
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
            setMinute(""); // Allow deletion
            return;
        }

        if (parseInt(value) > 59) value = "59"; // Limit max value
        if (value.length > 2) return; // Max length 2 digits

        setMinute(value);
    };

    // Handle hour selection
    const handleHourSelect = (selectedHour: string) => {
        setHour(selectedHour);
    };

    // Handle minute selection
    const handleMinuteSelect = (selectedMinute: string) => {
        setMinute(selectedMinute);
        setShowDropdown(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    useEffect(() => {
        if (showDropdown && dropdownRef.current) {
            const selectedHour = dropdownRef.current.querySelector(".hours button.bg-blue-pnm");
            const selectedMinute = dropdownRef.current.querySelector(".minutes button.bg-blue-pnm");
    
            if (selectedHour) {
                selectedHour.scrollIntoView({ block: "center" });
            }
    
            if (selectedMinute) {
                selectedMinute.scrollIntoView({ block: "center" });
            }
        }
    }, [showDropdown, hour, minute]);
    

    return (
        <div className="relative inline-block w-full">
            <div className="h-10 flex justify-between items-center border border-gray-300 font-medium px-2 py-2 w-full text-center text-sm cursor-pointer rounded-lg bg-white">
                <div className="flex items-center gap-1">
                    <input
                        type="text"
                        value={hour}
                        onChange={handleHourChange}
                        onClick={toggleDropdown}
                        className="w-7 px-1 py-0.5 text-center focus:bg-blue-pnm focus:text-white outline-none rounded-sm"
                        maxLength={2}
                        placeholder="HH"
                    />
                    <span className="mb-[1px]">:</span>
                    <input
                        type="text"
                        value={minute}
                        onChange={handleMinuteChange}
                        onClick={toggleDropdown}
                        className="w-7 px-1 py-0.5 text-center focus:bg-blue-pnm focus:text-white outline-none rounded-sm"
                        maxLength={2}
                        placeholder="MM"
                    />
                </div>

                <Timer className="h-4 w-4" />
            </div>

            {showDropdown && (
                <div ref={dropdownRef} className="absolute left-0 mt-2 py-2 pr-1 bg-white border border-gray-300 rounded-md shadow-lg flex z-[500]">
                    {/* HOUR SELECTION */}
                    <div className="hours max-h-40 flex flex-col space-y-1 overflow-y-auto border-r">
                        {hours.map((h) => (
                            <button
                                key={h}
                                className={`px-4 py-2 cursor-pointer rounded-sm mx-1.5 text-sm ${h === hour ? "bg-blue-pnm text-white" : "hover:bg-gray-200"}`}
                                onClick={() => handleHourSelect(h)}
                            >
                                {h}
                            </button>
                        ))}
                    </div>

                    {/* MINUTE SELECTION */}
                    <div className="minutes max-h-40 flex flex-col space-y-1 overflow-y-auto">
                        {minutes.map((m) => (
                            <button
                                key={m}
                                className={`px-4 py-2 cursor-pointer rounded-sm mx-1.5 text-sm ${m === minute ? "bg-blue-pnm text-white" : "hover:bg-gray-200"}`}
                                onClick={() => handleMinuteSelect(m)}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimePicker;
