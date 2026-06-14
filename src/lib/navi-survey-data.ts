/**
 * Survey highlights transcribed from
 * content/data/🔍 Reimagining NYC Tourism_…(Responses).xlsx
 * n = 14 resident / stakeholder responses (col: tourism concerns)
 */

export type SurveyStat = {
  id: string;
  value: number;
  label: string;
  caption: string;
};

export const NAVI_SURVEY_STATS: SurveyStat[] = [
  {
    id: "overcrowding",
    value: 71,
    label: "71%",
    caption: "concerned about overcrowding and over-tourism",
  },
  {
    id: "authentic",
    value: 50,
    label: "50%",
    caption: "concerned about lack of authentic experiences",
  },
];

export const NAVI_SURVEY_META = {
  responseCount: 14,
  source:
    "Reimagining NYC Tourism: A More Meaningful & Sustainable Experience (resident survey)",
};
