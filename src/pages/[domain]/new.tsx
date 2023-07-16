import { insertGroupRequest } from "@/types/api/requests/directory";
import { isFailedResponse, isSuccessResponse } from "@/types/api/response";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  CancelOutlined,
  DoNotDisturbOnOutlined,
  TaskAlt,
} from "@mui/icons-material";
import { createLabelRequest } from "@/types/api/requests/gmailLabel";
import { createFilterRequest } from "@/types/api/requests/gmailFilter";
import { useRouter } from "next/router";

export default function CreateGroup() {
  type GroupForm = {
    email: string;
    name: string;
    createLabel: boolean;
    createFilter: boolean;
  };
  const { handleSubmit, setValue, getValues, register, formState } =
    useForm<GroupForm>({});

  const [isNameEdited, setIsNameEdited] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onChangeEmail = (formValue: string) => {
    setValue("email", formValue);

    if (!isNameEdited) {
      setValue("name", formValue.split("@")[0]);
    }
  };

  const onChangeName = (formValue: string) => {
    setValue("name", formValue);
    setIsNameEdited(true);
  };

  const [isCreateLabelChecked, setIsCreateLabelChecked] = useState(false);
  const onChangeCreateLabel = (formValue: boolean) => {
    setIsCreateLabelChecked(formValue);
    if (!formValue) {
      setIsCreateFilterChecked(false);
    }
  };

  const [isCreateFilterChecked, setIsCreateFilterChecked] = useState(false);
  const onChangeCreateFilter = (formValue: boolean) => {
    setIsCreateFilterChecked(formValue);
  };

  const router = useRouter();
  const [dialogIsVisible, setDialogIsVisible] = useState(false);
  const [groupInsertIsComplete, setGroupInsertIsComplete] = useState(0);
  const [labelCreateIsComplete, setLabelCreateIsComplete] = useState(0);
  const [filterCreateIsComplete, setFilterCreateIsComplete] = useState(0);

  const validateRules = {
    email: {
      required: "email is required",
      pattern: {
        value:
          /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
        message: "invalid mail address",
      },
    },
    name: {
      required: "name is required",
    },
  };

  const onSubmit: SubmitHandler<GroupForm> = async () => {
    const form = getValues();
    const groupRequest: insertGroupRequest = {
      email: form.email,
      name: form.name,
    };

    setDialogIsVisible(true);

    const groupResponse = await fetch("/api/group", {
      method: "POST",
      body: JSON.stringify(groupRequest),
    });
    const groupBody = await groupResponse.json();
    if (isSuccessResponse(groupBody)) {
      // TODO: Generics つきの type guard がうまくいかない、要検討
      setGroupInsertIsComplete(1);
    }
    if (isFailedResponse(groupBody)) {
      setErrorMessage(groupBody.message);
      setGroupInsertIsComplete(-1);
      setLabelCreateIsComplete(-2);
      setFilterCreateIsComplete(-2);
      return;
    }

    if (isCreateLabelChecked) {
      const labelRequest: createLabelRequest = {
        name: form.email.split("@")[0],
      };
      const labelResponse = await fetch("/api/label", {
        method: "POST",
        body: JSON.stringify(labelRequest),
      });
      const labelBody = await labelResponse.json();
      if (isSuccessResponse(labelBody)) {
        setLabelCreateIsComplete(1);
      }
      if (isFailedResponse(labelBody)) {
        setErrorMessage(labelBody.message);
        setLabelCreateIsComplete(-1);
        setFilterCreateIsComplete(-2);
        return;
      }

      if (isCreateFilterChecked) {
        const filterRequest: createFilterRequest = {
          toMailAddress: form.email,
          addLabelIds: [labelBody.data.id],
        };
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const filterResponse = await fetch("/api/filter", {
          method: "POST",
          body: JSON.stringify(filterRequest),
        });
        const filterBody = await filterResponse.json();
        if (isSuccessResponse(filterBody)) {
          setFilterCreateIsComplete(1);
        }
        if (isFailedResponse(filterBody)) {
          setErrorMessage(filterBody.message);
          setFilterCreateIsComplete(-1);
          return;
        }
      }
    }

    const { domain } = router.query;
    router.push(`/${domain}/${groupBody.data.id}`);
  };

  return (
    <>
      <Card>
        <CardHeader title="New group" />
        <CardContent>
          <Stack component="form" onSubmit={handleSubmit(onSubmit)}>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <TextField
              {...register("email", {
                ...validateRules.email,
                onChange: (e) => onChangeEmail(e.target.value),
              })}
              label="email"
              error={!!formState.errors?.email?.message}
              helperText={formState.errors?.email?.message}
              margin="normal"
              variant="standard"
            />

            <TextField
              {...register("name", {
                ...validateRules.name,
                onChange: (e) => onChangeName(e.target.value),
              })}
              label="name"
              error={!!formState.errors?.name?.message}
              helperText={formState.errors?.name?.message}
              margin="normal"
              variant="standard"
            />

            <FormControlLabel
              control={
                <Checkbox
                  {...(register("createLabel"),
                  { onChange: (e) => onChangeCreateLabel(e.target.checked) })}
                  checked={isCreateLabelChecked}
                />
              }
              label="create label"
            />

            <FormControlLabel
              control={
                <Checkbox
                  {...(register("createFilter"),
                  { onChange: (e) => onChangeCreateFilter(e.target.checked) })}
                  checked={isCreateFilterChecked}
                />
              }
              label="create filter"
              disabled={!isCreateLabelChecked}
            />

            <Button
              variant="contained"
              type="submit"
              disabled={!formState.isValid}
            >
              INSERT
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={dialogIsVisible}>
        <DialogTitle>Processing...</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex" }}>
            {groupInsertIsComplete === 1 && <TaskAlt />}
            {groupInsertIsComplete === 0 && <CircularProgress />}
            {groupInsertIsComplete === -1 && <CancelOutlined />}
            Group insert
          </Box>
          {isCreateLabelChecked && (
            <Box sx={{ display: "flex" }}>
              {labelCreateIsComplete === 1 && <TaskAlt />}
              {labelCreateIsComplete === 0 && <CircularProgress />}
              {labelCreateIsComplete === -1 && <CancelOutlined />}
              {labelCreateIsComplete === -2 && <DoNotDisturbOnOutlined />}
              Label insert
            </Box>
          )}
          {isCreateFilterChecked && (
            <Box sx={{ display: "flex" }}>
              {filterCreateIsComplete === 1 && <TaskAlt />}
              {filterCreateIsComplete === 0 && <CircularProgress />}
              {filterCreateIsComplete === -1 && <CancelOutlined />}
              {filterCreateIsComplete === -2 && <DoNotDisturbOnOutlined />}
              Filter insert
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
