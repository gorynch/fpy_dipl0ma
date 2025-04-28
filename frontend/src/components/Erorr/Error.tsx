import { useSelector } from "react-redux";
import { RootState } from "../../interfaces";

export const Error = () => {

    const { error } = useSelector(
        (state: RootState) => state.api
      );

    return (
        <>
            <div className="alert alert-success" role="alert">
                <h4 className="alert-heading">Error</h4>
                <hr/>
                <p>{error}</p>
            </div>
 
        </>
    )
};
