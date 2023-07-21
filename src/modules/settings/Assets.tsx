import * as React from "react";
import {
  Button,
  Checkbox,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ASSETLIST } from "../../definitions";
import { shallowEqual, useSelector } from "react-redux";
import { AppState } from "../../store/type";

const useStyles = makeStyles(() => ({
  root: {
    textAlign: "center",
    margin: "0px 16px 16px 64px",
  },
  tabBar: {
    flexGrow: 1,
    backgroundColor: "primary",
  },
  tabStyle: {
    fontWeight: "bolder",
    fontSize: "1rem",
  },
  tabIndicator: {
    height: "20px",
  },
}));

function not(a: string[], b: string[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: string[], b: string[]) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

export const AssetsSettingsPanel: React.FC<{
  assets?: string[];
  onChange?: (assets: string[]) => void;
}> = (props) => {
  const classes = useStyles();

  const [loadedProps, setLoadedProps] = React.useState(false);

  const assetListRedux = useSelector(
    (state: AppState) => state.assetList,
    shallowEqual
  );

  const [checked, setChecked] = React.useState<string[]>([]);
  const [left, setLeft] = React.useState<string[]>(assetListRedux ?? ASSETLIST);
  const [right, setRight] = React.useState<string[]>(props.assets ?? []);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  React.useEffect(() => {
    if (props.assets && !loadedProps) {
      setRight(props.assets);
      setLeft(not(assetListRedux ?? ASSETLIST, props.assets));
      setLoadedProps(true);
    }
  }, [props, loadedProps, assetListRedux]);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllRight = () => {
    const newRight = right.concat(left);
    setRight(newRight);
    setLeft([]);
    if (props.onChange) props.onChange(newRight);
  };

  const handleCheckedRight = () => {
    const newRight = right.concat(leftChecked);
    setRight(newRight);
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
    if (props.onChange) props.onChange(newRight);
  };

  const handleCheckedLeft = () => {
    const newRight = not(right, rightChecked);
    setLeft(left.concat(rightChecked));
    setRight(newRight);
    setChecked(not(checked, rightChecked));
    if (props.onChange) props.onChange(newRight);
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
    if (props.onChange) props.onChange([]);
  };
  const customList = (items: string[]) => (
    <Paper sx={{ width: 240, height: 300, overflow: "auto" }}>
      <List dense component="div" role="list">
        {items
          .sort((a, b) => a.localeCompare(b))
          .map((value: string, index) => {
            const labelId = `transfer-list-item-${value}-label`;

            return (
              <ListItem
                key={index}
                role="listitem"
                onClick={handleToggle(value)}
                style={{ cursor: "pointer" }}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    //disableRipple
                    inputProps={{
                      "aria-labelledby": labelId,
                    }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={`${value}`} />
              </ListItem>
            );
          })}
      </List>
    </Paper>
  );

  return (
    <div className={classes.root}>
      <div
        style={{ display: "flex", marginLeft: "24px", alignItems: "center" }}
      >
        <div style={{ width: "600px" }}>
          <Grid
            container={true}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>
              <Typography
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: "default",
                  marginBottom: "16px",
                }}
              >
                {"ALL ASSETS"}
              </Typography>
              {customList(left)}
            </Grid>
            <Grid item>
              <Grid container direction="column" alignItems="center">
                <Button
                  sx={{ my: 0.5 }}
                  variant="outlined"
                  size="small"
                  onClick={handleAllRight}
                  disabled={left.length === 0}
                  aria-label="move all right"
                >
                  ≫
                </Button>
                <Button
                  sx={{ my: 0.5 }}
                  variant="outlined"
                  size="small"
                  onClick={handleCheckedRight}
                  disabled={leftChecked.length === 0}
                  aria-label="move selected right"
                >
                  &gt;
                </Button>
                <Button
                  sx={{ my: 0.5 }}
                  variant="outlined"
                  size="small"
                  onClick={handleCheckedLeft}
                  disabled={rightChecked.length === 0}
                  aria-label="move selected left"
                >
                  &lt;
                </Button>
                <Button
                  sx={{ my: 0.5 }}
                  variant="outlined"
                  size="small"
                  onClick={handleAllLeft}
                  disabled={right.length === 0}
                  aria-label="move all left"
                >
                  ≪
                </Button>
              </Grid>
            </Grid>
            <Grid item>
              <Typography
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: "default",
                  marginBottom: "16px",
                }}
              >
                {"MY ASSETS"}
              </Typography>
              {customList(right)}
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};
