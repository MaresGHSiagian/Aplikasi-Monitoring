export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
        >
            {/* Wrench Icon for Monitor Bengkel */}
            <g>
                {/* Main Wrench Body */}
                <path d="M75 25c-5.5 0-10.5 2.2-14.1 5.9l-8.4 8.4c-0.8 0.8-0.8 2 0 2.8l2.8 2.8c0.8 0.8 2 0.8 2.8 0l8.4-8.4c1.5-1.5 3.5-2.3 5.5-2.3s4 0.8 5.5 2.3c1.5 1.5 2.3 3.5 2.3 5.5s-0.8 4-2.3 5.5l-8.4 8.4c-0.8 0.8-0.8 2 0 2.8l2.8 2.8c0.8 0.8 2 0.8 2.8 0l8.4-8.4C77.8 45.5 80 40.5 80 35s-2.2-10.5-5.9-14.1C70.5 27.2 67.8 25 75 25z" />

                {/* Second Wrench Body */}
                <path d="M25 75c5.5 0 10.5-2.2 14.1-5.9l8.4-8.4c0.8-0.8 0.8-2 0-2.8l-2.8-2.8c-0.8-0.8-2-0.8-2.8 0l-8.4 8.4c-1.5 1.5-3.5 2.3-5.5 2.3s-4-0.8-5.5-2.3c-1.5-1.5-2.3-3.5-2.3-5.5s0.8-4 2.3-5.5l8.4-8.4c0.8-0.8 0.8-2 0-2.8l-2.8-2.8c-0.8-0.8-2-0.8-2.8 0l-8.4 8.4C22.2 54.5 20 59.5 20 65s2.2 10.5 5.9 14.1C29.5 72.8 32.2 75 25 75z" />

                {/* Gear/Cog Element */}
                <circle
                    cx="50"
                    cy="50"
                    r="8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                />
                <circle cx="50" cy="50" r="3" />

                {/* Gear Teeth */}
                <rect x="48" y="35" width="4" height="6" rx="1" />
                <rect x="48" y="59" width="4" height="6" rx="1" />
                <rect x="35" y="48" width="6" height="4" rx="1" />
                <rect x="59" y="48" width="6" height="4" rx="1" />
                <rect
                    x="40"
                    y="40"
                    width="3"
                    height="3"
                    rx="1"
                    transform="rotate(45 41.5 41.5)"
                />
                <rect
                    x="57"
                    y="40"
                    width="3"
                    height="3"
                    rx="1"
                    transform="rotate(45 58.5 41.5)"
                />
                <rect
                    x="40"
                    y="57"
                    width="3"
                    height="3"
                    rx="1"
                    transform="rotate(45 41.5 58.5)"
                />
                <rect
                    x="57"
                    y="57"
                    width="3"
                    height="3"
                    rx="1"
                    transform="rotate(45 58.5 58.5)"
                />
            </g>
        </svg>
    );
}
