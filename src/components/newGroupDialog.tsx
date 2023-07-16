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

export type processStatus = "IN_PROGRESS" | "COMPLETED" | "FAILED" | "CANCELED";

type Props = {
  isVisible: boolean;
  insertGroupStatus: processStatus;
  createLabelStatus: processStatus;
  createFilterStatus: processStatus;
};

const statusIcon = (status: processStatus) => {
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

export default function NewGroupDialog(props: Props) {
  return (
    <Dialog open={props.isVisible}>
      <DialogTitle>Processing...</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex" }}>
          {statusIcon(props.insertGroupStatus)}
          Group insert
        </Box>

        <Box sx={{ display: "flex" }}>
          {statusIcon(props.createLabelStatus)}
          Label insert
        </Box>

        <Box sx={{ display: "flex" }}>
          {statusIcon(props.createFilterStatus)}
          Filter insert
        </Box>
      </DialogContent>
    </Dialog>
  );
}
