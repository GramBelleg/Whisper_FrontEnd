import RightArrow  from '../../assets/images/arrow-right.svg?react';
import LeftArrow  from '../../assets/images/arrow-left.svg?react';
import './StoriesTab.css';

const StoriesTab = ({ loading, error,data , scrollContainerRef, showLeftArrow, showRightArrow, scrollLeft, scrollRight, handleStoryClick }) => {
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
      return <div>Error: {error.message}</div>;
  }

  return (


    <div className="stories-container">
      <div className="stories-wrapper">
        <div className="stories-scroll" ref={scrollContainerRef}>
          <ul className="stories-list">
            {showLeftArrow && (
              <LeftArrow
                onClick={scrollLeft}
                className="arrow-button prev"
              />
            )}
            {data.map((story) => (
              <li 
                key={story.userId} 
                className="story-item"
                onClick={() => handleStoryClick(story.user)}
              >
                <div className={`profile-picture ${story.seen ? '' : 'unseen'}`}>
                  <img src={story.profilePicture} alt={`${story.user}'s profile`} />
                </div>
                <span className="story-user">{story.user}</span>
              </li>
            ))}
            {showRightArrow && (
              <RightArrow
                onClick={scrollRight}
                className="arrow-button next"
              />
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};


export default StoriesTab;