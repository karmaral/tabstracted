import type { MenuOption } from '$types';

const options: MenuOption[] = [
  {
    id: 'close',
    label: 'Close',
    type: 'entry',
  },
  {
    id: 'add_to_group',
    label: 'Add to group',
    children: [
      { type: 'separator' },
      {
        id: 'new_group',
        label: 'New Group',
        type: 'entry',
      }
    ],
    children_source: 'group',
    type: 'entry',
  },
  {
    id: 'move_to_window',
    label: 'Move to window',
    children: [
      { type: 'separator' },
      {
        id: 'new_window',
        label: 'New Window',
        type: 'entry',
      }
    ],
    children_source: 'window',
    type: 'entry',
  },
];

export default options;
