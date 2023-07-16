import {
  TaskAlt,
  CancelOutlined,
  DoNotDisturbOnOutlined,
} from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  CircularProgress,
} from "@mui/material";

export type Progress = "IN_PROGRESS" | "COMPLETED" | "FAILED" | "CANCELED";

type Props = {
  isVisible: boolean;
  type: "CREATE" | "DELETE";
  groupProgress: Progress;
  labelProgress: Progress;
  filterProgress: Progress;
};

const statusIcon = (status: Progress) => {
  switch (status) {
    case "IN_PROGRESS":
      return <CircularProgress />;
    case "COMPLETED":
      return <TaskAlt />;
    case "FAILED":
      return <CancelOutlined />;
    case "CANCELED":
      return <DoNotDisturbOnOutlined />;
  }
};

export default function ProgressDialog(props: Props) {
  return (
    <Dialog open={props.isVisible}>
      <DialogTitle>Processing...</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex" }}>
          {statusIcon(props.groupProgress)}
          {props.type === "CREATE" && "Group insert"}
          {props.type === "DELETE" && "Group delete"}
        </Box>

        <Box sx={{ display: "flex" }}>
          {statusIcon(props.labelProgress)}
          {props.type === "CREATE" && "Label insert"}
          {props.type === "DELETE" && "Label delete"}
        </Box>

        <Box sx={{ display: "flex" }}>
          {statusIcon(props.filterProgress)}
          {props.type === "CREATE" && "Filter insert"}
          {props.type === "DELETE" && "Filter delete"}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
