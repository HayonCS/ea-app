import * as React from "react";
import { createStyles, makeStyles, withStyles } from "@mui/styles";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableRowProps,
} from "@mui/material";
import VisibilitySensor from "react-visibility-sensor";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    height: "100%",
  },
  tableHeader: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
  },
  toolbar: {
    alignSelf: "baseline",
    marginLeft: "-14px",
  },
  pagination: {
    marginLeft: "45px",
    justifyContent: "flex-end",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    width: 1100,
  },
  tableBody: {
    cursor: "pointer",
  },
  searchContainer: {
    display: "flex",
    marginBottom: "20px",
  },
  searchInput: {
    minWidth: "235px",
  },
}));

const StyledTableCell = withStyles(() =>
  createStyles({
    head: {
      backgroundColor: "white",
      color: "black",
    },
    body: {
      fontSize: "12px",
      // fontFamily: theme.typography.fontFamily,
      fontWeight: "bold",
      paddingTop: "12px",
      paddingBottom: "12px",
    },
  })
)(TableCell);

const CustomTableRow: React.FC<TableRowProps> = (props) => {
  const { children, ...other } = props;

  const [isVisible, setIsVisible] = React.useState(false);

  const handleChange = (visible: boolean) => {
    console.log(visible);
    setIsVisible(visible);
  };

  return (
    <VisibilitySensor onChange={handleChange} key={props.key}>
      {isVisible && (
        <TableRow {...other}>{React.Children.only(children)}</TableRow>
      )}
    </VisibilitySensor>
  );
};

// class CustomTableRow extends TableRow {
//   onChange(isVisible: boolean) {
//       this.setState({ isVisible });
//   };

//   render () {
//       const { isVisible } = this.state as any;

//       return (
//           <VisibilitySensor onChange={this.onChange}>
//               {isVisible && (this.props as any).children}
//           </VisibilitySensor>
//       );
//    }
// }

export const DataGridInfinite: React.FC<{
  rows: any;
}> = (props) => {
  const classes = useStyles();

  const [visibilities, setVisibilities] = React.useState<{
    [k: string]: boolean;
  }>({});

  React.useEffect(() => {
    const v = props.rows.map((row: any, i: number) => {
      return {
        [i.toString()]: false,
      };
    });
    setVisibilities(v);
  }, [props]);

  return (
    <TableContainer className={classes.container}>
      <Table size={"small"} data-testid="testPlanLibraryTableInner">
        {/* <TestPlanLibraryTableHeader
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            /> */}
        <TableBody
          data-testid="testPlanLibraryTableBody"
          className={classes.tableBody}
        >
          {props.rows.map((row: any, index: number) => {
            // const isItemSelected = isSelected(row);
            // const shortDomain = getShortDomain(row.Type).toUpperCase();
            return (
              <VisibilitySensor
                key={index}
                onChange={(visible: boolean) => {
                  setVisibilities({
                    ...visibilities,
                    [index.toString()]: visible,
                  });
                }}
              >
                <TableRow
                  hover={true}
                  role="checkbox"
                  tabIndex={-1}
                  key={index}
                  style={{
                    height: "30px",
                    display: !visibilities[index.toString()] ? "none" : "",
                  }}
                >
                  <StyledTableCell padding="none" style={{ width: 175 }}>
                    <div data-testid="tpRowTitle">
                      {row.TestDateTime.toLocaleString()}
                    </div>
                  </StyledTableCell>
                  <TableCell padding="none" align="left" style={{ width: 125 }}>
                    <div>{row.Line}</div>
                  </TableCell>
                  <TableCell padding="none" align="left" style={{ width: 125 }}>
                    <div data-testid="tpRowUser">{row.Asset}</div>
                  </TableCell>
                  <TableCell padding="none" align="left" style={{ width: 125 }}>
                    <div data-testid="tpRowUser">{row.PartNumber}</div>
                  </TableCell>
                  <TableCell padding="none" align="left" style={{ width: 125 }}>
                    <div data-testid="tpRowUser">{row.Operator}</div>
                  </TableCell>
                  <TableCell padding="none" align="left" style={{ width: 125 }}>
                    <div data-testid="tpRowUser">{row.PassFail}</div>
                  </TableCell>
                  <TableCell padding="none" align="left" style={{ width: 125 }}>
                    <div data-testid="tpRowUser">{row.OperationId}</div>
                  </TableCell>
                  <TableCell padding="none" align="left" style={{ width: 125 }}>
                    <div data-testid="tpRowUser">{row.MetaDataId}</div>
                  </TableCell>
                  <TableCell padding="none" align="left" style={{ width: 125 }}>
                    <div data-testid="tpRowUser">{row.IdentifierCode}</div>
                  </TableCell>
                  <TableCell padding="none" align="left" style={{ width: 125 }}>
                    <div data-testid="tpRowUser">{row.IdentifierCode2}</div>
                  </TableCell>
                  <TableCell padding="none" align="left" style={{ width: 125 }}>
                    <div data-testid="tpRowUser">{row.Barcode}</div>
                  </TableCell>
                </TableRow>
                {/* {!visibilities[index.toString()] ? (
                  <TableRow
                    hover={true}
                    role="checkbox"
                    tabIndex={-1}
                    key={index}
                    style={{
                      height: "30px",
                    }}
                  >
                    <></>
                  </TableRow>
                ) : (
                  <TableRow
                    hover={true}
                    role="checkbox"
                    tabIndex={-1}
                    key={index}
                    style={{
                      height: "30px",
                      // display: !visibilities[index.toString()] ? "none" : "",
                    }}
                  >
                    <StyledTableCell padding="none" style={{ width: 175 }}>
                      <div data-testid="tpRowTitle">
                        {row.OpEndTime.toLocaleString()}
                      </div>
                    </StyledTableCell>
                    <TableCell
                      padding="none"
                      align="left"
                      style={{ width: 125 }}
                    >
                      <div>{row.Line}</div>
                    </TableCell>
                    <TableCell
                      padding="none"
                      align="left"
                      style={{ width: 125 }}
                    >
                      <div data-testid="tpRowUser">{row.Asset}</div>
                    </TableCell>
                    <TableCell
                      padding="none"
                      align="left"
                      style={{ width: 125 }}
                    >
                      <div data-testid="tpRowUser">{row.PartNumber}</div>
                    </TableCell>
                    <TableCell
                      padding="none"
                      align="left"
                      style={{ width: 125 }}
                    >
                      <div data-testid="tpRowUser">{row.Operator}</div>
                    </TableCell>
                    <TableCell
                      padding="none"
                      align="left"
                      style={{ width: 125 }}
                    >
                      <div data-testid="tpRowUser">{row.PassFail}</div>
                    </TableCell>
                    <TableCell
                      padding="none"
                      align="left"
                      style={{ width: 125 }}
                    >
                      <div data-testid="tpRowUser">{row.OperationId}</div>
                    </TableCell>
                    <TableCell
                      padding="none"
                      align="left"
                      style={{ width: 125 }}
                    >
                      <div data-testid="tpRowUser">{row.MetaDataId}</div>
                    </TableCell>
                    <TableCell
                      padding="none"
                      align="left"
                      style={{ width: 125 }}
                    >
                      <div data-testid="tpRowUser">{row.IdentifierCode}</div>
                    </TableCell>
                    <TableCell
                      padding="none"
                      align="left"
                      style={{ width: 125 }}
                    >
                      <div data-testid="tpRowUser">{row.IdentifierCode2}</div>
                    </TableCell>
                    <TableCell
                      padding="none"
                      align="left"
                      style={{ width: 125 }}
                    >
                      <div data-testid="tpRowUser">{row.Barcode}</div>
                    </TableCell>
                  </TableRow>
                )} */}
              </VisibilitySensor>
            );
          })}
          {/* {emptyRows > 0 && (
                <TableRow style={{ height: 40 * emptyRows }}>
                  <TableCell colSpan={5} />
                </TableRow>
              )} */}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
