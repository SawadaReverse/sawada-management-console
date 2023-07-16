import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControlLabel,
  Checkbox,
  DialogActions,
  Button,
} from "@mui/material";

type Props = {
  isVisible: boolean;
  onSubmit: () => void;
  setIsVisible: (value: boolean) => void;
  isLabelChecked: boolean;
  setIsLabelChecked: (value: boolean) => void;
  isFilterChecked: boolean;
  setIsFilterChecked: (value: boolean) => void;
};

export default function DeleteConfirmDialog(props: Props) {
  const closeDialog = () => props.setIsVisible(false);
  return (
    <Dialog open={props.isVisible}>
      <DialogTitle>Group delete confirm</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={
            <Checkbox
              onChange={(e) => props.setIsLabelChecked(e.target.checked)}
              checked={props.isLabelChecked}
            />
          }
          label="delete label"
        />
        <FormControlLabel
          control={
            <Checkbox
              onChange={(e) => props.setIsFilterChecked(e.target.checked)}
              checked={props.isFilterChecked}
            />
          }
          label="delete filter"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>No</Button>
        <Button onClick={props.onSubmit}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
}
