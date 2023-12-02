import "./AddImageModal.scss";
import React, { useState, useRef, useEffect } from "react";
import ConfirmModalComponent from "../ConfirmModalComponent/ConfirmModalComponent";
import UploadImageComponent from "../UploadImageComponent/UploadImageComponent";
import { useDispatch, useSelector } from "react-redux";
import { addImageToPage } from "../../store/slices/userSlice";
import addUserImage from '../../store/slices/userSlice';
import axios from "axios";
import { ACCEPT_FILE_TYPE, MAX_SIZE_OF_FILE } from "../../data/constants";


export default function AddImageModal({
  active,
  setActive,
}) {
  /*------работа с изображениями-----------*/
  const [file, setFile] = useState(null);
  const [size, setSize] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [fileError, setFileError] = useState("");
  /*-------------------------*/

  //отслеживание ошибок, связанных с изображениями
  useEffect(() => {
    if (size > MAX_SIZE_OF_FILE) {
      setFileError("Размер файла превышает 20МБ!")
    } else {
      setFileError("");
    }
  }, [size])

  useEffect(() => {
    if (!ACCEPT_FILE_TYPE.includes(fileType)) {
      setFileError("Неверный тип файла!");
    } else {
      setFileError("");
    }
  }, [fileType]);

  /* for cancel btn */
  const cancelBtnClick = (e) => {
    nameImage.current.value = "";
    tagsImage.current.value = "";
    setFile(null);
    setActive(!active);
    setConfirmModalActive(!confirmModalActive);
  };

  /* для текстовых блоков */
  let nameImage = useRef();
  let tagsImage = useRef();

  /* для отправки картинки на сервер */

  const dispatch = useDispatch();
  const images = useSelector(state => state.user.images);
  const id = useSelector(state => state.user.UserId);
  console.log("ID in add image modal", id);
  // console.log("what is it?", id);
  // console.log("array of images ", images);

  const addToPage = (dataOfImage) => {
    console.log("addToPage func id", id, "data of image", dataOfImage );
    dispatch(addUserImage({id: id, data: dataOfImage}));
    // dispatch(addImageToPage({data: dataOfImage}));
  }
  const submitInfoImage = (e) => {
    e.preventDefault();
    const imageName = nameImage.current.value;
    const imageTegs = tagsImage.current.value;

    // let imageTegs = [];

    // for (let i = 0; i < tags.lenght; i++) {
    //   imageTegs.push(i);
    //   console.log(imageTegs);
    // }
    const image = {file};
    const key = Math.random();


    const dataOfImage = {image, imageName, imageTegs};

    // //функция проверки на все заполненные поля
    // const checkTheInputsValue = () => {
    //   if (!file && !imageName && !imageTegs) {
    //     setFileError("Не все поля заполнены!");
    //   } else {
    //     setFileError("");
    //   }
    // } 

    //функция добавления картинки на страницу 
    addToPage(dataOfImage);
    console.log("dataOfImage", dataOfImage);
    // // dispatch(addImageToPage(dataOfImage));


    nameImage.current.value = "";
    tagsImage.current.value = "";
    if (file) {
      setFile(null);
    } else {
      return;
    }
    setActive(!active);

    // } else {
    //   setFileError("Не все поля заполнены!");
    // }
    // checkTheInputsValue();

    // if (fileError === "" && file && imageName && imageTegs) {
    //   addToPage(dataOfImage);
    //   console.log("dataOfImage", dataOfImage);
    //   console.log(file && imageName && imageTegs);
    //   // dispatch(addImageToPage(dataOfImage));

    //   nameImage.current.value = "";
    //   tagsImage.current.value = "";
    //   setFile(null);
    //   setActive(!active);
    //   setFileError("");
    // } else {
    //   setFileError("Не все поля заполнены!");
    // }
    
  };
  const checkTheFileFunc = () => {
    if (file || nameImage.current.value || tagsImage.current.value) {
      setConfirmModalActive(!confirmModalActive)
    } else {
      setActive(!active);
    }
  }
  /* для модальных окон-подтверждений */
  const [confirmModalActive, setConfirmModalActive] = useState(false);

  return (
    <>
      <div className={active ? "modal activeModal" : "modal"}>
        <div
          className="modal__content"
          // onClick={(e) => e.stopPropagation()}
        >
          <span className="modal__content__head">
            <h3 className="modal__content__head__h3">Добавить картинку</h3>
            {/* тут идет обычкновенное закрытие текущего окна
          с сохранением картинки*/}
            <span
              className="modal__content__head__img"
              onClick={() => setActive(!active)}
            ></span>
          </span>

          <span className="modal__content__body">
            {/* добавление картинки в компоненте */}
            <UploadImageComponent
              file={file}
              setFile={setFile}
              name={nameImage}
              setSize={setSize}
              fileError={fileError}
              setFileError={setFileError}
              setFileType={setFileType}
            />
            {/*блок с инфой о картинке - название и теги,
                    плюс кнопки действия */}
            <div
              className="modal__content__body__infoBlock"
              onSubmit={submitInfoImage}
            >
              {/* отображения инпута с названием картинки */}
              <span className="input__wrapper">
                <label className="input__label" htmlFor="nameImg">
                  Название картинки
                  <input
                    className="input modalInput"
                    type="text"
                    id="nameImg"
                    ref={nameImage}
                    placeholder="Введите название картинки"
                    required
                  />
                </label>
              </span>

              {/* отображения инпута textarea с тегами картинки */}
              <label className="input__label" htmlFor="tagsImg">
                Теги картинки (через запятую)
                <textarea
                  className="input__textarea"
                  id="tagsImg"
                  ref={tagsImage}
                  placeholder="Введите теги для картинки, например: тег, тег2, тег три"
                  required
                ></textarea>
              </label>
              <span className="modal__content__body__infoBlock__wrapper">
                <button
                  className="modal__content__body__infoBlock__wrapper__outlineBtn"
                  onClick={checkTheFileFunc}
                >
                  Отмена
                </button>

                <button 
                className="modal__content__body__infoBlock__wrapper__fillBtn"
                onClick={submitInfoImage}>
                  Добавить
                </button>
              </span>
            </div>
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
    </>
  );
}
