interface CircularProgressProps {
    percentage: number;
    circleWidth: number;
    color?: string;
}
export default function CircularProgress({
    percentage,
    circleWidth,
    color
}: Readonly<CircularProgressProps>) {
    const radius = 85;
    const dashArray = radius * Math.PI * 2;
    const dashOffset = percentage >= 100
        ? dashArray + (dashArray * 100) / 100
        : dashArray + (dashArray * percentage) / 100;

    return (
        <div
            style={{
                width: `${circleWidth}px`, // Parent container width
                height: `${circleWidth}px`, // Parent container height
            }}
        >
            <svg
                viewBox={`0 0 ${circleWidth + 30} ${circleWidth + 30}`} // Add padding for stroke
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
                style={{ overflow: "visible" }} // Ensure SVG overflow is not clipped
            >
                <defs>
                    <linearGradient id={`gradient-${color?.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.1" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.7" />
                    </linearGradient>
                </defs>

                <circle
                    cx={(circleWidth + 30) / 2}
                    cy={(circleWidth + 30) / 2}
                    strokeWidth="17px"
                    r={radius}
                    className="fill-none"
                    style={{
                        stroke: `url(#gradient-${color?.replace(/[^a-zA-Z0-9]/g, '')})`, // Use sanitized id here
                    }}
                />


                {/* Progress circle */}
                <circle
                    cx={(circleWidth + 30) / 2} // Adjust for padding
                    cy={(circleWidth + 30) / 2} // Adjust for padding
                    strokeWidth="17px"
                    r={radius}
                    className="circle-progress fill-none"
                    style={{
                        stroke: `${percentage < 0
                            ? '#f43f5e'
                            : color
                            }`,
                        strokeDasharray: dashArray,
                        strokeDashoffset: dashOffset,
                        transition: "stroke-dashoffset 0.3s ease",
                    }}
                    transform={`rotate(90 ${(circleWidth + 30) / 2} ${(circleWidth + 30) / 2})`}
                />

                {/* Text in the center */}
                <text
                    x="50%"
                    y="50%"
                    dy="0.3em"
                    textAnchor="middle"
                    style={{ fill: `${color}` }}
                    className="text-[40px] font-bold"
                >
                    {percentage > 0 ? '+' : ''}{percentage}%
                </text>
            </svg>
        </div>
    );
}
