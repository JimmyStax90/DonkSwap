import React from "react";
import Svg from "../../../components/Svg/Svg";
import { SvgProps } from "../../../components/Svg/types";

const Icon: React.FC<SvgProps> = (props) => {
    return (
        <Svg viewBox="0 0 96 96" {...props}>
            <circle cx="48" cy="48" r="48" fill="#F5F5F5" />
            <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><title>ONTO LOGO_40x40</title><g id="LOGO"><path id="形状结合" d="M8,6l4.34,4.34A12.11,12.11,0,0,1,32,19.44V34l-4.34-4.34A12.11,12.11,0,0,1,8,20.56V6Zm3,7.17v7A9.14,9.14,0,0,0,25.2,27.8l.23-.16L11.53,13.75Zm3.84-1-.23.16,13.9,13.9.57.57v-7A9.14,9.14,0,0,0,14.8,12.2Z"/></g></svg>
        </Svg>
    );
};

export default Icon;
