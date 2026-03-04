import { NativeModule, requireNativeModule } from 'expo';

import type { DraggableCollectionModuleEvents } from './DraggableCollection.types';

declare class DraggableCollectionModule extends NativeModule<DraggableCollectionModuleEvents> {}

// This call loads the native module object from the JSI.
export default requireNativeModule<DraggableCollectionModule>('DraggableCollection');
