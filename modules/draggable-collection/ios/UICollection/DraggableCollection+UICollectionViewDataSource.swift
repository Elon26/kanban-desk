import UIKit

extension DraggableCollection: UICollectionViewDataSource {
  func numberOfSections(in collectionView: UICollectionView) -> Int {
    return getDataManager().numberOfSections
  }

  func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int)
    -> Int
  {
    return getDataManager().numberOfTasks(in: section)
  }

  func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath)
    -> UICollectionViewCell
  {
    let cell =
      collectionView.dequeueReusableCell(
        withReuseIdentifier: DraggableCollectionCell.identifier,
        for: indexPath) as! DraggableCollectionCell

    let dataManager = getDataManager()

    guard let statusGroup = dataManager.statusGroup(at: indexPath.section),
      let task = dataManager.task(at: indexPath)
    else {
      return cell
    }

    let hexColor = statusGroup.status.color
    let uicolor = UIColor(hex: hexColor) ?? UIColor.clear

    cell.configure(with: task, color: uicolor)
    return cell
  }

  func collectionView(
    _ collectionView: UICollectionView,
    viewForSupplementaryElementOfKind kind: String,
    at indexPath: IndexPath
  ) -> UICollectionReusableView {
    if kind == UICollectionView.elementKindSectionHeader {
      let headerView =
        collectionView.dequeueReusableSupplementaryView(
          ofKind: kind,
          withReuseIdentifier: DraggableCollectionHeaderView.identifier,
          for: indexPath) as! DraggableCollectionHeaderView

      let dataManager = getDataManager()

      guard let statusGroup = dataManager.statusGroup(at: indexPath.section) else {
        return headerView
      }

      headerView.configure(
        with: statusGroup.status,
        taskCount: statusGroup.tasks.count
      )
      return headerView
    }

    return UICollectionReusableView()
  }
}
