// ChatPage.test.jsx
/*
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatPage from './ChatPage';

// Mock components
jest.mock('../ChatList/ChatList', () => () => <div>ChatList Component</div>);
jest.mock('../StoriesContainer/StoriesContainer', () => () => <div>StoriesContainer Component</div>);
jest.mock('../SearchBar/SearchBar', () => () => <div>SearchBar Component</div>);
jest.mock('../AddNewButton/AddNewButton', () => ({ onClick }) => (
  <button onClick={onClick}>Add New</button>
));

describe('ChatPage Component', () => {
  const mockChooseChat = jest.fn();
  const mockChatList = [
    { id: 1, name: 'Chat 1' },
    { id: 2, name: 'Chat 2' },
  ];

  it('renders without crashing', () => {
    render(<ChatPage chatList={mockChatList} chooseChat={mockChooseChat} />);
    expect(screen.getByText('SearchBar Component')).toBeInTheDocument();
    expect(screen.getByText('StoriesContainer Component')).toBeInTheDocument();
    expect(screen.getByText('ChatList Component')).toBeInTheDocument();
    expect(screen.getByText('Add New')).toBeInTheDocument();
  });

  it('displays the chat list if chatList prop is provided', () => {
    render(<ChatPage chatList={mockChatList} chooseChat={mockChooseChat} />);
    expect(screen.getByText('ChatList Component')).toBeInTheDocument();
  });

  it('handles the "Add New" button click', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    render(<ChatPage chatList={mockChatList} chooseChat={mockChooseChat} />);
    fireEvent.click(screen.getByText('Add New'));
    expect(consoleSpy).toHaveBeenCalledWith('Add new clicked');
  });

  it('adjusts sidebar width during resize', () => {
    render(<ChatPage chatList={mockChatList} chooseChat={mockChooseChat} />);
    const sidebar = screen.getByRole('sidebar');
    const resizer = sidebar.querySelector('.sidebar__resizer');

    fireEvent.mouseDown(resizer);
    fireEvent.mouseMove(document, { clientX: 300 });
    fireEvent.mouseUp(document);

    expect(sidebar).toHaveStyle('width: 30%');
  });

  it('restricts sidebar width to minimum of 20%', () => {
    render(<ChatPage chatList={mockChatList} chooseChat={mockChooseChat} />);
    const sidebar = screen.getByRole('sidebar');
    const resizer = sidebar.querySelector('.sidebar__resizer');

    fireEvent.mouseDown(resizer);
    fireEvent.mouseMove(document, { clientX: 50 }); // Mimicking a very small width
    fireEvent.mouseUp(document);

    expect(sidebar).toHaveStyle('width: 20%');
  });

  it('restricts sidebar width to maximum of 45%', () => {
    render(<ChatPage chatList={mockChatList} chooseChat={mockChooseChat} />);
    const sidebar = screen.getByRole('sidebar');
    const resizer = sidebar.querySelector('.sidebar__resizer');

    fireEvent.mouseDown(resizer);
    fireEvent.mouseMove(document, { clientX: window.innerWidth }); // Mimicking a very large width
    fireEvent.mouseUp(document);

    expect(sidebar).toHaveStyle('width: 45%');
  });
});
*/