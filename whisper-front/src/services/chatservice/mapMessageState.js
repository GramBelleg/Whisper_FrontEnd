// Function to map message_state values
export const mapMessageState = (state) => {
    switch (state) {
        case 'delivered':
            return 1
        case 'read':
            return 2
        case 'sent':
            return 0
        default:
            return -1 // null
    }
}
