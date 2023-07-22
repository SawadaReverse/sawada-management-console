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
  TableRow,
  TableCell,
  Table,
  TableContainer,
  TableBody,
  Alert,
  AlertTitle,
} from "@mui/material";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { useRouter } from "next/router";
import { filter } from "@/libs/google-api/types/gmailFilter";
import { label } from "@/libs/google-api/types/gmailLabel";
import { StatusCodes } from "http-status-codes";
import { group } from "@/libs/google-api/types/directory";
import { BadRequestError } from "@/types/api/error";
import ProgressDialog, { Progress } from "@/components/progressDialog";
import { useDeleteConfirm } from "@/hooks/useDeleteConfirm";

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
  const deleteConfim = useDeleteConfirm();
  const [progressDialogIsVisible, setProgressDialogIsVisible] = useState(false);
  const [deleteGroupProgress, setDeleteGroupProgress] =
    useState<Progress>("IN_PROGRESS");
  const [deleteLabelProgress, setDeleteLabelProgress] =
    useState<Progress>("CANCELED");
  const [deleteFilterProgress, setDeleteFilterProgress] =
    useState<Progress>("CANCELED");

  const deleteGroup = async () => {
    const select = await deleteConfim.confirm();
    if (select.action === "NO") {
      return;
    }

    setProgressDialogIsVisible(true);
    const groupKey = props.data.group.id;
    const groupResponse = await fetch(`/api/group/?groupKey=${groupKey}`, {
      method: "DELETE",
    });
    const groupBody = await groupResponse.json();
    if (isSuccessResponse(groupBody)) {
      setDeleteGroupProgress("COMPLETED");
    }
    if (isFailedResponse(groupBody)) {
      setDeleteGroupProgress("FAILED");
      setDeleteLabelProgress("CANCELED");
      setDeleteFilterProgress("CANCELED");
      return;
    }

    if (select.isLabelChecked) {
      if (!props.data.label) {
        throw new BadRequestError();
      }

      setDeleteLabelProgress("IN_PROGRESS");
      const labelResponse = await fetch(
        `/api/label/?id=${props.data.label.id}`,
        {
          method: "DELETE",
        }
      );
      const labelBody = await labelResponse.json();
      if (isSuccessResponse(labelBody)) {
        setDeleteLabelProgress("COMPLETED");
      }
      if (isFailedResponse(labelBody)) {
        setDeleteLabelProgress("FAILED");
        setDeleteFilterProgress("CANCELED");
        return;
      }
    }

    if (select.isFilterChecked) {
      if (!props.data.filter) {
        throw new BadRequestError();
      }

      setDeleteFilterProgress("IN_PROGRESS");
      const filterResponse = await fetch(
        `/api/filter/?id=${props.data.filter.id}`,
        {
          method: "DELETE",
        }
      );
      const filterBody = await filterResponse.json();
      if (isSuccessResponse(filterBody)) {
        setDeleteFilterProgress("COMPLETED");
      }
      if (isFailedResponse(filterBody)) {
        setDeleteFilterProgress("FAILED");
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

      {deleteConfim.dialog()}

      <ProgressDialog
        isVisible={progressDialogIsVisible}
        type="DELETE"
        groupProgress={deleteGroupProgress}
        filterProgress={deleteFilterProgress}
        labelProgress={deleteLabelProgress}
      />

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={deleteGroup}
      >
        <DeleteIcon />
      </Fab>
    </>
  );
}
