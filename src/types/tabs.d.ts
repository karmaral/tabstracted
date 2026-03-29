
export interface TabsModule {
  moveToWindow(tabIds: number | [number, ...number[]], windowId: number): Promise<void>;
  group(groupId: number, tabIds: number | [number, ...number[]]): Promise<void>;
  reorderGroup(groupId: number, index: number): Promise<void>;
  suspend(tabIds: number | [number, ...number[]]): Promise<void>;
}
