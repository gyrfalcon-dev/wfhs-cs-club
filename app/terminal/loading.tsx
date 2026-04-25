import { LoadingHeader, LoadingList } from "@/app/_components/public-route-shells";

export default function TerminalLoading() {
  return (
    <>
      <LoadingHeader titleWidth="10rem" subtitleWidth="34rem" />
      <LoadingList />
    </>
  );
}
