/**
 * Survey highlights transcribed from
 * content/data/🔍 Reimagining NYC Tourism_…(Responses).xlsx
 * n = 14 resident / stakeholder responses (col: tourism concerns)
 */

export type SurveyStat = {
  id: "overcrowding" | "authentic";
  count: number;
  value: number;
  label: string;
  caption: string;
};

export const NAVI_SURVEY_STATS = [
  {
    id: "overcrowding",
    count: 10,
    value: 71,
    label: "71%",
    caption: "concerned about overcrowding and over-tourism",
  },
  {
    id: "authentic",
    count: 7,
    value: 50,
    label: "50%",
    caption: "concerned about lack of authentic experiences",
  },
] as const satisfies readonly SurveyStat[];

export const NAVI_SURVEY_META = {
  responseCount: 14,
  localBusinessCount: 2,
  source:
    "Reimagining NYC Tourism: A More Meaningful & Sustainable Experience (resident and stakeholder survey)",
} as const;
