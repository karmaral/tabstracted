
export interface ITabs {
  moveToWindow(tabIds: number | number[], windowId: number): Promise<void>;
  reorderGroup(groupId: number, tabIds: number[], index: number): Promise<void>;
  suspend(tabIds: number | number[]): Promise<void>;
}
