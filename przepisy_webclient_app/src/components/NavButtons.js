import { Link } from "react-router-dom";

const AddRecipeButton = () => {
    return (
        <div>
            <Link to="/recipe/new">Add New Recipe</Link>
        </div>
    )
};

const Buttons = {
    AddRecipeButton: AddRecipeButton
};

export default Buttons;