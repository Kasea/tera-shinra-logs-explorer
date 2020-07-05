export interface Abnormal {
  id: number;
  start: number;
  end: number;
  stack: number;
}

export interface Mob {
  entityId: string;
  huntingZoneId: number;
  templateId: number;
  abnormals: Abnormal[];
}

export interface DealtSkillLog {
  type: number;
  time: number;
  crit: boolean;
  dot: boolean;
  skillId: number;
  amount: string;
  target: string;
}

export interface ReceivedSkillLog {
  type: number;
  time: number;
  source: string;
  crit: boolean;
  dot: boolean;
  skillId: number;
  amount: string;
}

export interface Player {
  entityId: string;
  templateId: number;
  playerId: number;
  playerServerId: number;
  playerName: string;
  playerServer: string;
  guild: string;
  playerClass: string;
  aggro: string;
  playerAverageCritRate: string;
  playerDeathDuration: string;
  playerDeaths: string;
  playerDps: string;
  playerTotalDamage: string;
  playerTotalDamagePercentage: string;
  dealtSkillLog: DealtSkillLog[];
  receivedSkillLog: ReceivedSkillLog[];
  abnormals: Abnormal[];
  healCrit: string;
}

export interface ShinraExport {
  areaId: string;
  bossId: string;
  encounterUnixEpoch: string;
  fightDuration: string;
  meterVersion: string;
  partyDps: string;
  mobs: Mob[];
  players: Player[];
}
