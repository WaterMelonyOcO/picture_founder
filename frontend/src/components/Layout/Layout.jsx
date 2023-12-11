import './Layout.scss';
import {Outlet, Link, NavLink} from "react-router-dom";
import Header from "../Header/Header";
import SortDropdown from "../SortDropdown/SortDropdown";
import Footer from "../Footer/Footer";
import { useEffect, useState } from 'react';
import HeaderMobile from '../HeaderMobile/HeaderMobile';

export default function Layout() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <>

{ windowWidth <= 768 ? <>

    <div className='header'>
      <Link to={"/main"} className='header__link'>
            <span className='header__logo'>
                Pic
                <p className='header__logo__p'>
                    2
                </p>
            </span>
      </Link>

      <NavLink to="/account"
               className={({isActive}) => isActive ? "loginBtnActive": "header__btns__login"}
      ></NavLink>
    </div>

<HeaderMobile />
</> : <Header />}

      
            {/* общий контейнер с поиском и сортировкой,
      который имеет отступы 55рх вместе с содержимым */}
      <div className="main__section">
        <div className="main__section__wrapper">
          <label htmlFor="searchInput" className="main__section__label">
            <input
              type="search"
              name="searchInput"
              id="searchInput"
              className="main__section__input"
              placeholder="Поиск"
            />
            <span className="main__section__label__img"></span>
          </label>
          <SortDropdown />
        </div>
        {/* вот тут находится все содержимое роутов,
        а вокруг них будут шапка и подвал */}
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
