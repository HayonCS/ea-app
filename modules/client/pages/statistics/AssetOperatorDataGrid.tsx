// import * as React from "react";
// import { Box, Link, TableBody, Typography } from "@mui/material";
// import { makeStyles } from "@mui/styles";
// import { openInNewTab } from "client/utils/WebUtility";
// import { ProcessDataOperatorTotals } from "client/utilities/DataTypes";

// const useStyles = makeStyles(() => ({
//   root: {
//     // height: "100%",
//     // cursor: "default",
//   },
// //   layout: {
// //     paddingTop: "30px",
// //     display: "grid",
// //     rowGap: "20px",
// //   },
// //   linkStyle: {
// //     fontSize: "18px",
// //   },
// //   title: {
// //     alignSelf: "center",
// //     fontSize: "20px",
// //     fontWeight: "bold",
// //     color: "#000",
// //     paddingRight: "10px",
// //     paddingBottom: "10px",
// //   },
// //   cellStyle: {
// //     padding: "none",
// //     alignItems: "left",
// //     color: "black",
// //     fontSize: "12px",
// //     fontFamily: "inherit",
// //     fontWeight: "bold",
// //   },
// }));

// export const AssetOperatorDataGrid: React.FC<{
//     rows: ProcessDataOperatorTotals[]
// }> = (props) => {
//   const classes = useStyles();

//   const [page, setPage] = React.useState(0);
//   const [pCount, setPCount] = React.useState(0);

//   return (
//     <div className={classes.root}>
//       <TableBody
//             >
//               {props.rows
//                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                 .map((row) => {
//                   const isItemSelected = isSelected(row);
//                   const shortDomain = getShortDomain(row.Type).toUpperCase();
//                   return (
//                     <TableRow
//                       hover={true}
//                       role="checkbox"
//                       tabIndex={-1}
//                       key={row.PlanTitle + row.Type}
//                       selected={isItemSelected}
//                       //Do not add onClick handlers to the TableRow, they must be added to each individual TableCell.
//                       //This fixes a bug where clicking on the HeaderChip would load a test plan once the TestPlanRevisionDrawer was closed.
//                     >
//                       <StyledTableCell
//                         padding="none"
//                         style={{ width: 175 }}
//                         onClick={() => handleClick(row)}
//                       >
//                         <div data-testid="tpRowTitle">{row.PlanTitle}</div>
//                       </StyledTableCell>
//                       <TableCell
//                         padding="none"
//                         align="left"
//                         style={{ width: 125 }}
//                         onClick={() => {
//                           if (!chipClicked) {
//                             handleClick(row);
//                           }
//                         }}
//                       >
//                         <HeaderChip
//                           rev={row.Version}
//                           domain={getDomain(shortDomain)}
//                           size="small"
//                           labelLength="short"
//                           testplan={row.PlanTitle}
//                           locked={row.LockingUser ? true : false}
//                           handleClicked={() => {
//                             setChipClicked(!chipClicked);
//                           }}
//                           handleDrawerClosed={() => {
//                             setChipClicked(!chipClicked);
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell
//                         padding="none"
//                         align="left"
//                         style={{ width: 125 }}
//                         onClick={() => handleClick(row)}
//                       >
//                         <div data-testid="tpRowUser">
//                           {formatUserName(row.LastEditor)}
//                         </div>
//                       </TableCell>
//                       <TableCell
//                         padding="none"
//                         align="left"
//                         style={{ width: 125 }}
//                         onClick={() => handleClick(row)}
//                       >
//                         <div data-testid="tpRowLastEditDate">
//                           {formatModTimeAsDateTime(row.LastEdit)}
//                         </div>
//                       </TableCell>
//                       <TableCell
//                         padding="none"
//                         align="left"
//                         onClick={
//                           row.LockingUser ? undefined : () => handleClick(row)
//                         }
//                       >
//                         <div
//                           data-testid="tpLockingUser"
//                           className={classes.currentUserDisplay}
//                         >
//                           {row.LockingUser ? (
//                             <CurrentUserDisplay
//                               userName={row.LockingUser}
//                               isCurrentUser={false}
//                               slimDisplay={true}
//                             ></CurrentUserDisplay>
//                           ) : (
//                             ""
//                           )}
//                         </div>
//                       </TableCell>
//                       <TableCell
//                         padding="none"
//                         align="left"
//                         onClick={() => handleClick(row)}
//                       >
//                         <div
//                           data-testid="tpRowRevLabel"
//                           style={{
//                             overflow: "hidden",
//                             textOverflow: "ellipsis",
//                             whiteSpace: "nowrap",
//                             width: 300,
//                             color: RevisionLabelColor,
//                           }}
//                         >
//                           {row.RevLabel
//                             ? `"${row.RevLabel.toUpperCase()}"`
//                             : ""}
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               {emptyRows > 0 && (
//                 <TableRow style={{ height: 40 * emptyRows }}>
//                   <TableCell colSpan={5} />
//                 </TableRow>
//               )}
//             </TableBody>
//     </div>
//   );
// };
