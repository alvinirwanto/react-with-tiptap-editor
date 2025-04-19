import { Skeleton } from './skeleton';

export const SkeletonRow = ({ count }: { count: number }) => (
    <div className='flex items-center gap-4 p-3 rounded'>
        {Array.from({ length: count }).map((_, index) => (
            <Skeleton key={index + 1} className="w-full h-[25px] rounded-md bg-gray-200" />
        ))}
    </div>
);