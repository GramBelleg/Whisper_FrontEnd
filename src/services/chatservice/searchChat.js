import axiosInstance from "../axiosInstance";
export const handleSearchChat = async ( query, chatId ) => {
    try
    {
      const response = await axiosInstance.get(`/api/messages/${chatId}/getMessages`);
    
      const messages = response.data.messages;

      const filteredMessages = messages.filter((message) =>
        message.content.toLowerCase().includes(query.toLowerCase())
      );
  
      return filteredMessages;
      // const mockData = [
      //   {
      //     id: 1,
      //     chatId: 1,
      //     sender: "Alice",
      //     content: "Hello, Bob!",
      //     sentAt: "2022-01-01T12:00:00Z",
      //     isPinned: false,
      //   },
      //   {
      //     id: 2,
      //     chatId: 1,
      //     sender: "Bob",
      //     content: "Hi, Alice!",
      //     sentAt: "2022-01-01T12:01:00Z",
      //     isPinned: false,
      //   },
      // ];
      // return mockData;
    }
    catch(error)
    {
      console.error("Error searching chat:", error);
    }
}