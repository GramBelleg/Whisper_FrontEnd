import profilePicture from "../assets/images/Grambell.png"
export const loginResponse = {
    userId: 1,
    email: 'mock@gmail.com',
    token: 'fake-jwt-token',
};

export const signupResponse = {
    message: 'User registered successfully!',
};

export const uploadLink = {
    //"presignedUrl": "https://whisperblob.blob.core.windows.net/container1/1729533525359.webm?sv=2024-11-04&se=2024-10-31T17%3A58%3A45Z&sr=b&sp=cw&sig=O7i3HqNUk%2FKbUNguPPZ9yje4%2FeAXdFjE8z%2BQ%2FEwI2AE%3D",
    "presignedUrl": "/api/container1/1729533525359.webm?sv=2024-11-04&se=2024-10-31T17%3A58%3A45Z&sr=b&sp=cw&sig=O7i3HqNUk%2FKbUNguPPZ9yje4%2FeAXdFjE8z%2BQ%2FEwI2AE%3D",

    "blobName": "1729533525359.webm"
  }
export const downloadLink = {
    //"presignedUrl": "https://whisperblob.blob.core.windows.net/container1/1729533525359.webm?sv=2024-11-04&se=2024-10-31T17%3A59%3A36Z&sr=b&sp=r&sig=ClsWyg9wRIBLvHqoIB7RsEEjR7%2BbpH7gcw8hwhxktKU%3D"
    "presignedUrl": "/api/container1/1729533525359.webm?sv=2024-11-04&se=2024-10-31T17%3A59%3A36Z&sr=b&sp=r&sig=ClsWyg9wRIBLvHqoIB7RsEEjR7%2BbpH7gcw8hwhxktKU%3D"
}

export const storiesData = [
    {userId: 1, user:"amr", profilePicture: profilePicture, seen: true, date: "1/2/2022", content: "hello from amr"},
    {userId: 2, user:"zeyad", profilePicture: profilePicture, seen: false, date: "1/2/2022", content: "hello from zeyad"},
    {userId: 3, user:"ziad", profilePicture: profilePicture, seen: true, date: "1/2/2022", content: "hello from ziad"},
    {userId: 4, user:"fatma", profilePicture: profilePicture, seen: false, date: "1/2/2022", content: "hello from fatma"},
    {userId: 5, user:"hana", profilePicture: profilePicture, seen: true, date: "1/2/2022", content: "hello from hana"},
    {userId: 6, user:"amr", profilePicture: profilePicture, seen: true, date: "1/2/2022", content: "hello from amr"},
    {userId: 7, user:"zeyad", profilePicture: profilePicture, seen: false, date: "1/2/2022", content: "hello from zeyad"},
    {userId: 8, user:"ziad", profilePicture: profilePicture, seen: true, date: "1/2/2022", content: "hello from ziad"},
    {userId: 9, user:"fatma", profilePicture: profilePicture, seen: false, date: "1/2/2022", content: "hello from fatma"},
    {userId: 10, user:"hana", profilePicture: profilePicture, seen: true, date: "1/2/2022", content: "hello from hana"},
]; 
