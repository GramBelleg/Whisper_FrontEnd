import React, { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import "./SearchSideBar.css";
import { useModal } from "@/contexts/ModalContext";
import ErrorMesssage from "../ErrorMessage/ErrorMessage";
import { useWhisperDB } from "@/contexts/WhisperDBContext";
import ChatItem from "../ChatItem/ChatItem";
import ChatMessage from "../ChatMessage/ChatMessage";
import { useChat } from "@/contexts/ChatContext";
import { useSidebar } from "@/contexts/SidebarContext";

const SearchSideBar = () => {
    const [activeFilters, setActiveFilters] = useState([false, false, false, false])
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const { openModal, closeModal } = useModal()
    const { dbRef } = useWhisperDB()
    const { selectChat, handlePinnedClick, searchChat } = useChat()
    const { setActivePage } = useSidebar()

    const handleSearchMessageClick = async (result) => {
        setActivePage('chat')
        try {
            console.log(result)
            const chat = await dbRef.current.getChat(result.chatId)
            selectChat({...chat})
            handlePinnedClick(result.id)
        } catch (error) {
            console.log(error)
        }
    }

    const toggleFilter = (index) => {
        const updatedFilters = [...activeFilters];
        updatedFilters[index] = !updatedFilters[index];
        setActiveFilters(updatedFilters);
    };

    const test = async () => {
        if (activeFilters[0]) {
            // TODO: make the API call
            try {
                const chats = await dbRef.current.getChats()
                setSearchResults(chats)
            } catch (error) {
                console.log(error)
            }
        }
        else if (activeFilters[1] || activeFilters[2] || activeFilters[3]) {
            // TODO: make the API call
            try {
                const messages = await dbRef.current.getMessagesForChat(17) // Back Mock
                const chatDms = await dbRef.current.getAllDMs()
                let dms = []
                const resultsPromises = chatDms.map(async (chatDM) => {
                    try {
                        const results = await searchChat(searchQuery, chatDM)
                        if (results)
                            results.map((result) => dms.push(result))
                    } catch (error) {
                        console.log(error)
                    }
                });
                await Promise.all(resultsPromises);
                setSearchResults([...messages, ...dms])
            } catch (error) {
                console.log(error)
            }
        }
        else {
            // TODO: make the Users API call
        }
       
    };

    return (
        <div className="search-side-bar">
            <div
                className="outer-search-bar"
                style={{
                    height: "5%",
                    width: "95%",
                }}
            >
                <SearchBar setSearchQuery={setSearchQuery} searchQuery={searchQuery} onEnter={test}/>
            </div>
            <div className="filters-search">

                {["Chats", "Text", "Image", "Video"].map((filter, index) => (
                    <div
                        key={index}
                        className={`filter ${activeFilters[index] ? "active" : ""}`}
                        onClick={() => toggleFilter(index)}
                    >
                        <span>{filter}</span>
                    </div>
                ))}
            </div>

            <div className="search-results">
                {activeFilters[0] && searchResults?.map((searchResult) => (
                    <ChatItem index={false} standaloneChat={searchResult} />
                ))} 
                {activeFilters[1] &&  !activeFilters[0] && searchResults?.map((searchResult) => (
                    <div className="message-search-result" 
                        onClick={() => handleSearchMessageClick(searchResult)}>
                        <ChatMessage message={searchResult} hideActions={true} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchSideBar;
