// This is the SVG of the muted notification

const NotificationBell = () => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 12 12'
            width='50%'
            height='50%'
            preserveAspectRatio='xMidYMid meet'
            className='bell'
        >
            <g clipPath='url(#clip0_215_71)'>
                <path
                    d='M0.727361 0.119312C0.532361 -0.0728755 0.249236 -0.0283442 0.0954863 0.215406C-0.0582637 0.459156 -0.0226387 0.813062 0.172361 1.00525L11.2724 11.8802C11.4674 12.0724 11.7505 12.0279 11.9042 11.7842C12.058 11.5404 12.0224 11.1865 11.8274 10.9943L10.1361 9.33728C10.1399 9.32791 10.1436 9.31619 10.1474 9.30681C10.2449 9.03728 10.2055 8.72087 10.048 8.50056L9.90924 8.30603C9.32424 7.48103 8.99986 6.41931 8.99986 5.31541V4.87478C8.99986 3.06072 7.96861 1.54666 6.59986 1.19978V0.749781C6.59986 0.334937 6.33174 -0.00021921 5.99986 -0.00021921C5.66799 -0.00021921 5.39986 0.334937 5.39986 0.749781V1.19978C4.60111 1.40134 3.91861 2.00134 3.48736 2.824L0.727361 0.119312ZM7.61611 9.74978L2.99986 5.20525V5.31775C2.99986 6.41931 2.67549 7.48337 2.09049 8.30837L1.95174 8.5029C1.79424 8.72322 1.75674 9.03963 1.85236 9.30916C1.94799 9.57869 2.16361 9.74978 2.39986 9.74978H7.61611ZM6.84924 11.5615C7.07424 11.2802 7.19986 10.8982 7.19986 10.4998H5.99986H4.79986C4.79986 10.8982 4.92549 11.2802 5.15049 11.5615C5.37549 11.8427 5.68111 11.9998 5.99986 11.9998C6.31861 11.9998 6.62424 11.8427 6.84924 11.5615Z'
                    fill='#4CB9CF'
                />
            </g>
            <defs>
                <clipPath id='clip0_215_71'>
                    <rect width='12' height='12' fill='white' />
                </clipPath>
            </defs>
        </svg>
    )
}

export default NotificationBell
