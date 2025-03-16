import {Injectable} from '@angular/core';

@Injectable()
export abstract class BaseLayoutService {
  order = 0;

  abstract getMainMenus(): Promise<MenuItem[]>;

  async getProfileMenus(): Promise<MenuItem[]> {
    return []
  };
}

export interface MenuItem {
  text: string;
  link?: string;
  icon?: string;
  class?: string;
  children?: MenuItem[];
  action?: (item: MenuItem) => void;
  accesses?: string[];
  order?: number;

  expanded?: boolean;
}
