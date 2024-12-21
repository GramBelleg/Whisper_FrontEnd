import { StackedNavigationProvider } from '@/contexts/StackedNavigationContext/StackedNavigationContext'
import React from 'react'
import SingleChatSearch from './SingleChatSearch'

const SingleChatSearchContainer = ({onClose}) => {
  return (
    <StackedNavigationProvider>
        <SingleChatSearch onClose={onClose}/>
    </StackedNavigationProvider>

  )
}

export default SingleChatSearchContainer
