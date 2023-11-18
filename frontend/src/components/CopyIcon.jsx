import { useState } from "react";

const CopyIcon =  () => {
    const [hovered, setHovered] = useState(false);
    // const [active, setActive] = useState(false);
    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    // const handleMouseDown = () => {
    //     setActive(true);
    // };

    // const handleMouseUp = () => {
    //     setActive(false);
    // };
    return <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    >
    <path d="M19.0781 6H8.67188C7.19624 6 6 7.19624 6 8.67188V19.0781C6 20.5538 7.19624 21.75 8.67188 21.75H19.0781C20.5538 21.75 21.75 20.5538 21.75 19.0781V8.67188C21.75 7.19624 20.5538 6 19.0781 6Z" stroke={hovered ? "#765BAB" : "#C5C5C5"} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M17.9766 6L18 4.875C17.998 4.17942 17.7208 3.51289 17.229 3.02103C16.7371 2.52918 16.0706 2.25198 15.375 2.25H5.25C4.45507 2.25235 3.69338 2.56917 3.13128 3.13128C2.56917 3.69338 2.25235 4.45507 2.25 5.25V15.375C2.25198 16.0706 2.52918 16.7371 3.02103 17.229C3.51289 17.7208 4.17942 17.998 4.875 18H6" stroke={hovered ? "#765BAB" : "#C5C5C5"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>

}
export default CopyIcon;

