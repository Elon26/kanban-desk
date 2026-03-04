import UIKit

extension DraggableCollection: UICollectionViewDragDelegate {
  func collectionView(
    _ collectionView: UICollectionView, itemsForBeginning session: UIDragSession,
    at indexPath: IndexPath
  ) -> [UIDragItem] {
    let hapticFeedback = UIImpactFeedbackGenerator(style: .light)
    hapticFeedback.impactOccurred()
    let item = data[indexPath.section].tasks[indexPath.item]
    let itemProvider = NSItemProvider(object: item.id as NSString)
    let dragItem = UIDragItem(itemProvider: itemProvider)
    dragItem.localObject = item
    return [dragItem]
  }
}
