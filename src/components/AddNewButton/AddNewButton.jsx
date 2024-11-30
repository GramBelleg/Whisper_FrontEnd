import "./AddNewButton.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from "@fortawesome/free-solid-svg-icons";


const AddNewButton = ({ onClick }) => {
    return (
        <button  className="add-new-button" onClick={onClick}>
            <FontAwesomeIcon icon={faPencil} />
        </button>
    );
};

export default AddNewButton;