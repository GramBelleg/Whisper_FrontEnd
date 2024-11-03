// Function to map message_state values
export const mapMessageState = (state) => {
  switch (state) {
    case "sent":
      return 0;
    case "delivered":
      return 1;
    case "read":
      return 2;
    case "deleted":
      return 3;
    case "pending":
      return  4;
    default:
      return -1; // null
  }
};
