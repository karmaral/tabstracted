import type { MenuOption } from '$types';

const options: MenuOption[] = [
  {
    type: 'entry',
    id: 'close_all',
    label: 'Close All',
  },
  {
    type: 'entry',
    id: 'rename',
    label: 'Rename'
  },
  {
    type: 'entry',
    id: 'ungroup',
    label: 'Ungroup',
  },
  {
    type: 'entry',
    id: 'move_to_window',
    label: 'Move to window',
    children: [],
    children_source: 'window',
  },
];

export default options;
