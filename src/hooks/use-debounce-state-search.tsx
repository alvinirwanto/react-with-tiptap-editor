import { useState, useRef, useEffect } from "react";

export default function useDebouncedState(initialValue: string, delay = 500) {
    const [value, setValue] = useState(initialValue);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        debounceRef.current = setTimeout(() => {
            setValue((prev) => prev || ""); // Ensure 'a' is set if value is empty
        }, delay);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []); // Runs only on mount

    const setDebouncedValue = (newValue: string) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setValue(newValue || "");
        }, delay);
    };

    return [value, setDebouncedValue] as const;
}
