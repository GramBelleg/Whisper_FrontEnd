// This fucntion adjusts the time of the last message
// If it is today it displays hour
//  If it is yesterday it displays yesterday
//  If it is older than yesterday it displays the date

export const checkDisplayTime = (lastMessageTime) => {
    // Get today's date
    const today = new Date()

    // Get yesterday's date
    const yesterday = new Date(today.getTime() - 86400000)

    // Extract the last message time
    const lastMessageDate = new Date(lastMessageTime)

    // Get the difference to compare
    const timeDiff = Math.abs(today.getTime() - lastMessageDate.getTime())

    // Scale to get the days
    const timeDiffInDays = Math.floor(timeDiff / 86400000)

    // If the time is today
    if (timeDiffInDays === 0) {
        const hours = lastMessageDate.getHours() // get hours
        const minutes = lastMessageDate.getMinutes() // get minutes
        return `${hours}:${minutes}` // return hour:minutes
    } else if (timeDiffInDays === 1) {
        return 'Yesterday'
    } else {
        // Return the date in the format "DD MM YYYY"
        const day = String(lastMessageDate.getDate()).padStart(2, '0') // Ensure two digits for the day
        const month = String(lastMessageDate.getMonth() + 1).padStart(2, '0') // Ensure two digits for the month
        const year = lastMessageDate.getFullYear() // Get the full year
        return `${day}:${month}:${year}` // Return formatted date
    }
}
