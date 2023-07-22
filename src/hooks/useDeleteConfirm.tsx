import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
} from "@mui/material";
import { useState } from "react";

type State = {
  isOpen: boolean;
  resolve: (value: Select) => void;
};
const initialState: State = {
  isOpen: false,
  resolve: () => {},
};

type YesOrNo = "YES" | "NO";
type Select = {
  action: YesOrNo;
  isLabelChecked: boolean;
  isFilterChecked: boolean;
};

export const useDeleteConfirm = () => {
  const [state, setState] = useState<State>(initialState);
  const [isLabelChecked, setIsLabelCheck] = useState(false);
  const [isFilterChecked, setIsFilterCheck] = useState(false);

  const confirm = () => {
    const promise: Promise<Select> = new Promise((resolve) => {
      const newState: State = {
        isOpen: true,
        resolve,
      };

      setIsLabelCheck(false);
      setIsFilterCheck(false);
      setState(newState);
    });

    return promise;
  };

  const onLabelClick = () => {
    setIsLabelCheck(!isLabelChecked);
  };

  const onFilterClick = () => {
    setIsFilterCheck(!isFilterChecked);
  };

  const onYesClick = () => {
    state.resolve({
      action: "YES",
      isLabelChecked,
      isFilterChecked,
    });
    setState(initialState);
  };

  const onNoClick = () => {
    state.resolve({
      action: "NO",
      isLabelChecked,
      isFilterChecked,
    });
    setState(initialState);
  };

  const dialog = () => {
    return (
      <Dialog open={state.isOpen} onClose={onNoClick}>
        <DialogTitle>Group delete confirm</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Checkbox checked={isLabelChecked} onClick={onLabelClick} />
            }
            label="delete label"
          />
          <FormControlLabel
            control={
              <Checkbox checked={isFilterChecked} onClick={onFilterClick} />
            }
            label="delete filter"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onNoClick}>No</Button>
          <Button onClick={onYesClick}>Yes</Button>
        </DialogActions>
      </Dialog>
    );
  };

  return {
    confirm,
    dialog,
  };
};
