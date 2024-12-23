import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import MessageRenderer from '@/components/ChatMessage/MessageRenderer';


describe('MessageRenderer', () => {
    it('renders plain text correctly', () => {
      const content = 'Hello, this is a plain message.';
      render(<MessageRenderer content={content} />);
  
      // Check if the text content matches using regex
      expect(screen.getByText(/hello, this is a plain message\./i)).toBeInTheDocument();
    });
  
    it('renders a message with a single mention correctly', () => {
      const content = 'Hello @[John Doe](user:123), how are you?';
      render(<MessageRenderer content={content} />);
  
      // Check for the plain text parts using regex
      expect(screen.getByText(/hello /i)).toBeInTheDocument();
      expect(screen.getByText(/, how are you\?/i)).toBeInTheDocument();
  
      // Check for the mention
      const mention = screen.getByText('@John Doe');
      expect(mention).toBeInTheDocument();
      expect(mention).toHaveStyle('font-weight: bold');
      expect(mention).toHaveStyle('text-decoration: underline');
      expect(mention).toHaveAttribute('title', 'Mention: John Doe');
    });
  
    it('renders a message with multiple mentions correctly', () => {
      const content = 'Hi @[Alice](user:456) and @[Bob](user:789), welcome!';
      render(<MessageRenderer content={content} />);
  
      // Check for the plain text parts using regex
      expect(screen.getByText(/^hi /i)).toBeInTheDocument();
      expect(screen.getByText(/ and /i)).toBeInTheDocument();
      expect(screen.getByText(/, welcome!$/i)).toBeInTheDocument();
  
      // Check for the mentions
      const mentionAlice = screen.getByText('@Alice');
      expect(mentionAlice).toBeInTheDocument();
      expect(mentionAlice).toHaveAttribute('title', 'Mention: Alice');
  
      const mentionBob = screen.getByText('@Bob');
      expect(mentionBob).toBeInTheDocument();
      expect(mentionBob).toHaveAttribute('title', 'Mention: Bob');
    });
  
    it('handles messages without mentions gracefully', () => {
      const content = 'No mentions here!';
      render(<MessageRenderer content={content} />);
  
      // Check that the message matches the regex
      expect(screen.getByText(/no mentions here!/i)).toBeInTheDocument();
    });
  
    it('renders a message with mentions at the beginning and end', () => {
      const content = '@[StartUser](user:111) is here, and @[EndUser](user:222) is there.';
      render(<MessageRenderer content={content} />);
  
      // Check for the mentions
      const startMention = screen.getByText('@StartUser');
      expect(startMention).toBeInTheDocument();
      expect(startMention).toHaveAttribute('title', 'Mention: StartUser');
  
      const endMention = screen.getByText('@EndUser');
      expect(endMention).toBeInTheDocument();
      expect(endMention).toHaveAttribute('title', 'Mention: EndUser');
  
      // Check for the plain text parts using regex
      expect(screen.getByText(/is here, and/i)).toBeInTheDocument();
      expect(screen.getByText(/is there\./i)).toBeInTheDocument();
    });
  });