import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Control } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface InputPasswordWithIndikatorProps {
    control: Control<any>;
    name: string;
    qa: string;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    requirements: any;
}

export default function InputPasswordWithIndikator({
    control,
    name,
    disabled,
    qa,
    label,
    placeholder,
    requirements
}: Readonly<InputPasswordWithIndikatorProps>) {
    const id = useId();
    const [password, setPassword] = useState("");
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const toggleVisibility = () => setIsVisible((prevState) => !prevState);

    const checkStrength = (pass: string) => {
        return requirements.map((req: any) => ({ met: req.regex.test(pass), text: req.text }));
    };

    const strength = checkStrength(password);
    const strengthScore = useMemo(() => strength.filter((req: any) => req.met).length, [strength]);

    const getStrengthColor = (score: number) => {
        if (score === 0) return "bg-border";
        if (score <= 1) return "bg-red-500";
        if (score <= 2) return "bg-orange-500";
        if (score <= 3) return "bg-amber-500";
        if (score <= 4) return "bg-yellow-300";
        return "bg-emerald-500";
    };

    const getStrengthText = (score: number) => {
        if (score === 0) return "Enter a password";
        if (score <= 2) return "Weak password";
        if (score === 3) return "Medium password";
        return "Strong password";
    };

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [popoverWidth, setPopoverWidth] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (containerRef.current) {
            setPopoverWidth(containerRef.current.offsetWidth);
        }
    }, []);

    useEffect(() => {
        if (strengthScore !== requirements.length) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    }, [strengthScore, requirements.length]);
    

    return (
        <FormField
            control={control}
            name={name}
            defaultValue=""
            render={({ field, fieldState }) => (
                <FormItem>
                    <Label htmlFor={id}>{label}</Label>
                    <FormControl>
                        <Popover open={strengthScore !== requirements.length}>
                            <PopoverTrigger asChild >
                                <div ref={containerRef} className="relative w-full">
                                    <Input
                                        {...field}
                                        ref={inputRef}
                                        disabled={disabled}
                                        id={id}
                                        placeholder={placeholder}
                                        type={isVisible ? "text" : "password"}
                                        qa-input={qa}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            field.onChange(e);
                                        }}
                                        aria-invalid={strengthScore < requirements?.length}
                                        aria-describedby={`${id}-description`}
                                        className={cn(
                                            fieldState.error && "bg-rose-100 !border-rose-500",
                                            "pe-9"
                                        )}
                                    />
                                    <button
                                        className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                        type="button"
                                        onClick={toggleVisibility}
                                        aria-label={isVisible ? "Hide password" : "Show password"}
                                    >
                                        {isVisible ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
                                    </button>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent
                                align="start"
                                className="mt-1"
                                style={{ width: popoverWidth }}
                            >
                                {
                                    strengthScore !== requirements.length && (
                                        <div>
                                            <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-border" role="progressbar">
                                                <div
                                                    className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
                                                    style={{ width: `${(strengthScore / requirements?.length) * 100}%` }}
                                                >
                                                </div>
                                            </div>

                                            <p id={`${id}-description`} className="mb-2 text-[13px] font-medium text-foreground">
                                                {/* {getStrengthText(strengthScore)}. Must contain: */}
                                                Password harus memiliki:
                                            </p>
                                            <ul className="space-y-1.5">
                                                {strength.map((req: any, index: number) => (
                                                    <li key={req.id} className="flex items-center gap-2">
                                                        {
                                                            req.met
                                                                ? <Check size={16} className="text-emerald-500" />
                                                                : <X size={16} className="text-muted-foreground/80" />
                                                        }
                                                        <span className={`text-xs ${req.met ? "text-emerald-600" : "text-muted-foreground/80"}`}>{req.text}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )
                                }
                            </PopoverContent>
                        </Popover>
                    </FormControl>
                </FormItem>
            )}
        />


    );
}
