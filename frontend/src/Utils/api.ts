import wretch from "wretch";
import { ShinraExport } from "Interfaces";

const api = wretch()
  .url(process.env.REACT_APP_API_URL as string)
  .options({ mode: "cors" });

export const getRunData = (run: string) => {
  return api
    .url(`/runs/${run}`)
    .get()
    .json()
    .then((data) => data as ShinraExport);
};

export const getAllRuns = () => {
  return api
    .url("/runs")
    .get()
    .json()
    .then((data) => data as string[]);
};
