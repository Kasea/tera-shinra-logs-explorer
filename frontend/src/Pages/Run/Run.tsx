import React from "react";
import { withRouter, RouteComponentProps } from "react-router";
import "./Run.css";

import { ShinraExport } from "Interfaces";
import { getRunData, getSkillName, numberWithCommas, round } from "../../Utils";
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

const DisplaySkillRotation = (props: TimelineProps) => {
  const player = props.players[props.active];

  let history: string[] = [];
  const data = player.dealtSkillLog.filter(
    (d) =>
      d.type === 4 && props.startGraph <= d.time && d.time <= props.endGraph
  );

  for (const skill of data) {
    history.push(getSkillName(player.templateId, skill.skillId));
  }

  return <div className="displaySkillCasts">{history.join(" -> ")}</div>;
};

const DisplaySkillBreakdown = (props: TimelineProps) => {
  const player = props.players[props.active];

  const data = player.dealtSkillLog.filter(
    (d) =>
      d.type === 1 && props.startGraph <= d.time && d.time <= props.endGraph
  );
  const skillData: {
    [skillId: number]: {
      skillId: number;
      hits: number;
      crit: number;
      dmg: number;
      critDmg: number;
    };
  } = {};

  let sumDmg = 0;
  for (const skill of data) {
    const skillId = Math.floor(skill.skillId / 10000);
    if (!skillData[skillId]) {
      skillData[skillId] = {
        skillId: skill.skillId,
        hits: 0,
        crit: 0,
        dmg: 0,
        critDmg: 0,
      };
    }

    sumDmg += +skill.amount;
    skillData[skillId].hits++;
    skillData[skillId].crit += +skill.crit;
    skillData[skillId].dmg += +skill.amount;
    skillData[skillId].critDmg += skill.crit ? +skill.amount : 0;
  }

  const orderedSkillData = Object.entries(skillData).sort(
    (a, b) => b[1].dmg - a[1].dmg
  );

  return (
    <table className="breakdown-table">
      <thead>
        <tr>
          <th>Skill</th>
          <th>damage contribution</th>
          <th>hits</th>
          <th>hpm</th>
          <th>crit rate</th>
          <th>average hit damage</th>
          <th>average crit</th>
          <th>damage</th>
        </tr>
      </thead>

      <tbody>
        {orderedSkillData.map(([skillId, data]) => (
          <tr key={skillId}>
            <td>{getSkillName(player.templateId, data.skillId) || data.skillId}</td>
            <td>{round(data.dmg / sumDmg * 100, 2)} %</td>
            <td>{data.hits}</td>
            <td>
              {round(
                data.hits / ((props.endGraph - props.startGraph) / 1000 / 60),
                2
              )}
            </td>
            <td>{round((data.crit / data.hits) * 100, 2)} %</td>
            <td>{numberWithCommas(Math.floor(data.dmg / data.hits))}</td>
            <td>{numberWithCommas(Math.floor(data.critDmg / data.crit))}</td>
            <td>{numberWithCommas(Math.floor(data.dmg))}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const DisplaySkillCasts = (props: TimelineProps) => {
  const [showRotation, setShowRotation] = React.useState(false);

  return (
    <div>
      <button
        onClick={() => {
          setShowRotation((prev) => !prev);
        }}
      >
        show {showRotation ? "breakdown" : "rotoation"}
      </button>

      {showRotation ? (
        <DisplaySkillRotation {...props} />
      ) : (
        <DisplaySkillBreakdown {...props} />
      )}
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

          <DisplaySkillCasts
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
