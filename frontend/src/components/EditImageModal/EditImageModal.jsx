import './EditImageModal.scss';
import { useState, useRef } from 'react';
import ConfirmModalComponent from '../ConfirmModalComponent/ConfirmModalComponent';
import { useDispatch, useSelector } from 'react-redux';
import { changeUserImage, getImages } from '../../store/slices/userSlice';
import { PATH_TO_SERVER_GETimg } from '../../data/constants';
import CustomNotifications from '../CustomNotifications/CustomNotifications';

export default function EditImageModal ({active, setActive, id, name, tags, image}) {
      /* для модальных окон-подтверждений */
  const [confirmModalActive, setConfirmModalActive] = useState(false);

  const dispatch = useDispatch();
  const userId = useSelector(state => state.user.UserId);
  const userToken = useSelector(state => state.user.userToken);
  /* для текстовых блоков */
  let nameImage = useRef();
  let tagsImage = useRef();

   const [imageName, setImageName] = useState("");
   const [tags2, setImageTags] = useState("");

const handleChangeName = (event) => {
  setImageName(event.target.value);
}

const handleChangeTags = (e) => {
  const data = e.target.value;
  setImageTags(data.split(",").map( tg => tg.trim()));
}

const [show, setShow] = useState(false);

const showNotification = () => {
  // console.log("SAT");
  setShow(true);
  // return <CustomNotifications title="Изменения сохранены" show="true" />
}

const imageId = id;

  /*for submit */
  const saveTheDataImage = (e) => {
    e.preventDefault();
     console.log("tags2", tags2);
    // console.log("userId", userId, 'imageid', imageId, "userToken", userToken, "imageName", imageName, "imageTags", tags2);
    if (imageName || tags2) {
      if (imageName) {
        console.log('fucj', tags)
        dispatch(changeUserImage({userId: userId, imageId: imageId, userToken: userToken, imageName: imageName, imageTags: tags}));
      } else if (tags2) {
        dispatch(changeUserImage({userId: userId, imageId: imageId, userToken: userToken, imageName: name, imageTags: tags2}));
      } else if (imageName && tags2) {
        dispatch(changeUserImage({userId: userId, imageId: imageId, userToken: userToken, imageName: imageName, imageTags: tags2}));
      }
      setActive(!active);
      // showNotification();

       
      //<CustomNotifications title="Изменения сохранены" show={() => setShow(!show)} />
    } else {
      console.log("no changes");
    }

  }

  /* for cancel btn */
  const cancelBtnClick = () => {
    setActive(!active);
    setConfirmModalActive(!confirmModalActive);
  }
    return (<>
        <div className={active ? "modal activeModal" : "modal"}>
        <div className="modal__content" 
        //onClick={(e) => e.stopPropagation()}
        >
          <span className="modal__content__head">
            <h3 className="modal__content__head__h3">Редактировать картинку</h3>
            {/* тут идет обычкновенное закрытие текущего окна
          с сохранением картинки*/}
            <span
              className="modal__content__head__img"
              onClick={() => setActive(!active)}
            ></span>
          </span>

          <span className="modal__content__body">

            <div className='modal__content__body__wrapper'>
            <span className='modal__content__body__imgBlock'>
                <img className='modal__content__body__imgBlock__img' src={`${PATH_TO_SERVER_GETimg}/${userId}/image/${imageId}`} alt={name} />
            </span>
            </div>

            

            {/*блок с инфой о картинке - название и теги,
                    плюс кнопки действия */}
            <form
              className="modal__content__body__infoBlock"
              onSubmit={saveTheDataImage}
            >
              {/* отображения инпута с названием картинки */}
              <span className="input__wrapper">
                <label className="input__label" htmlFor="nameImg">
                  Название картинки
                  <input
                    className="input"
                    type="text"
                    id="nameImg"
                    ref={nameImage}
                    defaultValue={name}
                    placeholder="Введите название картинки"
                    onChange={handleChangeName}
                  />
                </label>
              </span>

              {/* отображения инпута textarea с тегами картинки */}
              <label className="input__label" htmlFor="tagsImg">
                Теги картинки
                <textarea
                  className="input__textarea"
                  id="tagsImg"
                  ref={tagsImage}
                  defaultValue={tags}
                  placeholder="Введите теги для картинки, например: тег, тег2, тег три"
                  onChange={handleChangeTags}
                ></textarea>
              </label>
              <span className="modal__content__body__infoBlock__wrapper autoBtn">
                <button
                  className="modal__content__body__infoBlock__wrapper__outlineBtn"
                  // onClick={cancelBtnClick}
                  onClick={() => setConfirmModalActive(!confirmModalActive)}
                >
                  Отмена
                </button>

                <button type='submit'
                className="modal__content__body__infoBlock__wrapper__fillBtn">
                Сохранить
                </button>
              </span>
            </form>
          </span>
        </div>
        <ConfirmModalComponent
        confirmModalActive={confirmModalActive}
        setConfirmModalActive={setConfirmModalActive}
        nameOfModal="Сохранение изменений"
        bodyText="Если Вы выйдете сейчас, изменения не будут сохранены."
        leftBtnName="Отмена изменений"
        rightBtnName="Сохранить изменения"
        leftBtnAction={cancelBtnClick}
        // будущее сохранение картинки, которое переходит к закрыванию окна?? rightBtnAction={""}
      />
      </div>

      <CustomNotifications title="Изменения сохранены" show={show}/>

      </>)
}