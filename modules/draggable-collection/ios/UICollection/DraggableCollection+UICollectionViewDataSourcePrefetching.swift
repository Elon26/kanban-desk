import UIKit

extension DraggableCollection: UICollectionViewDataSourcePrefetching {
  func collectionView(_ collectionView: UICollectionView, prefetchItemsAt indexPaths: [IndexPath]) {
    // This method can be used to prepare cell data ahead of time
    // For example, you could pre-calculate cell heights or pre-fetch images
  }

  func collectionView(
    _ collectionView: UICollectionView, cancelPrefetchingForItemsAt indexPaths: [IndexPath]
  ) {
    // Cancel any in-progress prefetching operations when cells are about to be removed from view
  }
}
