import React from "react";
import { ShinraExport, Player } from "Interfaces";
import ReactApexChart from "react-apexcharts";
import { getSkillName, getAbnormalityName, getAbnormalityData } from "Utils";

export interface TimelineProps extends ShinraExport {
  active: number;
  startGraph: number;
  endGraph: number;
}

interface SerieData {
  x: string;
  y: number[];
}

interface SerieRootData {
  name: string;
  data: SerieData[];
}

const generateSkillCasts = (
  player: Player,
  start: number,
  end: number
): SerieRootData => {
  let data = player.dealtSkillLog;
  let series: SerieData[] = [];

  data = data.filter((d) => d.type === 4 && start <= d.time && d.time <= end);
  for (const idx in data) {
    const skill = data[idx];

    const name = getSkillName(player.templateId, skill.skillId);
    series.push({
      x: name,
      y: [skill.time, (data[+idx + 1] || {}).time || skill.time + 300],
    });
  }

  return {
    name: "Skill cast",
    data: series,
  };
};

const generateAbnormalities = (
  player: Player,
  start: number,
  end: number
): SerieRootData => {
  let data = player.abnormals.filter((d) => start <= d.start);
  let series: SerieData[] = [];

  for (const idx in data) {
    const abnormality = data[idx];

    const abnormalityData = getAbnormalityData(abnormality.id);
    if (!abnormalityData) continue;
    if (!abnormalityData.isShow) continue;
    if (!abnormalityData.isBuff) continue;
    if (abnormalityData.infinity) continue;
    if (abnormalityData.group !== "skill") continue;

    const name = getAbnormalityName(abnormality.id);
    if (name === null) continue;

    series.push({
      x: name,
      y: [abnormality.start, Math.min(abnormality.end, end)],
    });
  }

  return {
    name: "Abnormality",
    data: series,
  };
};

const Timeline = (props: TimelineProps) => {
  const [showBuffs, setShowBuffs] = React.useState(false);
  const player = props.players[props.active];

  const skillCasts = generateSkillCasts(
    player,
    props.startGraph,
    props.endGraph
  );
  const abnormalities = generateAbnormalities(
    player,
    props.startGraph,
    props.endGraph
  );

  const series: any[] = [skillCasts];
  if (showBuffs) series.push(abnormalities);

  const state = {
    series: series,
    options: {
      plotOptions: {
        chart: {
          height: 600,
          type: "rangeBar",
        },
        bar: {
          horizontal: true,
        },
      },
      tooltip: {
        enabled: true,
        x: {
          show: true,
          formatter: (val: any, obj: any) => {
            if (!obj) return val;
          },
        },
      },
      xaxis: {
        type: "datetime",
      },
      stroke: {
        width: 1,
      },
      fill: {
        type: "solid",
        opacity: 0.6,
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
      },
    },
  };

  return (
    <div>
      <div>
        <button
          onClick={() => {
            setShowBuffs((prev) => !prev);
          }}
        >
          {showBuffs ? "hide" : "show"} buffs
        </button>
      </div>

      <ReactApexChart
        options={state.options}
        series={state.series}
        type="rangeBar"
        height={600}
      />
    </div>
  );
};

export default Timeline;
