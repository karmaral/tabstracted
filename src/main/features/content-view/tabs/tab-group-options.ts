import type { MenuOption } from '$types';

const options: MenuOption[] = [
  {
    id: 'close_all',
    label: 'Close All',
    type: 'entry',
  },
  {
    id: 'rename',
    label: 'Rename',
    type: 'entry',
  },
  {
    id: 'ungroup',
    label: 'Ungroup',
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
