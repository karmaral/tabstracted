
export interface SettingEntry {
  value: any;
  label: string;
};

export interface ISettings {
  cache: {
    [group: string]: {
      [key: string]: SettingEntry;
    };
  };
  init(): Promise<void>;
  get(): {};
  update(group: string, key: string, value: any): Promise<void>;
  write(): Promise<void>;
}
