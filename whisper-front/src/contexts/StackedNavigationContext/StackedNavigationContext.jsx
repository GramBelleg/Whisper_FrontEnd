import { createContext, useState, useContext } from 'react';
import './StackedNavigation.css'; // Import CSS styles

const StackedNavigationContext = createContext();

export const useStackedNavigation = () => {
    return useContext(StackedNavigationContext);
};

export const StackedNavigationProvider = ({ children }) => {
    const [stack, setStack] = useState([]);

    const push = (component) => {
        setStack((prevStack) => [...prevStack, component]);
    };

    const pop = () => {
        setStack((prevStack) => prevStack.slice(0, -1));
    };

    const value = {
        push,
        pop,
        stack,
    };

    return (
        <StackedNavigationContext.Provider value={value}>
            {children}
            {stack.map((Component, index) => (
                <div
                    key={index}
                    className="stacked-component slide-in"
                    style={{ position: 'absolute', zIndex: index + 1 }}
                >
                    {Component}
                </div>
            ))}
        </StackedNavigationContext.Provider>
    );
};
