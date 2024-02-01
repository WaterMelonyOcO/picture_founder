import { Link, useNavigate } from "react-router-dom";
import "./SingUpPage.scss";
import { useCallback, useEffect, useState } from "react";
import OpenEyeIcon from "../../icons/OpenEyeIcon";
import CloseEyeIcon from "../../icons/CloseEyeIcon";
import { useDispatch, useSelector } from "react-redux";
import { createUser, setError, setExistEmail, setMessage } from "../../store/slices/userSlice";
import Logo from "../../icons/Logo";
import Loader from "../../components/Loader/Loader";

export default function SingUpPage() {

let navigate = useNavigate();
const nextPage = useCallback(() => {
  navigate('/login', {replace: true} );
}, [navigate])

const currCode = useSelector(state => state.user.currentUser?.data?.message);
console.log("HAPPY 2", currCode, currCode === "complete user create" );

const message = useSelector(state => state.user.message);
console.log("HAPPY", message, message === "complete user create" );

/*for email */
const [errorMessageEmail, setErrorMessageEmail] = useState("");
const [userEmail, setEmail] = useState("");
const handleChangeEmail = (event) => {
  setEmail(event.target.value);
}
useEffect(() => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (userEmail.match(emailRegex)) {
    setErrorMessageEmail("");
  } else {
    setErrorMessageEmail("Введён неверный адрес эл.почты!");
    // console.log("invalid email");
  };
}, [userEmail]);

/*for first password input */
const [userPassword, setPasswordValue] = useState("");
const handleChangePassword = (event) => {
  setPasswordValue(event.target.value);
}
const [open, setOpen] = useState(true);
const [hidden, setHidden] = useState(true);
const selectIcon = () => {
    setOpen(!open);
    setHidden(!hidden);
}

/*for second password input - verify*/
const [SingUppasswordVerValue, setPasswordVerValue] = useState("");
const handleChangeVerPassword = (event) => {
  setPasswordVerValue(event.target.value);
}
const [isClose, setIsClose] = useState(true);
const [isHidden, setIsHidden] = useState(true);
const selectIconTwo = () => {
  setIsClose(!isClose);
  setIsHidden(!isHidden);
}
useEffect(() => {
  if (SingUppasswordVerValue !== userPassword) {
    setErrorVerMessage("Пароли не равны!");
  } else if (SingUppasswordVerValue === userPassword) {
    setErrorVerMessage("");
    // console.log("success singup");
  };
  if (userPassword.length < 8) {
    setErrorMessage("Минимальная длиная пароля - 8 символов!");
  } else setErrorMessage("");
}, [userPassword, SingUppasswordVerValue])
const [errorMessage, setErrorMessage] = useState("");
const [errorVerMessage, setErrorVerMessage] = useState("");


/* for submit button */
const dispatch = useDispatch();
const getError = useSelector(state => state.user.error);
const currentStatus = useSelector(state => state.user.status);
const existEmail = useSelector(state => state.user.existEmail);
// const userIDInRegis = useSelector(state => state.user.UserId);
// console.log("userID In Regis", userIDInRegis)
console.log("existEmail in singup page", existEmail);
console.log("status in singup", currentStatus);

console.log("getError", getError);


//отправка запроса на сервер
const handleSubmit = async () => {
  // event.preventDefault();

      console.log("getError in SUBMIT", getError);
      console.log("existEmail in in SUBMIT", existEmail);
 
  //внутренние проверки на заполнение значений 
  //и отсутствие ошибок
  if (checked === true && errorVerMessage === "" && errorMessage === "" && errorMessageEmail === "" && userEmail && userPassword && SingUppasswordVerValue && getError === null) {
    dispatch(createUser({userEmail, userPassword}));
  }
}

const checkTheServerAnswer = useCallback(() => {
  if (getError && (getError === 400) && existEmail !== "") {
    console.log("verification for user");
      setErrorMessageEmail("Пользователь с этой почтой уже зарегистрирован!");
      console.log("getError in function in red", getError);
      console.log("existEmail in  function in red", existEmail);
  }; 
  if (existEmail && userEmail && existEmail !== userEmail) {
    setErrorMessageEmail("");
    dispatch(setError(null));
    dispatch(setExistEmail(null));
  }
  console.log("getError in useEffect", getError);
  console.log("existEmail in in useEffect", existEmail);
}, [getError, existEmail, userEmail, dispatch])


//проверка на ответ от сервера, если ошибка, то записать ее под инпутом
useEffect(()=> {
  checkTheServerAnswer();
}, [checkTheServerAnswer]);


//проверка на ответ от сервера, если ошибка, то записать ее под инпутом
// useEffect(()=> {
//   if (getError && (getError === 400) && existEmail !== "") {
//     console.log("verification for user");
//       setErrorMessageEmail("Пользователь с этой почтой уже зарегистрирован!");
//       console.log("getError in function in red", getError);
//       console.log("existEmail in  function in red", existEmail);
//   }; 
//   if (existEmail && userEmail && existEmail !== userEmail) {
//     setErrorMessageEmail("");
//     dispatch(setError(null));
//     dispatch(setExistEmail(null));
//   }
//   console.log("getError in useEffect", getError);
//   console.log("existEmail in in useEffect", existEmail);
  
// }, [getError, existEmail, userEmail, dispatch]);

useEffect(() => {
  if (message === "complete user create") {     
    nextPage();
    dispatch(setMessage(null));
  }
}, [message, nextPage])

// for checkbox
const [checked, setChecked] = useState(false);

//проверка на отображение чекбокса
useEffect(() => {
  if (checked === true && getError !== null) {
    setChecked(true);
  }
}, [checked, getError])



/* for small width to logo */
const [windowWidth, setWindowWidth] = useState(window.innerWidth);

useEffect(() => {
  const handleResize = () => setWindowWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

//----------------------------
//для отображения загрузки или контента

let content;
const currStatus = useSelector(state => state.user.status);

if (currStatus === "loading") {
  content = <Loader />
} else if (currStatus === 'succeeded' || currStatus === 'idle') {
  content = <>
  <div className="singup__section">
      <span className="singup__section__header">
      {
            windowWidth <= 768 ? <Logo newWidth="156" newHeight="59"/> :
            <Logo newWidth="220" newHeight="84"/>
          }
        <h2 className="singup__section__header__text">Регистрация</h2>
      </span>

      <div id="signupForm" className="singup__section__body"
      // autoComplete="off"
      //onSubmit={handleSubmit}
      >
  {/* email input */}
  <span className="input__wrapper">
      <label className="input__label" htmlFor="singUp_email">
      Электронная почта
        <input
          className="input__auth"
          type="email"
          id="singUp_email"
          name="singUp_email"
          placeholder="Введите эл. почту"
          value={userEmail}
          onChange={handleChangeEmail}
          required
        />
      </label>

      <p className='input__error'>
                {errorMessageEmail}
            </p>
    </span>

  {/* password input */}
                    <span className="input__wrapper2">
      <label className="input__label" htmlFor="singUp_password"></label>
      Пароль
       <span className="icon__wrapper">
        <input
          className="input__auth password"
          type={hidden ? "password" : "text"}
          id="singUp_password"
          name="singUp_password"
          onChange={handleChangePassword}
          placeholder="Введите пароль"
          value={userPassword}
          required
          spellCheck="false"
        />
        {/*пока открыт глаз - пароль не видно */}
       {
        open ?
        (
        <span className="iconOpen" onClick={selectIcon}>
            <OpenEyeIcon />
        </span>) :
        (
            <span className="iconClose" onClick={selectIcon}>
                <CloseEyeIcon />
            </span> 
        )
       }
        </span>
        <p className='input__error'>
                {errorMessage}
            </p>
    </span>
  {/* REPEAT password input */}      
            <span className="input__wrapper2">
      <label className="input__label" htmlFor="singUp_passwordVerify"></label>
      Повторите пароль
       <span className="icon__wrapper">
        <input
          className="input__auth password"
          type={isHidden ? "password" : "text"}
          id="singUp_passwordVerify"
          name="singUp_passwordVerify"
          onChange={handleChangeVerPassword}
          placeholder="Введите пароль ещё раз"
          value={SingUppasswordVerValue}
          required
          spellCheck="false"
        />
        {/*пока открыт глаз - пароль не видно */}
       {
        isClose ?
        (
        <span className="iconOpen" onClick={selectIconTwo}>
            <OpenEyeIcon />
        </span>) :
        (
            <span className="iconClose" onClick={selectIconTwo}>
                <CloseEyeIcon />
            </span> 
        )
       }
        </span>
            <p className='input__error'>
                {errorVerMessage}
            </p>
    </span>

        <span className="singup__section__body__checkboxWrapper">
        <input type="checkbox" 
        onChange={() => setChecked(!checked)}
        checked={checked}
        id="singUp_checkbox"
       />
          <label
            htmlFor="singUp_checkbox"
            className="singup__section__body__checkboxWrapper__label"
          >
            Я ознакомлен и согласен с условиями обработки моих персональных
            данных и <Link to="#" className="singup__section__body__checkboxWrapper__label__link">Политикой конфиденциальности</Link>.
            </label>
        </span>

        <button type="submit" className={checked ? "singup__section__body__submitBtn" : "singup__section__body__submitBtn unactive"}
         onClick={() => handleSubmit()}>
          Зарегистрироваться
        </button>
      </div>
    </div>
  </>
}


  return (
    content
  );
}
