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
  return SkillPreset?.[klass]?.[skill]?.[sub]?.name || "";
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
