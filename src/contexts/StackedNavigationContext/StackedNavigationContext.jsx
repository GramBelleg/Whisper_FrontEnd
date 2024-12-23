import { createContext, useState, useContext } from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import './StackedNavigation.css'

const StackedNavigationContext = createContext()

export const useStackedNavigation = () => {
    return useContext(StackedNavigationContext)
}

export const StackedNavigationProvider = ({ children }) => {
    const [stack, setStack] = useState([])

    const push = (component) => {
        setStack((prevStack) => [...prevStack, component])
    }

    const pop = () => {
        if (stack.length === 0) return
        setStack((prevStack) => prevStack.slice(0, -1))
    }

    const value = {
        push,
        pop,
        stack
    }

    return (
        <StackedNavigationContext.Provider value={value}>
            <div className='stacked-navigation-container'>
                {children}
                <TransitionGroup>
                    {stack.map((Component, index) => (
                        <CSSTransition
                            key={index}
                            classNames='stacked-component'
                            timeout={300} // Match this with your CSS animation duration
                        >
                            <div className='stacked-component' style={{ zIndex: index + 1 }}>
                                {Component}
                            </div>
                        </CSSTransition>
                    ))}
                </TransitionGroup>
            </div>
        </StackedNavigationContext.Provider>
    )
}
