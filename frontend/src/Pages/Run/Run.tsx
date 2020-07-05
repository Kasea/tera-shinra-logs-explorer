import React from "react";
import { withRouter, RouteComponentProps } from "react-router";
import "./Run.css";

import { ShinraExport } from "Interfaces";
import { getRunData } from "../../Utils";
import Timeline from "Components/Timeline";
import withLayout from "Components/withLayout";
import { TimelineProps } from "Components/Timeline/Timeline";

const DisplayRunStats = (props: TimelineProps) => {
  const player = props.players[props.active];

  let damage = 0;
  for (const skill of player.dealtSkillLog) {
    if (skill.type !== 1) continue;
    if (!(props.startGraph <= skill.time && skill.time <= props.endGraph))
      continue;

    damage += +skill.amount;
  }

  const dps = damage / (props.endGraph - props.startGraph);

  const data = {
    name: player.playerName,
    dps: `${Math.floor(dps / 10) / 100} M/s`,
    duration: (props.endGraph - props.startGraph) / 1000,
  };

  return (
    <div className="displayRunStats">
      <table>
        {Object.entries(data).map(([key, value], idx) => (
          <tr key={idx}>
            <td>{key}:</td>
            <td>{value}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};

const DisplayRunData = (props: ShinraExport) => {
  const [selected, setSelected] = React.useState(-1);
  const [start, setStart] = React.useState(0);
  const [end, setEnd] = React.useState(+props.fightDuration);

  return (
    <div className="displayRunData">
      <a href="/">back</a>

      <div className="displayRunDataButtons">
        {props.players.map((player, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelected(idx);
            }}
          >
            {player.playerName}
          </button>
        ))}
      </div>

      <div className="inputContainer">
        <input value={start} onChange={(e) => setStart(+e.target.value)} />
        to (max {props.fightDuration})
        <input
          value={end}
          onChange={(e) =>
            setEnd(Math.min(+e.target.value, +props.fightDuration))
          }
        />
      </div>

      {selected !== -1 && (
        <>
          <DisplayRunStats
            {...props}
            active={selected}
            startGraph={start * 1000}
            endGraph={end * 1000}
          />

          <Timeline
            {...props}
            active={selected}
            startGraph={start * 1000}
            endGraph={end * 1000}
          />
        </>
      )}
    </div>
  );
};

const Run = (props: RouteComponentProps) => {
  const [runData, setRunData] = React.useState<ShinraExport | null>(null);
  const { run } = props.match.params as { run: string };

  React.useEffect(() => {
    getRunData(run)
      .then((data) => {
        setRunData(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [run, setRunData]);

  if (!runData) return null;

  return <DisplayRunData {...runData} />;
};

export default withRouter(withLayout(Run));
