export const GentexBlue = "#0d51a6";

export const AppFont = "Roboto";
export const FontWeightBold = 500;

export const TooltipDelayMs = 500;

//TODO 17px is the scrollbar width on Windows\Chrome, need to compute rather than hard code
export const ScrollBarWidth = 17;

export const RevisionLabelColor = "red";

export const enum AppBarSettings {
  fontSize = "14px",
  logoSize = 150,
  separatorSize = 20,
}

export const enum PhaseColors {
  Init = "#c982e3", //initPurple
  Load = "#31c7b9", //loadTeal
  Body = "#f57c00", //bodyOrange
  Unload = "#6684d8", //unloadBlue
  Teardown = "#ffca28", //teardownGold
  Configuration = "#ABABAB", //White Smoke
  Subroutine = "#FF6D6A", //Pastel Red
  Measurement = "#8FBC8B", //DarkSeaGreen
}

export const enum PanelColors {
  Background = "#f5f5f5",
  Tabs = "#f5f5f5",
  MenuHeader = "rgba(0, 0, 0, .03)",
  MenuBackground = "white",
}

export const enum SearchColors {
  SearchControls = "white",
  SearchResults = "white",
  SearchHighlight = "#F2F3F4",
  SearchBorders = "#D9D9D9",
}

export const enum BackgroundColors {
  Table = "white",
  Header = "#d9e8f7", //This gets overwritten when we load the domain.
  ExecutionBar = "white",
  PropertyEditor = "white",
}

export const enum DomainColors {
  Prod = "rgb(217, 247, 232)",
  Eng = "rgb(217, 232, 247)",
}

export const enum Highlights {
  Shade = "#f2f2f2", //light gray
  Cursor = "#999999",
  InsertTarget = "#999999",
  OverlayButton = "#999999",
  Tabs = "rgba(29, 161, 242, 0.1)",
}

export const enum GutterSizes {
  AppGutter = 45,
  TableGutter = 30, //Minimum will be the table scrollbar width
  PanelGutter = 22,
}

export const enum TableRows {
  PillWidth = "11px",
  PillRadius = "5.5px",
  ConnectorWidth = "3px",
  StartWidth = "30px",
  EndWidth = 7,
}

export const enum TableHeights {
  Station = 60,
  PartNumber = 35,
  Group = 40,
  EvaluationPrimary = 30,
  EvaluationSecondary = 265,
  BindingCallPrimary = 30,
  BindingCallSecondary = 265,
}

/**
 * The panel width should be optimized to take up 1/3 of the app width at 1/2 screen width.
 */
export const enum PanelWidths {
  Narrow = 320,
  SearchVisible = 425,
  Normal = 500,
  Large = 700,
  Wide = 1200,
}

export const enum SearchPanelWidths {
  Narrow = 200,
  Normal = 225,
  Large = 250,
  Wide = 350,
}

export const enum BarHeights {
  AppBar = 48,
  TestPlanHeader = 50,
  StationTabs = 55,
  ColumnHeader = 44,
  BottomBarTabs = 40,
  AnalysisBar = 250,
  ExecutionBar = 75,
}

export const enum TimeColors {
  Good = "#90ee90",
  Bad = "#ff7f7f",
  Neutral = "#cdcdcd",

  TextGood = "#007700",
  TextBad = "#770000",
  TextNeutral = "#333333",
}

export const enum PanelLabelWidths {
  Label = 90,
}

export const enum PanelLabelFonts {
  Size = 12,
  MarginLeft = 10,
}
