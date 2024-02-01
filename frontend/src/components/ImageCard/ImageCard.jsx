import "./ImageCard.scss";
import { useEffect, useState } from "react";
import ActionCircle from "../ActionCircle/ActionCircle";
import {useDispatch, useSelector} from "react-redux";
import { changeUserImage } from "../../store/slices/userSlice";
import FavorFillIcon from "../../icons/FavorFillIcon";
import FavorOutlineIcon from "../../icons/FavorOutlineIcon";
import { PATH_TO_SERVER_GETimg } from "../../data/constants";
// import { addImageToFavorite } from "../../store/slices/userSlice";

export default function ImageCard({ imageId, imageName, imageTags, image, 
  userId, userToken, isFavorite
}) {
  /*функция для преобразования тегов 
  .trim() для удаления пробелов до и после слова*/
  let newTagList = imageTags || imageTags 
    ?.map((tag) => {
      tag = tag.trim();
      tag = "#" + tag;
      tag = tag.replaceAll(" ", "_");
      tag = tag + " ";
      return tag;
    })
  /*для проверки наведения на карточку */
  const [isHover, setIsHover] = useState(false);

  const handleMouseHover = () => {
    setIsHover(true);
  };
  const handleMouseDown = () => {
    setIsHover(false);
  };

  const itemData = { userId, imageId, userToken, imageName, imageTags, image };
  const dispatch = useDispatch();

      /* добавить в избранное */
      const handleToggleFavorite = (itemData) => {
        dispatch(changeUserImage({ ...itemData, isFavorite: !isFavorite }));
      };
      console.log("IS FAV IN CARD", isFavorite);
  return (
    <span
      className="layout__card__wrapper"
      onMouseEnter={handleMouseHover}
      onMouseLeave={handleMouseDown}
    >
      <div className="layout__card__wrapper__actions">
        <ActionCircle 
        id={imageId} name={imageName} tags={imageTags} image={image}
        isHover={isHover} userToken={userToken}/>
      </div>
      <div className="layout__card">
        <span className="layout__card__titleWrap">
          <h3 className="layout__card__titleWrap__title">{imageName}</h3>
          <span 
          onClick={() => handleToggleFavorite(itemData)} 
          className="layout__card__titleWrap__icon">
            {
              isFavorite ? <FavorFillIcon /> : <FavorOutlineIcon />
            }
          </span>
        </span>

        <img src={`${PATH_TO_SERVER_GETimg}/${userId}/image/${imageId}`} alt={imageName} className="layout__card__image" />
        <p className="layout__card__tagList">
          {newTagList}
          </p>
      </div>
    </span>
  );
}
