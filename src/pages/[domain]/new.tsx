import { insertGroupRequest } from "@/types/api/requests/directory";
import { isFailedResponse, isSuccessResponse } from "@/types/api/response";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
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
import NewGroupDialog, { processStatus } from "@/components/new-group-dialog";

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
  const [insertGroupStatus, setInsertGroupStatus] =
    useState<processStatus>("IN_PROGRESS");
  const [createLabelStatus, setCreateLabelStatus] =
    useState<processStatus>("CANCELED");
  const [createFilterStatus, setCreateFilterStatus] =
    useState<processStatus>("CANCELED");

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
      setInsertGroupStatus("COMPLETED");
    }
    if (isFailedResponse(groupBody)) {
      setErrorMessage(groupBody.message);
      setInsertGroupStatus("FAILED");
      setCreateLabelStatus("CANCELED");
      setCreateFilterStatus("CANCELED");
      return;
    }

    if (isCreateLabelChecked) {
      setCreateLabelStatus("IN_PROGRESS");
      const labelRequest: createLabelRequest = {
        name: form.email.split("@")[0],
      };
      const labelResponse = await fetch("/api/label", {
        method: "POST",
        body: JSON.stringify(labelRequest),
      });
      const labelBody = await labelResponse.json();
      if (isSuccessResponse(labelBody)) {
        setCreateLabelStatus("COMPLETED");
      }
      if (isFailedResponse(labelBody)) {
        setErrorMessage(labelBody.message);
        setCreateLabelStatus("FAILED");
        setCreateFilterStatus("CANCELED");
        return;
      }

      if (isCreateFilterChecked) {
        setCreateFilterStatus("IN_PROGRESS");
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
          setCreateFilterStatus("COMPLETED");
        }
        if (isFailedResponse(filterBody)) {
          setErrorMessage(filterBody.message);
          setCreateFilterStatus("FAILED");
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

      <NewGroupDialog
        isVisible={dialogIsVisible}
        insertGroupStatus={insertGroupStatus}
        createLabelStatus={createLabelStatus}
        createFilterStatus={createFilterStatus}
      />
    </>
  );
}
