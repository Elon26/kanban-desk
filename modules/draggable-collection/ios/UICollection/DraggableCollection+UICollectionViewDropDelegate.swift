import UIKit

extension DraggableCollection: UICollectionViewDropDelegate {
  func collectionView(
    _ collectionView: UICollectionView,
    dropSessionDidUpdate session: UIDropSession,
    withDestinationIndexPath destinationIndexPath: IndexPath?
  ) -> UICollectionViewDropProposal {
    if collectionView.hasActiveDrag {
      let targetSection = destinationIndexPath?.section ?? 0
      let dataManager = getDataManager()

      if dataManager.isNewGroupSection(targetSection) {
        // If the destination section is the new group, we don't allow moving items there
        return UICollectionViewDropProposal(operation: .forbidden)
      }

      return UICollectionViewDropProposal(operation: .move, intent: .insertAtDestinationIndexPath)
    }
    return UICollectionViewDropProposal(operation: .forbidden)
  }

  func collectionView(
    _ collectionView: UICollectionView,
    performDropWith coordinator: UICollectionViewDropCoordinator
  ) {
    for item in coordinator.items {
      guard let sourceIndexPath = item.sourceIndexPath else { continue }

      // Get the destination index path
      var destIndexPath = coordinator.destinationIndexPath

      print(
        "Performing drop with source: \(sourceIndexPath) and destination: \(String(describing: destIndexPath))"
      )

      // If destination is the same as source, determine the target section by X coordinate
      if destIndexPath == sourceIndexPath || destIndexPath == nil {
        let dropPoint = coordinator.session.location(in: collectionView)
        let targetSection = getSectionFromXCoordinate(dropPoint.x, in: collectionView)

        // Only proceed if we found a valid target section different from the source
        if let targetSection, targetSection != sourceIndexPath.section {
          let dataManager = getDataManager()
          let targetItem = dataManager.numberOfTasks(in: targetSection)
          destIndexPath = IndexPath(item: targetItem, section: targetSection)
        } else {
          // If we couldn't find a different target section, skip this drop
          continue
        }
      }

      guard let destinationIndexPath = destIndexPath else { continue }

      let dataManager = getDataManager()

      // Check if destination is valid before proceeding
      if dataManager.isNewGroupSection(destinationIndexPath.section) {
        continue
      }

      // Use the data manager to perform the move operation
      dataManager.moveTask(
        from: sourceIndexPath,
        to: destinationIndexPath
      ) { [weak self, weak coordinator] success, movedTask, sourceStatus, destinationStatus in
        guard let self = self,
          let coordinator = coordinator,
          success
        else {
          print("Failed to move task")
          return
        }

        // Perform UI updates on main thread
        collectionView.performBatchUpdates({
          collectionView.deleteItems(at: [sourceIndexPath])
          collectionView.insertItems(at: [destinationIndexPath])

          // Update headers for animation consistency
          self.updateHeaders(
            in: collectionView, for: sourceIndexPath.section, destinationIndexPath.section)
        }) { _ in
          // Finalize the drag operation
          coordinator.drop(item.dragItem, toItemAt: destinationIndexPath)
        }
      }
    }
  }

  private func getSectionFromXCoordinate(_ x: CGFloat, in collectionView: UICollectionView) -> Int?
  {
    var sectionMinX: CGFloat = 0
    var sectionMaxX: CGFloat = 0

    for section in 0..<collectionView.numberOfSections {
      if let layoutAttributes = collectionView.collectionViewLayout
        .layoutAttributesForSupplementaryView(
          ofKind: UICollectionView.elementKindSectionHeader,
          at: IndexPath(item: 0, section: section)
        )
      {
        sectionMinX = sectionMaxX
        sectionMaxX = layoutAttributes.frame.maxX
        print("Checking x = \(x) against section \(section) bounds")
        print("Section \(section): \(sectionMinX)| \(sectionMaxX)")

        if x >= sectionMinX && x <= sectionMaxX {
          return section
        }
      }
    }
    return nil
  }

  private func updateHeaders(
    in collectionView: UICollectionView,
    for sourceSection: Int,
    _ destSection: Int
  ) {
    let dataManager = getDataManager()

    // Update source header
    if let sourceHeader = collectionView.supplementaryView(
      forElementKind: UICollectionView.elementKindSectionHeader,
      at: IndexPath(item: 0, section: sourceSection)
    ) as? DraggableCollectionHeaderView,
      let sourceGroup = dataManager.statusGroup(at: sourceSection)
    {
      sourceHeader.configure(
        with: sourceGroup.status,
        taskCount: sourceGroup.tasks.count
      )
    }

    // Update destination header
    if let destHeader = collectionView.supplementaryView(
      forElementKind: UICollectionView.elementKindSectionHeader,
      at: IndexPath(item: 0, section: destSection)
    ) as? DraggableCollectionHeaderView,
      let destGroup = dataManager.statusGroup(at: destSection)
    {
      destHeader.configure(
        with: destGroup.status,
        taskCount: destGroup.tasks.count
      )
    }
  }
}
