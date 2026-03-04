// Reexport the native module. On web, it will be resolved to DraggableCollectionModule.web.ts
// and on native platforms to DraggableCollectionModule.ts
export { default } from './src/DraggableCollectionModule';
export { default as DraggableCollectionView } from './src/DraggableCollectionView';
export * from  './src/DraggableCollection.types';
