import "./PersonalAccountPage.scss";
import OpenEyeIcon from "../../components/OpenEyeIcon";
import CloseEyeIcon from "../../components/CloseEyeIcon";
import { useState } from "react";
import {useNavigate, Link, NavLink} from "react-router-dom";
import ConfirmModalComponent from "../../components/ConfirmModalComponent/ConfirmModalComponent";
import { useDispatch, useSelector } from "react-redux";
import { setUserID, updatePasswordUser } from "../../store/slices/userSlice";

export default function PersonalAccountPage() {

  const dispatch = useDispatch();

  /* get email of current user */
  const currentUserEmail = useSelector(state => state.user.currentUser.UserEmail);
  
  /*for password inputs */
  const [passwordValue, setPasswordValue] = useState("");
  const handleChangePassword = (event) => {
    setPasswordValue(event.target.value);
  };
  const [open, setOpen] = useState(true);
  const [hidden, setHidden] = useState(true);
  const selectIcon = () => {
    setOpen(!open);
    setHidden(!hidden);
  };
  /*88888888888888888888888*/
  const [passwordVerValue, setPasswordVerValue] = useState("");
  const handleChangeVerPassword = (event) => {
    setPasswordVerValue(event.target.value);
  };
  const [isClose, setIsClose] = useState(true);
  const [isHidden, setIsHidden] = useState(true);
  const selectIconTwo = () => {
    setIsClose(!isClose);
    setIsHidden(!isHidden);
  };

  const [errorMessage, setErrorMessage] = useState("");
  const [errorVerMessage, setErrorVerMessage] = useState("");

  /* исправить на новые значения когда пойму, 
  что делать с хэшированным паролем 
  useEffect(() => {
    if (passwordValue === values.UserPassword) {
      setErrorMessage("Новый пароль не может совпадать со старым!");
    }
    if (passwordValue === values.UserPassword && passwordVerValue === passwordValue) {
      setErrorMessage("Новый пароль не может совпадать со старым!");
      setErrorVerMessage("");
    }
    if (passwordVerValue !== passwordValue) {
      setErrorVerMessage("Пароли не равны!");
    }
    if (passwordValue === values.UserPassword && passwordVerValue === passwordValue) {
      setErrorMessage("Новый пароль не может совпадать со старым!");
    }
    if (passwordValue !== values.UserPassword && passwordVerValue === passwordValue) {
      setErrorMessage("");
      setErrorVerMessage("");
    }
  }, [passwordValue, passwordVerValue, values.UserPassword]);
*/

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      errorMessage === "" &&
      errorVerMessage === "" &&
      passwordValue &&
      passwordVerValue
    ) {
      console.log("success NEW password ", passwordValue);
      console.log("success NEW verify password ", passwordVerValue);
      console.log("success change password");
      dispatch(updatePasswordUser(passwordValue));
    }
  };

  const checkTheChangePassword =
    errorMessage !== "" ||
    errorVerMessage !== "" ||
    (passwordValue === "" && passwordVerValue === "");

  /* for confirm modals */
  const [changePassModalActive, setChangePassModalActive] = useState(false);
  const cancelChangePassModal = () => {
    setPasswordVerValue("");
    setPasswordValue("");
    setChangePassModalActive(!changePassModalActive);
  };

  const [logOutModalActive, setLogOutModalActive] = useState(false);
  const canselLogoutModal = () => {
    setLogOutModalActive(!logOutModalActive);
  };

  const id = useSelector(state => state.user.UserId);
  console.log("ID FROM PERSONAL ACC PAGE", id);

  // действие выхода из акка
  const navigate = useNavigate();
  const goToLogin = () => {
    dispatch(setUserID(null));
    navigate("/login", { replace: true });
  };


  return (
    <>
      <section className="account">
        <h2 className="account__title">Аккаунт</h2>
        <div className="account__wrapper">
          <section className="account__wrapper__leftSide">
            <h3 className="account__wrapper__leftSide__title">
              Персональная информация
            </h3>

            <span className="input__wrapper">
              <label className="input__label" htmlFor="personalAcc_email">
                Email аккаунта
                <input
                  className="input__auth"
                  type="email"
                  id="personalAcc_email"
                  defaultValue={currentUserEmail || ""}
                  readOnly
                />
              </label>

              <p className="input__error">
                Внимание: email не подлежит изменению.
              </p>
            </span>

            <h4 className="account__wrapper__leftSide__text">
              Общее количество картинок:{" "}
              <span className="fontWeight">
                0
                {/* {imageCounter ? imageCounter : 0} */}
              </span>
            </h4>

            <h4 className="account__wrapper__leftSide__text">
              Общее количество тегов:{" "}
              <span className="fontWeight">
                0
                {/* {tagsCounter ? tagsCounter : 0} */}
              </span>
            </h4>
          </section>

          <section className="account__wrapper__rightSide">
            <h3 className="account__wrapper__leftSide__title">Смена пароля</h3>

            <form
              className="account__wrapper__rightSide__form"
              onSubmit={handleSubmit}
            >
              {/* password input */}
              <span className="input__wrapper2">
                <label
                  className="input__label"
                  htmlFor="personalAcc_password"
                ></label>
                Новый пароль
                <span className="icon__wrapper">
                  <input
                    className="input__auth password"
                    type={hidden ? "password" : "text"}
                    id="personalAcc_password"
                    onChange={handleChangePassword}
                    placeholder="Введите новый пароль"
                    value={passwordValue}
                  />
                  {/*пока открыт глаз - пароль не видно */}
                  {open ? (
                    <span className="iconOpen" onClick={selectIcon}>
                      <OpenEyeIcon />
                    </span>
                  ) : (
                    <span className="iconClose" onClick={selectIcon}>
                      <CloseEyeIcon />
                    </span>
                  )}
                </span>
                <p className="input__error">{errorMessage}</p>
              </span>

              {/* REPEAT password input */}
              <span className="input__wrapper2">
                <label
                  className="input__label"
                  htmlFor="personalAcc_passwordVerify"
                ></label>
                Повторите новый пароль
                <span className="icon__wrapper">
                  <input
                    className="input__auth password"
                    type={isHidden ? "password" : "text"}
                    id="personalAcc_passwordVerify"
                    onChange={handleChangeVerPassword}
                    placeholder="Введите новый пароль ещё раз"
                    value={passwordVerValue}
                  />
                  {/*пока открыт глаз - пароль не видно */}
                  {isClose ? (
                    <span className="iconOpen" onClick={selectIconTwo}>
                      <OpenEyeIcon />
                    </span>
                  ) : (
                    <span className="iconClose" onClick={selectIconTwo}>
                      <CloseEyeIcon />
                    </span>
                  )}
                </span>
                <p className="input__error">{errorVerMessage}</p>
              </span>

              <button
                type="submit"
                className={
                  checkTheChangePassword
                    ? "singup__section__body__submitBtn unactive"
                    : "singup__section__body__submitBtn"
                }
                onClick={
                  checkTheChangePassword
                    ? null
                    : () => setChangePassModalActive(!changePassModalActive)
                }
              >
                Сохранить изменения
              </button>
            </form>
          </section>
        </div>
        <button
          className="account__wrapper__logoutBtn"
          onClick={() => setLogOutModalActive(!logOutModalActive)}
        >
          Выйти из аккаунта
        </button>
      </section>


      <ConfirmModalComponent
        confirmModalActive={changePassModalActive}
        setConfirmModalActive={setChangePassModalActive}
        nameOfModal="Смена пароля"
        bodyText="Вы уверены, что хотите сменить пароль?"
        leftBtnName="Отмена"
        rightBtnName="Да, сменить"
        leftBtnAction={cancelChangePassModal}
        //действие для смены пароля
      rightBtnAction={handleSubmit}
      />

      <ConfirmModalComponent
        confirmModalActive={logOutModalActive}
        setConfirmModalActive={setLogOutModalActive}
        nameOfModal="Выход из аккаунта"
        bodyText="Вы уверены, что хотите выйти?"
        leftBtnName="Отмена"
        rightBtnName="Да, выйти"
        leftBtnAction={canselLogoutModal}
        rightBtnAction={goToLogin}
      />
    </>
  );
}
