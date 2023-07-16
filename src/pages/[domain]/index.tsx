import { Card, CardActionArea, CardHeader, Fab } from "@mui/material";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import AddIcon from "@mui/icons-material/Add";
import {
  SuccessResponse,
  isFailedResponse,
  isSuccessResponse,
} from "@/types/api/response";
import { groupList } from "@/libs/google-api/types/directory";
import { useRouter } from "next/router";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { domain } = context.query;
  if (!domain || Array.isArray(domain)) {
    // TODO: エラーハンドリング
    throw new Error("bad request");
  }

  type PropType = {
    data?: groupList;
    message?: string;
  };
  const props: PropType = {};
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/group/list?domain=${domain}`,
    { headers: { cookie: context.req.headers.cookie || "" } }
  );
  const responseBody = await response.json();
  if (isSuccessResponse(responseBody)) {
    // TODO: Generics つきの type guard がうまくいかない、要検討
    const typedResponse = responseBody as SuccessResponse<groupList>;
    props.data = typedResponse.data;
  } else if (isFailedResponse(responseBody)) {
    props.message = responseBody.message;
  } else {
    props.message = "Fatal error. Failed to get group list.";
  }

  return { props };
}

export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const router = useRouter();
  const { domain } = router.query;

  if (!props.data && props.message) {
    return (
      <>
        <div>{props.message}</div>
      </>
    );
  }

  return (
    <>
      {props.data!.groups.map((group) => (
        <Card key={group.etag} sx={{ mb: 1 }}>
          <CardActionArea href={`${router.asPath}/${group.id}`}>
            <CardHeader title={group.name} subheader={group.email} />
          </CardActionArea>
        </Card>
      ))}

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        href={`${domain}/new`}
      >
        <AddIcon />
      </Fab>
    </>
  );
}
