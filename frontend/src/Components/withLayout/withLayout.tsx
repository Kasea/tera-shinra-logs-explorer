import React from "react";

const withLayout = (Component: React.FC<any>) => {
  const WithLayout = (props: any) => {
    return <Component {...props} />;
  };

  return WithLayout;
};

export default withLayout;
