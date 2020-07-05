import React from "react";
import "./Main.css";

import withLayout from "Components/withLayout";
import { getAllRuns } from "Utils";

const Main = () => {
  const [runs, setRuns] = React.useState<string[]>([]);

  React.useEffect(() => {
    getAllRuns().then(setRuns).catch(console.error);
  }, []);

  return (
    <div className="mainRoot">
      {runs.map((data, idx) => (
        <div key={idx}>
          <a href={`/runs/${data}`}>{data}</a>
        </div>
      ))}
    </div>
  );
};

export default withLayout(Main);
