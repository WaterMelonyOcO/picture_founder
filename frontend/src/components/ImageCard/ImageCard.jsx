import "./ImageCard.scss";
import { useState } from "react";
import ActionCircle from "../ActionCircle/ActionCircle";
import FavoriteComponent from "../FavoriteComponent/FavoriteComponent";
import { useDispatch } from "react-redux";
import { addImageToFavorite } from "../../store/slices/userSlice";

export default function ImageCard({ id, name, tags, image, inFavorite, setInFavorite
}) {
  /*функция для преобразования тегов 
  .trim() для удаления пробелов до и после слова*/
  let newTagList = tags
    .split(",")
    .map((tag) => {
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

  const itemData = { id, name, tags, image };
  const dispatch = useDispatch();

  const addToFavorite = () => {
    dispatch(addImageToFavorite({...itemData}));
  }
  return (
    <span
      className="layout__card__wrapper"
      onMouseEnter={handleMouseHover}
      onMouseLeave={handleMouseDown}
    >
      <div className="layout__card__wrapper__actions">
        <ActionCircle 
        id={id} name={name} tags={tags} image={image}
        // dataOfImage={[id, name, tags, image ]} 
        isHover={isHover}/>
      </div>
      <div className="layout__card">
        <span className="layout__card__titleWrap">
          <h3 className="layout__card__titleWrap__title">{name}</h3>
          <span onClick={addToFavorite}>
            <FavoriteComponent 
            inFavorite={inFavorite} setInFavorite={setInFavorite}/>
          </span>
        </span>

        <img src={image} alt={name} className="layout__card__image" />
        <p className="layout__card__tagList">{newTagList}</p>
      </div>
    </span>
  );
}
