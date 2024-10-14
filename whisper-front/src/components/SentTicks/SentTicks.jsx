// This is the SVG of the sent tick
// It displays the single tick to be use by chats

const SentTicks = ({ width }) => {
    return (
        <svg fill='none' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10' width={width} preserveAspectRatio='xMidYMid meet'>
            <g clip-path='url(#clip0_215_69)'>
                <path
                    d='M8.81117 2.26445C9.06229 2.533 9.06229 2.96914 8.81117 3.23769L3.66832 8.73769C3.4172 9.00625 3.00939 9.00625 2.75827 8.73769L0.186842 5.98769C-0.0642744 5.71914 -0.0642744 5.283 0.186842 5.01445C0.437958 4.7459 0.84577 4.7459 1.09689 5.01445L3.2143 7.27676L7.90314 2.26445C8.15425 1.9959 8.56207 1.9959 8.81318 2.26445H8.81117Z'
                    fill='white'
                />
            </g>
            <defs>
                <clipPath id='clip0_215_69'>
                    <rect width='9' height='11' fill='white' />
                </clipPath>
            </defs>
        </svg>
    )
}

export default SentTicks
