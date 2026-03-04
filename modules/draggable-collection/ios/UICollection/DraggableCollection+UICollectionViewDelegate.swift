import UIKit

extension DraggableCollection: UICollectionViewDelegate {
  func collectionView(_ collectionView: UICollectionView, canMoveItemAt indexPath: IndexPath)
    -> Bool
  {
    let dataManager = getDataManager()
    // Don't allow moving items from the new group section
    return !dataManager.isNewGroupSection(indexPath.section)
  }

  func collectionView(
    _ collectionView: UICollectionView,
    moveItemAt sourceIndexPath: IndexPath,
    to destinationIndexPath: IndexPath
  ) {
    let dataManager = getDataManager()

    // Use the data manager to perform the move operation
    dataManager.moveTask(
      from: sourceIndexPath,
      to: destinationIndexPath
    ) { success, movedTask, sourceStatus, destinationStatus in
      if success {
        print("Item moved successfully via delegate method")
      } else {
        print("Failed to move item via delegate method")
      }
    }
  }

  func collectionView(
    _ collectionView: UICollectionView,
    didSelectItemAt indexPath: IndexPath
  ) {
    collectionView.deselectItem(at: indexPath, animated: true)

    let dataManager = getDataManager()

    // Check if the section and item exist
    guard let task = dataManager.task(at: indexPath),
      !dataManager.isNewGroupSection(indexPath.section)
    else {
      return
    }

    // Notify delegate about item tap
    dataChangeDelegate?.itemDidTap(task.toJSON() ?? [:])
    print("Selected item: \(task.name)")
  }

  func collectionView(
    _ collectionView: UICollectionView,
    willDisplay cell: UICollectionViewCell,
    forItemAt indexPath: IndexPath
  ) {
    cell.setNeedsLayout()
    cell.layoutIfNeeded()
  }

  func collectionView(
    _ collectionView: UICollectionView,
    willDisplaySupplementaryView view: UICollectionReusableView,
    forElementKind elementKind: String,
    at indexPath: IndexPath
  ) {
    if elementKind == DraggableCollectionBackgroundView.identifier,
      let backgroundView = view as? DraggableCollectionBackgroundView
    {

      let dataManager = getDataManager()

      guard let statusGroup = dataManager.statusGroup(at: indexPath.section) else {
        return
      }

      // Set background color
      backgroundView.color = UIColor(hex: statusGroup.status.color)

      // Configure based on whether this is the new group section
      if dataManager.isNewGroupSection(indexPath.section) {
        backgroundView.isCollapsed = true
        backgroundView.onAddButtonTapped = { [weak self] in
          self?.dataChangeDelegate?.addNewGroupTapped()
        }
      } else {
        backgroundView.isCollapsed = false
        backgroundView.onAddButtonTapped = nil
      }
    }
  }
}
