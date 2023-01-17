# Tabstracted - An open source browser tab manager

## The Goal
An easy to use, feature-complete tab manager extension for organizing tabs into workspaces.

## Disclaimer
I am currently in the process of migrating/rewriting everything in Typescript, so the software is of not much use, and you might see a lot of skeleton code aswell.

Cross-browser support is on the roadmap aswell. For now, it only runs in Chrome/chromium based browsers.

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

This extension uses the [Svelte Typescript Chrome Extension Boilerplate](https://github.com/NekitCorp/chrome-extension-svelte-typescript-boilerplate)





