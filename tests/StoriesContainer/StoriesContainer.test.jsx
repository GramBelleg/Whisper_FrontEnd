// StoriesContainer.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { ModalProvider } from '@/contexts/ModalContext';
import { getMyStories } from '@/services/storiesservice/getStories';
import StoriesContainer from '@/components/StoriesContainer/StoriesContainer';


vi.mock('@/services/storiesservice/getStories', () => {
    const myStories = {
        "stories" : [ 
            {
                "id": 0,
                "content": "ahmed",
                "media": "/api/container1/61730546732593.string?sv=2024-11-04&se=2024-11-12T18%3A08%3A47Z&sr=b&sp=r&sig=McIinnmuVtRCb4Z1fPR3xqoKMT7kgwf%2FJrj5B81cE2I%3D",
                "type": "video/mp4",
                "likes": 12,
                "date": new Date(),
                "viewed": true,
                "privacy": "everyone"
            },
            
            {
                "id": 1,
                "content": "mahmoud",
                "media": "/api/container1/61730487929490.string?sv=2024-11-04&se=2024-11-11T19%3A08%3A57Z&sr=b&sp=r&sig=%2BZkrxeMtJOPMyFJibsqTWKrPfdoNkVslDVmweZ%2F0qBw%3D",
                "type": "image/png",
                "likes": 12,
                "date": new Date(),
                "viewed": true,
                "privacy": "everyone"
            }
             
        ]
    }
    return {
        getMyStories: vi.fn().mockResolvedValue(myStories),
    };
});

describe('StoriesContainer', () => {
    beforeEach(() => {
        
        render(
              <ModalProvider>
                <StoriesContainer />
              </ModalProvider>
          );
        
    })

    it('fetches and displays stories on load', async () => {

        // Wait for the fetchMyStories call to complete
        await waitFor(() => expect(screen.getByText('ahmed')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByText('mahmoud')).toBeInTheDocument());

    });

    
});
