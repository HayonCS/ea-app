import {
  FontWeightBold,
  BackgroundColors,
  GentexBlue,
  AppBarSettings,
  TooltipDelayMs,
  Highlights,
} from "./app-theme";
import {
  Tooltip,
  createStyles,
  InputBase,
  Tabs,
  Tab,
  Zoom,
} from "@mui/material";
import { withStyles } from "@mui/styles";

export const InlineInputStyle = {
  padding: "0",
  height: "inherit",
  fontSize: "12px",
};

export const RetryLoopDivStyle = {
  paddingTop: "5px",
  paddingLeft: "1px",
  display: "flex",

  border: "1px solid transparent",
  overflow: "hidden",
  textOverflow: "ellipsis",
  cursor: "text",
  fontWeight: FontWeightBold,
  fontStyle: "bold",
  fontSize: "14px",
};

export const PopoverTooltip = withStyles((theme) => ({
  popper: {
    backgroundColor: "transparent",
    display: "inline-block",
  },
  tooltip: {
    backgroundColor: "transparent",
    display: "inline-block",
    fontSize: 16,
    TransitionComponent: Zoom,
    theme: theme,
  },
}))(Tooltip);

export const LightTooltip = withStyles((theme: any) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 14,
    enterDelay: TooltipDelayMs,
    TransitionComponent: Zoom,
  },
}))(Tooltip);

export const CustomizedSelectInput = withStyles((theme: any) =>
  createStyles({
    input: {
      borderRadius: 3,
      position: "relative",
      backgroundColor: BackgroundColors.Table,
      border: "1px solid #ced4da",
      fontSize: 13,
      font: theme.typography.fontFamily,
      padding: "10px 10px 10px 10px",
      transition: theme.transitions.create(["border-color", "box-shadow"]),
      "&:focus": {
        borderRadius: 4,
        borderColor: GentexBlue,
        border: "2px solid",
      },
      "&:hover": {
        borderColor: "black",
      },
    },
  })
)(InputBase);

export const DisabledCustomizedSelectInput = withStyles((theme: any) =>
  createStyles({
    input: {
      borderRadius: 3,
      position: "relative",
      backgroundColor: BackgroundColors.Table,
      border: "1px solid #ced4da",
      fontSize: 13,
      font: theme.typography.fontFamily,
      padding: "10px 10px 10px 10px",
      transition: theme.transitions.create(["border-color", "box-shadow"]),
      "&:focus": {
        borderRadius: 4,
        borderColor: GentexBlue,
        border: "2px solid",
      },
    },
  })
)(InputBase);

export const TPEStyledTabs = withStyles((theme) =>
  createStyles({
    root: {
      width: "100%",
      boxShadow: "inset 0 -1px 0 0 #E6ECF0",
    },
    indicator: {
      backgroundColor: theme.palette.primary.main,
    },
  })
)(Tabs);

export const TPEStyledVerticalTabs = withStyles((theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    indicator: {
      backgroundColor: theme.palette.primary.main,
    },
  })
)(Tabs);

export const TPEStyledTabItem = withStyles((theme) =>
  createStyles({
    root: {
      minHeight: 53,
      minWidth: 80,
      [theme.breakpoints.up("md")]: {
        minWidth: 120,
      },
      "&:hover": {
        backgroundColor: Highlights.Tabs,
        "& $wrapper": {
          color: theme.palette.primary.main,
        },
      },
      "&$selected": {
        "& *": {
          color: theme.palette.primary.main,
        },
      },
    },
    selected: {},
    textColorInherit: {
      opacity: 1,
    },
    wrapper: {
      textTransform: "none",
      fontFamily: theme.typography.fontFamily,
      fontSize: AppBarSettings.fontSize,
      fontWeight: FontWeightBold,
      color: theme.palette.secondary.main,
    },
  })
)(Tab);
