import { ReactElement } from "react";

type NextPageWithLayout<P = { session: Session }, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export type LayoutProps = Required<{
  readonly children: ReactElement;
}>;
