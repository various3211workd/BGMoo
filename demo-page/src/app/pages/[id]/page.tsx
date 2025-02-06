import { FC } from "react";
import Content0 from "./0";
import Content1 from "./1";
import Content2 from "./2";
import Header from "./header";
import Footer from "./footer";

interface DynamicPageProps {
  params: { id: number };
}

const StatusPage: FC<DynamicPageProps> = ({ params }) => {
  const id = params.id;
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-32 max-w-2xl">
        {/*
      {params.id ? (
        <div dangerouslySetInnerHTML={{ __html: contents[params.id] }}></div>
      ) : (
        ""
      )}
      */}
        {id == 0 && <Content0 />}
        {id == 1 && <Content1 />}
        {id == 2 && <Content2 />}
      </div>
      <Footer />
    </>
  );
};
export default StatusPage;
