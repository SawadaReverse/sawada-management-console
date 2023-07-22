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
          {`Group ${props.type.toLowerCase()}`}
        </Box>

        <Box sx={{ display: "flex" }}>
          {statusIcon(props.labelProgress)}
          {`Label ${props.type.toLowerCase()}`}
        </Box>

        <Box sx={{ display: "flex" }}>
          {statusIcon(props.filterProgress)}
          {`Filter ${props.type.toLowerCase()}`}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
