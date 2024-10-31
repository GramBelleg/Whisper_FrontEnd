const ErrorMessage = ({ error, id }) => {
    return ( 
        <label className="text-red-600 text-sm mt-1 text-left" id={id}>{error}</label>
     );
}
 
export default ErrorMessage;