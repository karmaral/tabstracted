
export interface ITabs {
  moveToWindow(tabIds: number | number[], windowId: number): Promise<void>;
  suspend(tabIds: number | number[]): Promise<void>;
}
