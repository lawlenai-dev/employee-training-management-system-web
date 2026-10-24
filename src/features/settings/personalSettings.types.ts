export type SettingKey =
  "nationalities" | "bloodTypes" | "genders" | "prefixes";
export type Status = "active" | "inactive";

export type PersonalForm = {
  code: string;
  nameTh: string;
  nameEn: string;
  status: Status;
};

export type PersonalRow = PersonalForm & {
  id: number;
};

export type PersonalData = Record<SettingKey, PersonalRow[]>;
