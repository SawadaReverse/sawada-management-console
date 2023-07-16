import {
  isSuccessResponse,
  SuccessResponse,
  isFailedResponse,
} from "@/types/api/response";
import {
  Card,
  CardHeader,
  CardContent,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TableRow,
  TableCell,
  Table,
  TableContainer,
  TableBody,
  Alert,
  AlertTitle,
  FormControlLabel,
  Checkbox,
  Box,
  CircularProgress,
} from "@mui/material";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { useRouter } from "next/router";
import { filter } from "@/libs/google-api/types/gmailFilter";
import { label } from "@/libs/google-api/types/gmailLabel";
import { StatusCodes } from "http-status-codes";
import { group } from "@/libs/google-api/types/directory";
import {
  CancelOutlined,
  CheckBox,
  DoNotDisturbOnOutlined,
  TaskAlt,
} from "@mui/icons-material";
import { BadRequestError } from "@/types/api/error";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { groupKey } = context.query;
  if (!groupKey || Array.isArray(groupKey)) {
    throw new Error("bad request");
  }

  type PropType = {
    data: {
      group: group;
      filter?: filter;
      label?: label;
    };
    message: {
      group?: string;
      filter?: string;
      label?: string;
    };
  };
  const props: PropType = {
    data: {
      group: {
        id: "",
        name: "",
        email: "",
        description: "",
        adminCreated: false,
        aliases: [],
        nonEditableAliases: [],
        directMembersCount: "",
        kind: "",
        etag: "",
      },
    },
    message: {},
  };

  const groupResponse = await fetch(
    `${process.env.NEXTAUTH_URL}/api/group?groupKey=${groupKey}`,
    { headers: { cookie: context.req.headers.cookie || "" } }
  );
  const groupBody = await groupResponse.json();
  if (isSuccessResponse(groupBody)) {
    // TODO: Generics つきの type guard がうまくいかない、要検討
    const group = groupBody as SuccessResponse<group>;
    props.data.group = group.data;
  } else if (isFailedResponse(groupBody)) {
    props.message.group = groupBody.message;
    return { props };
  }

  const filterResponse = await fetch(
    `${process.env.NEXTAUTH_URL}/api/filter?toMailAddress=${props.data.group.email}`,
    { headers: { cookie: context.req.headers.cookie || "" } }
  );
  const filterBody = await filterResponse.json();
  if (isSuccessResponse(filterBody)) {
    // TODO: Generics つきの type guard がうまくいかない、要検討
    const filter = filterBody as SuccessResponse<filter>;
    props.data.filter = filter.data;
  } else if (
    isFailedResponse(filterBody) &&
    filterBody.code !== StatusCodes.NOT_FOUND
  ) {
    props.message.filter = filterBody.message;
  }

  const labelName = props.data.group.email.split("@")[0];
  const labelResponse = await fetch(
    `${process.env.NEXTAUTH_URL}/api/label?name=${labelName}`,
    { headers: { cookie: context.req.headers.cookie || "" } }
  );
  const labelBody = await labelResponse.json();
  if (isSuccessResponse(labelBody)) {
    // TODO: Generics つきの type guard がうまくいかない、要検討
    const label = labelBody as SuccessResponse<label>;
    props.data.label = label.data;
  } else if (
    isFailedResponse(labelBody) &&
    labelBody.code !== StatusCodes.NOT_FOUND
  ) {
    props.message.label = labelBody.message;
  }

  return { props };
}

export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const router = useRouter();
  const [confirmDialogIsVisible, setConfirmDialogIsVisible] = useState(false);
  const [isDeleteLabelChecked, setIsDeleteLabelChecked] = useState(false);
  const [isDeleteFilterChecked, setIsDeleteFilterChecked] = useState(false);
  const closeConfirmDialog = () => setConfirmDialogIsVisible(false);
  const openConfirmDialog = () => setConfirmDialogIsVisible(true);

  const [progressDialogIsVisible, setProgressDialogIsVisible] = useState(false);
  const [groupDeleteIsComplete, setGroupDeleteIsComplete] = useState(0);
  const [labelDeleteIsComplete, setLabelDeleteIsComplete] = useState(0);
  const [filterDeleteIsComplete, setFilterDeleteIsComplete] = useState(0);

  const deleteGroup = async () => {
    closeConfirmDialog();
    setProgressDialogIsVisible(true);
    const groupKey = props.data.group.id;
    const groupResponse = await fetch(`/api/group/?groupKey=${groupKey}`, {
      method: "DELETE",
    });
    const groupBody = await groupResponse.json();
    if (isSuccessResponse(groupBody)) {
      setGroupDeleteIsComplete(1);
    }
    if (isFailedResponse(groupBody)) {
      setGroupDeleteIsComplete(-1);
      setLabelDeleteIsComplete(-2);
      setFilterDeleteIsComplete(-2);
      return;
    }

    if (isDeleteLabelChecked) {
      if (!props.data.label) {
        throw new BadRequestError();
      }
      const labelResponse = await fetch(
        `/api/label/?id=${props.data.label.id}`,
        {
          method: "DELETE",
        }
      );
      const labelBody = await labelResponse.json();
      if (isSuccessResponse(labelBody)) {
        setLabelDeleteIsComplete(1);
      }
      if (isFailedResponse(labelBody)) {
        setLabelDeleteIsComplete(-1);
        setFilterDeleteIsComplete(-2);
        return;
      }
    }

    if (isDeleteFilterChecked) {
      if (!props.data.filter) {
        throw new BadRequestError();
      }
      const filterResponse = await fetch(
        `/api/filter/?id=${props.data.filter.id}`,
        {
          method: "DELETE",
        }
      );
      const filterBody = await filterResponse.json();
      if (isSuccessResponse(filterBody)) {
        setFilterDeleteIsComplete(1);
      }
      if (isFailedResponse(filterBody)) {
        setFilterDeleteIsComplete(-1);
        return;
      }
    }

    const { domain } = router.query;
    router.push(`/${domain}/`);
  };

  return (
    <>
      {Object.keys(props.message).length > 0 &&
        Object.entries(props.message).map(([key, value]) => {
          return (
            <Alert severity="error" key={key}>
              <AlertTitle>Failed to get {key}</AlertTitle>
              {value}
            </Alert>
          );
        })}
      <Card>
        <CardHeader title={props.data.group.name} />
        <CardContent>
          <TableContainer>
            <Table>
              <TableBody>
                {Object.entries(props.data.group).map(([key, value]) => {
                  return (
                    <TableRow key={key}>
                      <TableCell sx={{ fontWeight: "bold" }}>{key}</TableCell>
                      <TableCell>
                        {Array.isArray(value)
                          ? value.map((v) => value.join(","))
                          : String(value) || "(none)"}
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Gmail label</TableCell>
                  <TableCell>{props.data.label?.id || "(none)"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Gmail filter
                  </TableCell>
                  <TableCell>{props.data.filter?.id || "(none)"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={confirmDialogIsVisible} onClose={closeConfirmDialog}>
        <DialogTitle>Group delete confirm</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Checkbox
                onChange={(e) => setIsDeleteLabelChecked(e.target.checked)}
                checked={isDeleteLabelChecked}
              />
            }
            label="delete label"
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={(e) => setIsDeleteFilterChecked(e.target.checked)}
                checked={isDeleteFilterChecked}
              />
            }
            label="delete filter"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog}>No</Button>
          <Button onClick={deleteGroup}>Yes</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={progressDialogIsVisible}>
        <DialogTitle>Processing...</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex" }}>
            {groupDeleteIsComplete === 1 && <TaskAlt />}
            {groupDeleteIsComplete === 0 && <CircularProgress />}
            {groupDeleteIsComplete === -1 && <CancelOutlined />}
            Group delete
          </Box>
          {isDeleteLabelChecked && (
            <Box sx={{ display: "flex" }}>
              {labelDeleteIsComplete === 1 && <TaskAlt />}
              {labelDeleteIsComplete === 0 && <CircularProgress />}
              {labelDeleteIsComplete === -1 && <CancelOutlined />}
              {labelDeleteIsComplete === -2 && <DoNotDisturbOnOutlined />}
              Label delete
            </Box>
          )}
          {isDeleteFilterChecked && (
            <Box sx={{ display: "flex" }}>
              {filterDeleteIsComplete === 1 && <TaskAlt />}
              {filterDeleteIsComplete === 0 && <CircularProgress />}
              {filterDeleteIsComplete === -1 && <CancelOutlined />}
              {filterDeleteIsComplete === -2 && <DoNotDisturbOnOutlined />}
              Filter delete
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={openConfirmDialog}
      >
        <DeleteIcon />
      </Fab>
    </>
  );
}
