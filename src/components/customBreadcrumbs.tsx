import { KeyboardDoubleArrowRight, Home } from "@mui/icons-material";
import { Breadcrumbs } from "@mui/material";
import Link from "next/link";

type Prop = {
  asPath: string;
};

export default function CustomBreadcrumbs(props: Prop) {
  const splitted = decodeURI(props.asPath)
    .split("?")[0]
    .split("/")
    .filter((path) => path !== "");

  let links = [""];
  for (let cnt = 0; cnt < splitted.length; cnt++)
    links.push(links[cnt] + "/" + splitted[cnt]);
  links = links.slice(1);

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={<KeyboardDoubleArrowRight fontSize="small" />}
    >
      <Link href="/">
        <Home />
      </Link>
      {splitted.map((path, i) => (
        <Link href={links[i]} key={path}>
          {path}
        </Link>
      ))}
    </Breadcrumbs>
  );
}
