import * as React from "react";
import {
  Box,
  Card,
  CardProps,
  Divider,
  Tooltip,
  Typography,
} from "@mui/material";

interface InfoCardProps extends React.PropsWithChildren, CardProps {
  title: string;
  titleColor: string;
  borderColor: string;
  tooltip?: string;
}

export const InformationCard: React.FC<InfoCardProps> = (props) => {
  return (
    <Card
      variant="outlined"
      sx={{ width: "100%", textAlign: "center", ...props.sx }}
      style={{
        border: `1px solid ${props.borderColor}`,
      }}
    >
      <Box
        sx={{
          p: 0,
          backgroundColor: props.borderColor,
        }}
      >
        <Tooltip
          title={props.tooltip}
          placement="top-start"
          followCursor={true}
          style={{ cursor: "help" }}
        >
          <Typography
            style={{
              alignSelf: "center",
              fontSize: "18px",
              fontWeight: "500",
              color: props.titleColor,
            }}
          >
            {props.title}
          </Typography>
        </Tooltip>
      </Box>
      <Divider />
      <Box
        sx={{
          // p: 1,
          maxHeight: 389,
          overflowY: "auto",
          scrollBehavior: "auto",
        }}
      >
        {props.children}
      </Box>
    </Card>
  );
};
