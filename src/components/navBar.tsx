import { APPLICATION_NAME } from "@/constants/constants";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Link from "@mui/material/Link";

export default function NavBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Link
          variant="h6"
          href="/"
          underline="none"
          sx={{ color: "white", fontWeight: "bold" }}
        >
          {APPLICATION_NAME}
        </Link>
      </Toolbar>
    </AppBar>
  );
}
