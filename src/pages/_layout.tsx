import CustomBreadcrumbs from "@/components/customBreadcrumbs";
import NavBar from "@/components/nav-bar";
import { LayoutProps } from "@/types/layouts";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useRouter } from "next/router";

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  return (
    <>
      <CssBaseline />
      <NavBar />
      <Box sx={{ mx: "5%", my: "1%" }}>
        <CustomBreadcrumbs asPath={router.asPath} />
        {children}
      </Box>
    </>
  );
}
