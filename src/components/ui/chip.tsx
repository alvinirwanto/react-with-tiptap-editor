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
                return 'bg-green-50 text-green-400 border-green-100';
            case 'red':
                return 'bg-rose-50 text-rose-500 border-rose-100';
            default:
                return '';
        }
    };

    return (
        <div className={`min-w-[70px] px-5 py-[6px] border-[1px] text-center text-xs font-medium rounded-full ${getTypeClassName(type)}`}>
            {message}
        </div>
    )
}
