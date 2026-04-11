// import {
//   type DropAnimationOptions,
//   defaultDropAnimationSideEffects,
//   useSensors,
//   useSensor,
//   TouchSensor,
//   KeyboardSensor,
//   MouseSensor,
//   MouseSensorOptions,
// } from '@dnd-kit-svelte/core';
// import { CSS } from '@dnd-kit-svelte/utilities';
import { PointerSensor, KeyboardSensor, PointerActivationConstraints } from '@dnd-kit/dom';
import Droppable from './Droppable.svelte';

// const dropAnimation: DropAnimationOptions = {
//   duration: 350,
//   easing: 'ease', 
//   sideEffects: defaultDropAnimationSideEffects({
//     className: { active: 'dropping' },
//   }),
//   keyframes: ({ transform }): Keyframe[] => {
//     const { initial, final } = transform;
//     return [
//       { 
//         transform: CSS.Transform.toString(initial),
//         boxShadow: '0 .75rem 2rem -.75rem hsl(0 0% 0% / .25)',
//       },
//       { 
//         transform: CSS.Transform.toString(final),
//         boxShadow: '0 0 0 transparent',
//       }
//     ];
//   },
// };

// const sensors = useSensors(
//   useSensor(TouchSensor),
//   useSensor(KeyboardSensor),
//   useSensor(MouseSensor, {
//     activationConstraint: {
//       distance: 10,
//     },
//   } as MouseSensorOptions)
// );

const ACTIVATION_DISTANCE_THRESHOLD = 10;

const sensors = [
  PointerSensor.configure({
    activationConstraints: [
      new PointerActivationConstraints.Distance({ value: ACTIVATION_DISTANCE_THRESHOLD }),
    ],
  }),
  KeyboardSensor,
];

export {
  Droppable,
  sensors,
  ACTIVATION_DISTANCE_THRESHOLD,
};