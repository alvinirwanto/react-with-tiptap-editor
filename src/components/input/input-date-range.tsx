import { useState, useEffect, useRef, JSX } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { DateInput } from '@/components/ui/date-input'

import { CalendarDays, ChevronDown } from 'lucide-react'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { Control } from 'react-hook-form'

export interface DateRangePickerProps {
    /** Click handler for applying the updates from DateRangePicker. */
    onUpdate?: (values: { range: DateRange }) => void
    /** Initial value for start date */
    initialDateFrom: Date | string | undefined
    /** Initial value for end date */
    initialDateTo?: Date | string
    /** Initial value for start date for compare */
    initialCompareFrom?: Date | string
    /** Initial value for end date for compare */
    initialCompareTo?: Date | string
    /** Alignment of popover */
    align?: 'start' | 'center' | 'end'
    /** Option for locale */
    locale?: string
    /** Option for showing compare feature */
    showCompare?: boolean
    isReset?: boolean
    setIsReset?: (value: boolean) => void | undefined
    control: Control<any>
    name: string
    label: string
    disabled?: boolean
    isUpdate?: boolean
    qa: string
    disabledDate?: (date: Date) => boolean;
    description?: string;
    setIsShowDate?: (value: boolean) => void | undefined;
}

const formatDate = (date: Date, locale: string = 'en-GB'): string => {
    return date.toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

// const getDateAdjustedForTimezone = (dateInput: Date | string): Date => {
//     if (typeof dateInput === 'string') {
//         // Split the date string to get year, month, and day parts
//         const parts = dateInput.split('-').map((part) => parseInt(part, 10))
//         // Create a new Date object using the local timezone
//         // Note: Month is 0-indexed, so subtract 1 from the month part
//         const date = new Date(parts[0], parts[1] - 1, parts[2])
//         return date
//     } else {
//         // If dateInput is already a Date object, return it directly
//         return dateInput
//     }
// }

const getDateAdjustedForTimezone = (dateInput: Date | string, isToDate = false): Date => {
    let date: Date;

    if (typeof dateInput === 'string') {
        const parts = dateInput.split('-').map((part) => parseInt(part, 10));
        date = new Date(parts[0], parts[1] - 1, parts[2]);
    } else {
        date = new Date(dateInput);
    }

    // 🔥 Fix: set time to noon (safe from DST/UTC shifts)
    if (isToDate) {
        date.setHours(12, 0, 0, 0);
    } else {
        date.setHours(0, 0, 0, 0);
    }

    return date;
};


interface DateRange {
    from: Date | undefined
    to: Date | undefined
}

export default function InputDateRange({
    initialDateFrom,
    initialDateTo,
    onUpdate,
    isReset,
    setIsReset,
    align = 'start',
    locale = 'en-GB',
    control,
    disabled,
    name,
    label,
    isUpdate,
    disabledDate,
    setIsShowDate,
    description,
    qa
}: Readonly<DateRangePickerProps>): JSX.Element {
    const [isOpen, setIsOpen] = useState(false)

    // const normalizeDate = (date?: Date | string) => {
    //     if (!date) return undefined
    //     const d = new Date(date)
    //     d.setHours(0, 0, 0, 0)
    //     return d
    // }

    // const normalizedFrom = normalizeDate(initialDateFrom)
    // const normalizedTo = normalizeDate(initialDateTo)

    const [range, setRange] = useState<DateRange>({
        from: initialDateFrom ? getDateAdjustedForTimezone(initialDateFrom, true) : undefined,
        to: initialDateTo ? getDateAdjustedForTimezone(initialDateTo, true) : undefined,
    })


    // Refs to store the values of range and rangeCompare when the date picker is opened
    const openedRangeRef = useRef<DateRange | undefined>(undefined)

    const [isSmallScreen, setIsSmallScreen] = useState(
        typeof window !== 'undefined' ? window.innerWidth < 960 : false
    )

    useEffect(() => {
        const handleResize = (): void => {
            setIsSmallScreen(window.innerWidth < 960)
        }

        window.addEventListener('resize', handleResize)

        // Clean up event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const resetValues = (): void => {
        setRange({
            from:
                typeof initialDateFrom === 'string'
                    ? getDateAdjustedForTimezone(initialDateFrom, true)
                    : initialDateFrom,
            to: initialDateTo
                ? typeof initialDateTo === 'string'
                    ? getDateAdjustedForTimezone(initialDateTo, true)
                    : initialDateTo
                : typeof initialDateFrom === 'string'
                    ? getDateAdjustedForTimezone(initialDateFrom, true)
                    : initialDateFrom
        })
    }

    // Helper function to check if two date ranges are equal
    const areRangesEqual = (a?: DateRange, b?: DateRange): boolean => {
        if (!a || !b) return a === b // If either is undefined, return true if both are undefined

        const fromEqual = a.from?.getTime() === b.from?.getTime()
        const toEqual = a.to?.getTime() === b.to?.getTime()

        return fromEqual && toEqual
    }


    useEffect(() => {
        if (isOpen) {
            openedRangeRef.current = range
        }
    }, [isOpen])

    useEffect(() => {
        if (initialDateFrom) {
            const newRange = {
                from: getDateAdjustedForTimezone(initialDateFrom, true),
                to: initialDateTo
                    ? getDateAdjustedForTimezone(initialDateTo, true)
                    : undefined
            };
            setRange(newRange);
        }
    }, [initialDateFrom, initialDateTo]);


    useEffect(() => {
        if (isReset) {
            resetValues();
            setRange({
                from:
                    typeof initialDateFrom === 'string'
                        ? getDateAdjustedForTimezone(initialDateFrom, true)
                        : initialDateFrom,
                to: initialDateTo
                    ? typeof initialDateTo === 'string'
                        ? getDateAdjustedForTimezone(initialDateTo, true)
                        : initialDateTo
                    : typeof initialDateFrom === 'string'
                        ? getDateAdjustedForTimezone(initialDateFrom, true)
                        : initialDateFrom
            })

            if (setIsReset) {
                setIsReset(false);
            }

        }
    }, [isReset]);

    const [showDate, setShowDate] = useState(false)

    useEffect(() => {
        if (setIsShowDate) {
            if (showDate) {
                setIsShowDate(true)
            } else {
                setIsShowDate(false)
            }
        }
    }, [showDate, setIsShowDate])

    useEffect(() => {
        if ((initialDateFrom || initialDateTo) && !showDate) {
            setShowDate(true);
        }
    }, [initialDateFrom, initialDateTo]);


    return (
        <FormField
            control={control}
            name={name}
            defaultValue=""
            render={({ field, fieldState }) => {
                const { onChange } = field;
                useEffect(() => {
                    // if (isUpdate) {
                    field.onChange(range);
                    // }
                }, [range]);

                return (
                    <FormItem className={cn('w-full', label ? "space-y-1" : "space-y-0")}>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                            <Popover
                                // modal={true}
                                open={isOpen}
                                onOpenChange={(open: boolean) => {
                                    // if (!open) {
                                    //     resetValues()
                                    // }
                                    setIsOpen(open)
                                }}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        qa='button-date-range-trigger'
                                        disabled={disabled}
                                        variant="outline"
                                        type='button'
                                        qa-date-range-trigger={qa}
                                        className={cn(
                                            fieldState.error && "bg-rose-100 border-rose-500",
                                            'p-0 w-full flex justify-between items-center px-3'
                                        )}
                                        onClick={() => setShowDate(true)}
                                    >
                                        <div className="py-1">
                                            <div className='flex items-center gap-3'>
                                                <CalendarDays className='w-4 h-4' />
                                                <p className='mt-[2px] font-normal'>
                                                    {
                                                        field.value && showDate
                                                            ? range.from
                                                                ? `${formatDate(range.from, locale)}${range.to ? ' - ' + formatDate(range.to, locale) : ''}`
                                                                : 'Pilih Tanggal'
                                                            : isUpdate && range.from
                                                                ? `${formatDate(range.from, locale)}${range.to ? ' - ' + formatDate(range.to, locale) : ''}`
                                                                : 'Pilih Tanggal'
                                                    }
                                                </p>

                                            </div>
                                        </div>
                                        <ChevronDown className={`h-4 w-4 shrink-0 opacity-60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent
                                    align={align}
                                    className="w-auto scale-[0.85] -mt-[33px] xl:-mt-[27px] -ml-[25px] lg:-ml-[43px]"
                                    style={{
                                        maxHeight: "var(--radix-popover-content-available-height)",
                                        overflowY: "auto",
                                    }}
                                >
                                    <div className="flex py-2">
                                        <div className="flex">
                                            <div className="flex flex-col gap-4">
                                                <div className="flex flex-col lg:flex-row gap-2 justify-start items-center lg:items-start pb-4 lg:pb-0">
                                                    <div className="flex flex-col gap-2">

                                                        <div className="flex items-center gap-2">
                                                            <div className='flex flex-col gap-1'>
                                                                <span className='text-xs font-medium'>Dari</span>
                                                                <DateInput
                                                                    qa_date_input={qa}
                                                                    value={range.from}
                                                                    isDisabledDate={disabledDate}
                                                                    onChange={(date: any) => {
                                                                        const adjustedFrom = getDateAdjustedForTimezone(date, true); // 👈 adjust
                                                                        const toDate = !range.to || adjustedFrom > range.to ? adjustedFrom : range.to;

                                                                        setRange((prevRange) => ({
                                                                            ...prevRange,
                                                                            from: adjustedFrom,
                                                                            to: toDate,
                                                                        }));
                                                                        field.onChange({ ...range, from: adjustedFrom, to: toDate });
                                                                    }}
                                                                />

                                                            </div>
                                                            <div className='relative h-full flex justify-center px-2'>
                                                                <div className="absolute top-0">-</div>
                                                            </div>
                                                            <div className='flex flex-col gap-1'>
                                                                <span className='text-xs font-medium'>Sampai</span>
                                                                <DateInput
                                                                    qa_date_input={qa}
                                                                    value={range.to}
                                                                    isDisabledDate={disabledDate}
                                                                    onChange={(date: any) => {
                                                                        const adjustedTo = getDateAdjustedForTimezone(date, true); // 👈 adjust
                                                                        const fromDate = !range.from || adjustedTo < range.from ? adjustedTo : range.from;

                                                                        setRange((prevRange) => ({
                                                                            ...prevRange,
                                                                            from: fromDate,
                                                                            to: adjustedTo,
                                                                        }));
                                                                        field.onChange({ ...range, from: fromDate, to: adjustedTo });
                                                                    }}
                                                                />


                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='border rounded-md'>
                                                    <Calendar
                                                        qa_date="date-input"
                                                        mode="range"
                                                        onSelect={(value: { from?: Date, to?: Date } | undefined) => {
                                                            if (value?.from) {
                                                                const adjustedFrom = getDateAdjustedForTimezone(value.from, true);
                                                                const adjustedTo = value?.to ? getDateAdjustedForTimezone(value.to, true) : undefined;

                                                                onChange({ from: adjustedFrom, to: adjustedTo });
                                                                setRange({ from: adjustedFrom, to: adjustedTo });
                                                            }
                                                        }}

                                                        disabled={(date) => disabledDate ? disabledDate(date) : false}
                                                        selected={range}
                                                        numberOfMonths={isSmallScreen ? 1 : 2}
                                                        defaultMonth={
                                                            new Date(
                                                                new Date().setMonth(
                                                                    new Date().getMonth() - (isSmallScreen ? 0 : 1)
                                                                )
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button
                                            qa='button-cancel-calendar'
                                            onClick={() => {
                                                setIsOpen(false)
                                                resetValues()
                                            }}
                                            variant="ghost"
                                            className='h-fit'
                                            type='button'
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            qa='button-update-calendar'
                                            onClick={() => {
                                                setIsOpen(false)
                                                if (
                                                    !areRangesEqual(range, openedRangeRef.current)
                                                ) {
                                                    onUpdate?.({ range })
                                                }
                                            }}
                                            className='h-fit'
                                            type='button'
                                        >
                                            Update
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </FormControl>
                        {
                            description && (
                                <FormDescription className='text-xs'>
                                    {description}
                                </FormDescription>
                            )
                        }
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                )
            }
            }
        />
    )
}