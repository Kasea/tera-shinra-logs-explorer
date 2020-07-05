import fs from "fs";
import path from "path";

import { ShinraExport } from "../interfaces";

export const getRunData = (file: string): ShinraExport => {
  return JSON.parse(fs.readFileSync(file).toString("utf-8")) as ShinraExport;
};

export const getAllFilesInDirectory = (dir: string): Array<string> => {
  const ret: Array<string> = [];

  const files = fs.readdirSync(dir);
  for (const file of files) {
    const path = `${dir}/${file}`;

    if (fs.statSync(path).isDirectory()) {
      ret.push(...getAllFilesInDirectory(path));
    } else {
      ret.push(path);
    }
  }

  return ret;
};
