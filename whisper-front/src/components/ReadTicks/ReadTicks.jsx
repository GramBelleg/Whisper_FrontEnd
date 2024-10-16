// This is the SVG of the Read tick
// It displays the double ticks of read messages

const ReadTicks = () => {
    return (
        <div className='read-ticks'>
            <svg
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 12 12'
                width='50%'
                height='50%'
                preserveAspectRatio='xMidYMid meet'
            >
                <path d='M1 3.55102L3.78226 6L8.5 1' stroke='#4CB9CF' stroke-linecap='round' stroke-linejoin='round' />
                <path d='M6 3.55102L8.78226 6L13.5 1' stroke='#4CB9CF' stroke-linecap='round' stroke-linejoin='round' />
            </svg>
        </div>
    )
}

export default ReadTicks
