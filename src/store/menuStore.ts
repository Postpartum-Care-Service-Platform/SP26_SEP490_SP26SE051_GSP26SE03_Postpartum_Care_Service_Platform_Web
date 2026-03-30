import { action, makeObservable, observable } from 'mobx';

import menuService, { MenuService } from '@/services/menu.service';
import { Menu } from '@/types/menu';

export class MenuStore {
  @observable menus: Menu[] = [];
  @observable menu: Menu | undefined;
  @observable isLoading = false;
  @observable isError = false;
  @observable error: string | undefined;

  constructor(private menuService: MenuService) {
    makeObservable(this);
  }

  /**
   * Get all menus.
   * @returns {void}
   */
  @action fetchMenus() {
    this.isError = false;
    this.error = undefined;
    this.isLoading = true;

    this.menuService.getAllMenus().then(
      (data: Menu[]) => {
        this.menus = data;
        this.isError = false;
        this.isLoading = false;
      },
      (error: string) => {
        this.isError = true;
        this.isLoading = false;
        this.error = error;
      }
    );
  }

  /**
   * Get detailed view for a menu.
   * @param {number} id - id of menu
   * @returns {void}
   */
  @action fetchMenu(id: number) {
    this.isError = false;
    this.error = undefined;
    this.isLoading = true;

    this.menuService.getMenuById(id).then(
      (data: Menu) => {
        this.menu = data;
        this.isError = false;
        this.isLoading = false;
      },
      (error: string) => {
        this.isError = true;
        this.isLoading = false;
        this.error = error;
      }
    );
  }

  /**
   * Create new menu.
   * @param {Menu} menu - info of menu
   * @returns {void}
   */
  @action createMenu(menu: any) {
    return this.menuService.createMenu(menu);
  }

  /**
   * Update menu.
   * @param {number} id - id of menu
   * @param {Menu} menu - info of menu
   * @returns {void}
   */
  @action updateMenu(id: number, menu: any) {
    return this.menuService.updateMenu(id, menu);
  }

  /**
   * Delete menu.
   * @param {number} id - id of menu
   * @returns {void}
   */
  @action deleteMenu(id: number) {
    return this.menuService.deleteMenu(id);
  }
}

const menuStore = new MenuStore(menuService);
export default menuStore;
