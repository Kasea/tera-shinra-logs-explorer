import SkillPreset from "./skill-preset.json";
import UserData from "./user-data.json";
import Abnormalities from "./abnormalities-str.json";
import AbnormalitiesData from "./abnormalities.json";
import { AbnormalityData } from "Interfaces/abnormality";

export const getSkillData = (skillId: number) => {
  return {
    skill: Math.floor(skillId / 10000),
    sub: skillId % 100,
    level: Math.floor(skillId / 100) % 100,
  };
};

export const getSkillName = (templateId: number, skillId: number): string => {
  // @ts-ignore
  const klass = UserData[templateId].class;

  const { skill, sub } = getSkillData(skillId);

  // @ts-ignore
  const name = SkillPreset?.[klass]?.[skill]?.[sub]?.name || "";

  // @ts-ignore
  if(!name && SkillPreset?.[klass]?.[skill]) {
    // @ts-ignore
    for(const sub in SkillPreset[klass][skill]) {
      // @ts-ignore
      const name = SkillPreset[klass][skill][sub].name;
      if(name) return name;
    }
  }

  return name;
};

export const getAbnormalityData = (
  abnormality: number
): AbnormalityData | null => {
  // @ts-ignore
  return AbnormalitiesData[abnormality] || null;
};

export const getAbnormalityName = (abnormality: number): string | null => {
  // @ts-ignore
  return Abnormalities?.[abnormality]?.name || null;
};

export const round = (number: number, digits=2) => {
  const pow = Math.pow(10, digits);
  return Math.floor(number * pow) / pow;
}

export function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
