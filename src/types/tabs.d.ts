
export interface ITabs {
  moveToWindow(tabIds: number | number[], windowId: number): Promise<void>;
}
