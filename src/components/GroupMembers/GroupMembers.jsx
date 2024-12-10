import SearchBar from '../SearchBar/SearchBar'
import noUser from '../../assets/images/no-user.png'
const GroupMembers = ({ filteredMembers, handleQueryChange }) => {
    return (
        <div className=' p-4 rounded-md'>
            <SearchBar handleQueryChange={handleQueryChange} />

            <div className='members-list'>
                {filteredMembers?.map((member) => (
                    <div key={member.id} className='user-item'>
                        <div className='user-image'>
                            <img src={member.profilePic || noUser} alt={member.userName} />
                        </div>
                        <label htmlFor={`user-${member.id}`}>{member.userName || 'Unknown User'}</label>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GroupMembers
