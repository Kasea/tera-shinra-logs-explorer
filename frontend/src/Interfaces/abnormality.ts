export interface AbnormalityEffect {
  method: number;
  tickInterval: number;
  type: number;
  value: string;
}

export interface AbnormalityData {
  id: number;
  group?: string;
  bySkillCategory: number[];
  infinity: boolean;
  isBuff: boolean;
  isHideOnRefresh: boolean;
  isShow: string;
  kind: number;
  level: number;
  notCareDeath: boolean;
  priority: number;
  property: number;
  time: string;
  AbnormalityEffect: AbnormalityEffect[];
}
