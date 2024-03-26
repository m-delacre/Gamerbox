import './WatchListButton.css';
import { useSelector } from "react-redux";
import { selectIsConnectedonnected, selectToken } from "../../redux/userSlice";
import GamerboxApi from "../../services/gamerbox_api";

type WishListBtnProps = {
    gameId: number
}
function WatchListButton({gameId}: WishListBtnProps) {
    const addWishlist = async () => {
        if (useSelector(selectIsConnectedonnected) === true && gameId) {
            try {
                const res: boolean | null = await GamerboxApi.addToWishlist(gameId, useSelector(selectToken));
    
                if (res === true) {
                    console.log('ajouté à la wishlist!')
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log("ça n'a pas fonctionné :( ");
        }
    };

    return(
        <div className='WatchListButton'>
            <button onClick={addWishlist}>Add Wishlist</button>
        </div>
    )
}

export default WatchListButton;