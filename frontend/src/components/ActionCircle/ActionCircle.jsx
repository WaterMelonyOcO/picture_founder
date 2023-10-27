import DeleteIcon from "../DeleteIcon";
import DownloadIcon from "../DownloadIcon";
import EditIcon from "../EditIcon";
import ShareIcon from "../ShareIcon";
import "./ActionCircle.scss";

export default function ActionCircle ({isHover, setIsHover}) {
    // isHover ? "wrapper active" : "wrapper"
    return (
        <span className={isHover ? "wrapper active" : "wrapper"}>

            <span className="wrapper__circle">
            <EditIcon />
            </span>

            <span className="wrapper__circle">
            <ShareIcon />
            </span>

            <span className="wrapper__circle">
            <DownloadIcon />
            </span>

            <span className="wrapper__circle">
            <DeleteIcon />
            </span>

        </span>
    )
}