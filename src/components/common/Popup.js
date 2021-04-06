import React from "react";
import Styles from "../../bootstrap/popup.module.css";
import { BsXSquareFill } from "react-icons/bs";

const Popup = ({ Content, close, setClose }) => {
  return (
    <div className={[Styles.popup, close ? Styles.close : ""].join(" ")}>
      <div className={Styles.background}>
        <div className={Styles.popupbox}>
          <header>
            <BsXSquareFill
              className={Styles.popupCloseIcon}
              onClick={() => {
                setClose(true);
              }}
            ></BsXSquareFill>
          </header>
          <Content setClose={setClose}></Content>
        </div>
      </div>
    </div>
  );
};

export default Popup;
