import { TreeItem } from "react-sortable-tree";

export type ValueOf<T> = T[keyof T];

export type ActionType<TActions extends { [k: string]: any }> = ReturnType<
  ValueOf<TActions>
>;

export type MessageType<TMessages extends { [k: string]: any }> = ReturnType<
  ValueOf<TMessages>
>;

export type ManagementData = {
  treeData: TreeItem[];
  initialTreeData: TreeItem[];
  treeModified: boolean;
  hasNewNodes: boolean;
  hasModifiedNodes: boolean;
  movedElements: string[];
  expandedInfo: Map<string, boolean>;
  showSubtitles?: boolean;
};
