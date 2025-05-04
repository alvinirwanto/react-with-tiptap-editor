interface ChipProps {
    message: string;
    type: string;
}
export default function Chip({ message, type }: Readonly<ChipProps>) {

    const getTypeClassName = (type: string) => {
        switch (type) {
            case 'orange':
                return 'bg-orange-50 text-orange-500 border-orange-100';
            case 'purple':
                return 'bg-violet-50 text-violet-500 border-violet-100';
            case 'blue':
                return 'bg-blue-50 text-blue-500 border-blue-100';
            case 'green':
                return 'bg-green-100 text-green-400 border-green-200';
            case 'red':
                return 'bg-rose-50 text-rose-500 border-rose-100';
            default:
                return '';
        }
    };

    return (
        <div className={`w-full px-5 py-[8px] border-[1px] text-center text-xs font-medium rounded-sm ${getTypeClassName(type)}`}>
            {message}
        </div>
    )
}
