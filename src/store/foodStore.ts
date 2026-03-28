import { action, makeObservable, observable } from 'mobx';

import foodService, { FoodService } from '@/services/food.service';
import { Food } from '@/types/food';

export class FoodStore {
  @observable foods: Food[] = [];
  @observable food: Food | undefined;
  @observable isLoading = false;
  @observable isError = false;
  @observable error: string | undefined;

  constructor(private foodService: FoodService) {
    makeObservable(this);
  }

  /**
   * Get all foods.
   * @returns {void}
   */
  @action fetchFoods() {
    this.isError = false;
    this.error = undefined;
    this.isLoading = true;

    this.foodService.getAllFoods().then(
      (data: Food[]) => {
        this.foods = data;
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
   * Get detailed view for a food.
   * @param {number} id - id of food
   * @returns {void}
   */
  @action fetchFood(id: number) {
    this.isError = false;
    this.error = undefined;
    this.isLoading = true;

    this.foodService.getFoodById(id).then(
      (data: Food) => {
        this.food = data;
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
   * Create new food.
   * @param {Food} food - info of food
   * @returns {void}
   */
  @action createFood(food: Food) {
    return this.foodService.createFood(food);
  }

  /**
   * Update food.
   * @param {number} id - id of food
   * @param {Food} food - info of food
   * @returns {void}
   */
  @action updateFood(id: number, food: Food) {
    return this.foodService.updateFood(id, food);
  }

  /**
   * Delete food.
   * @param {number} id - id of food
   * @returns {void}
   */
  @action deleteFood(id: number) {
    return this.foodService.deleteFood(id);
  }
}

const foodStore = new FoodStore(foodService);
export default foodStore;
