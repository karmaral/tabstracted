# Tabstracted - An open source browser tab manager

## The Goal
An easy to use, feature-complete tab manager extension for organizing tabs into workspaces.

## Disclaimer
This project is undergoing a significant rewrite as I migrate to the more robust [WXT extension framework](https://github.com/wxt-dev/wxt), which has cross-browser support, and also rewriting the sortable implementation with [dnd-kit-svelte](https://github.com/hanielu/dnd-kit-svelte).

## Current Features

### Workspaces
| Functionality | Status |
| --- | :---: |
| Display current window's tabs | ✔ |
| Save current window as Workspace |   |
| Open workspace |   |
| Auto-detect open Workspaces  |   |

### Tabs
| Functionality | Single | Batch |
| --- | :---: | :---: |
| Selection <br> (for batch operations) | ✔ | ✔ | 
| Close         | ✔ | ✔ | 
| Move to window | ✔ | ✔ |
| Reorder       | | |
| Add to group  | | |
| Suspend       | ✔ | ✔ |
| Drag select | - | |
| Pin/Unpin | | |

### Groups
| Functionality | Single | Batch |
| --- | :---: | :---: |
| Rename | | - |
| Ungroup  | | |
| Collapse/Expand | ✔ | |
| Move to window |  |  |

------

This extension uses the [WXT extension framework](https://github.com/wxt-dev/wxt).





