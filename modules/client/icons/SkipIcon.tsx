import * as React from "react";

import { SvgIcon } from "@mui/material";

export const SkipIcon: React.FC = (props) => (
  <SvgIcon {...props} preserveAspectRatio="xMinYMin slice" overflow="visible">
    <g fill="none" fillRule="evenodd" strokeLinecap="round">
      <path
        stroke="#FFF"
        strokeWidth="8"
        d="M0.5 0.5L23.5 23.5"
        transform="translate(3 3)"
      />
      <path
        stroke="currentColor"
        strokeWidth="3.5"
        d="M0.5 0.5L23.5 23.5"
        transform="translate(3 3)"
      />
    </g>
  </SvgIcon>
);
