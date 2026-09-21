import ReturnTab from "./ReturnTab";

/*
  Every concept site is another brand with its own chrome, so the WebMinor
  header and footer stay out of /demo. This tab is the one WebMinor element
  that follows the visitor through all of them: the way back to the work page.
*/
export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ReturnTab />
    </>
  );
}
