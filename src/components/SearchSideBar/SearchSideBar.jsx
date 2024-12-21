import React, { useEffect, useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import "./SearchSideBar.css";
import { useModal } from "@/contexts/ModalContext";
import ErrorMesssage from "../ErrorMessage/ErrorMessage";
import { useWhisperDB } from "@/contexts/WhisperDBContext";
import ChatItem from "../ChatItem/ChatItem";
import ChatMessage from "../ChatMessage/ChatMessage";
import { useChat } from "@/contexts/ChatContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { chatsGlobalSearch, messagesGlobalSearch } from "@/services/search/search";

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
            try {
                const results = await chatsGlobalSearch(searchQuery)
                console.log(results)
                const chats = [];
                const loop = results.map(async (result) => {
                    if (result) {
                        if (result.id === null)
                            chats.push(result)
                        else {
                            const chat = await dbRef.current.getChat(result.id)
                            if (chat)
                                chats.push(chat)
                        }
                    }
                })
                await Promise.all(loop)
                console.log(chats)
                setSearchResults(chats)
            } catch (error) {
                console.log(error)
            }
        }
        else if (activeFilters[1] || activeFilters[2] || activeFilters[3]) {
            try {
                const response = await messagesGlobalSearch(searchQuery,
                    activeFilters[1] ? 'TEXT' :
                    activeFilters[2] ? 'IMAGE' :
                    activeFilters[3] ? 'VIDEO' : ''
                ) 
                const messages = [];
                const loop = response.map(async (singleResponse) => {
                    const message = await dbRef.current.getMessage(singleResponse.id)
                    if (message) {
                        messages.push(message)
                    }
                })
                await Promise.all(loop)
                const chatDms = await dbRef.current.getAllDMs()
                console.log(chatDms)
                const searchResultsSet = new Set(messages)
                const resultsPromises = chatDms.map(async (chatDM) => {
                    try {
                        const results = await searchChat(searchQuery, chatDM)
                        if (results)
                            results.map((result) => {
                                if(result.extension) {
                                    console.log(result.extension.split('/')[0])
                                }
                                if (activeFilters[1] ||
                                     (activeFilters[2] && result.extension && result.extension.split('/')[0] === 'image')
                                     ||
                                     (activeFilters[3] && result.extension && result.extension.split('/')[0] === 'video')
                                    )
                                    searchResultsSet.add(result)
                            })
                    } catch (error) {
                        console.log(error)
                    }
                });
                await Promise.all(resultsPromises);
                if (activeFilters[2]) {
                    try {
                        const images = await dbRef.current.getAllImages(searchQuery)
                        images.map((image) => searchResultsSet.add(image))
                    } catch (error) {
                        console.log(error)
                    }
                }
                else if (activeFilters[3]) {
                    try {
                        const videos = await dbRef.current.getAllVideos(searchQuery)
                        videos.map((video) => searchResultsSet.add(video))
                    } catch (error) {
                        console.log(error)
                    }
                }
                console.log(Array.from(searchResultsSet))
                setSearchResults(Array.from(searchResultsSet))
            } catch (error) {
                console.log(error)
            }
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
                {(activeFilters[1] || activeFilters[2] || activeFilters[3]) &&  !activeFilters[0] && searchResults?.map((searchResult) => (
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
