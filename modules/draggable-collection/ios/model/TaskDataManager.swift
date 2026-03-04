import Foundation
import UIKit

class TaskDataManager {
  // MARK: - Properties
  private var _statusGroups: [TaskStatusGroup] = []
  private let dataQueue = DispatchQueue(label: "task-data-manager", qos: .userInitiated)
  private let newGroupId = "__new-group__"

  weak var delegate: DraggableCollectionViewDelegate?

  // MARK: - Thread-Safe Public Interface

  /// Thread-safe access to all status groups (including new group)
  var allStatusGroups: [TaskStatusGroup] {
    return dataQueue.sync { _statusGroups }
  }

  /// Access to status groups without the new group (for external consumption)
  var statusGroups: [TaskStatusGroup] {
    return dataQueue.sync {
      _statusGroups.filter { $0.status.id != newGroupId }
    }
  }

  /// Total number of sections (including new group)
  var numberOfSections: Int {
    return dataQueue.sync { _statusGroups.count }
  }

  /// Get tasks count for a specific section
  func numberOfTasks(in section: Int) -> Int {
    return dataQueue.sync {
      guard section < _statusGroups.count else { return 0 }
      return _statusGroups[section].tasks.count
    }
  }

  /// Get task at specific index path
  func task(at indexPath: IndexPath) -> Task? {
    return dataQueue.sync {
      guard indexPath.section < _statusGroups.count,
        indexPath.item < _statusGroups[indexPath.section].tasks.count
      else {
        return nil
      }
      return _statusGroups[indexPath.section].tasks[indexPath.item]
    }
  }

  /// Get status group at specific section
  func statusGroup(at section: Int) -> TaskStatusGroup? {
    return dataQueue.sync {
      guard section < _statusGroups.count else { return nil }
      return _statusGroups[section]
    }
  }

  // MARK: - Data Operations

  /// Set new data (replaces all existing data)
  func setData(_ newData: [TaskStatusGroup]) {
    dataQueue.async { [weak self] in
      guard let self = self else { return }

      var updatedData = newData

      // Add the new group section
      let dict = DraggableCollectionView.sharedDictionary
      let newStatusGroup = TaskStatusGroup(
        status: TaskStatus(
          id: self.newGroupId, name: dict.new_group,
          color: "#BFBFBF"),
        tasks: []
      )
      updatedData.append(newStatusGroup)

      self._statusGroups = updatedData

      DispatchQueue.main.async {
        self.notifyDataChanged()
      }
    }
  }

  /// Move task from one position to another
  func moveTask(
    from sourceIndexPath: IndexPath, to destinationIndexPath: IndexPath,
    completion: @escaping (Bool, Task?, TaskStatus?, TaskStatus?) -> Void
  ) {
    dataQueue.async { [weak self] in
      guard let self = self else {
        DispatchQueue.main.async { completion(false, nil, nil, nil) }
        return
      }

      // Validate indices
      guard sourceIndexPath.section < self._statusGroups.count,
        destinationIndexPath.section < self._statusGroups.count,
        sourceIndexPath.item < self._statusGroups[sourceIndexPath.section].tasks.count
      else {
        DispatchQueue.main.async { completion(false, nil, nil, nil) }
        return
      }

      // Don't allow moving to new group
      if self._statusGroups[destinationIndexPath.section].status.id == self.newGroupId {
        DispatchQueue.main.async { completion(false, nil, nil, nil) }
        return
      }

      // Don't allow moving if source and destination are the same
      if sourceIndexPath == destinationIndexPath {
        DispatchQueue.main.async { completion(false, nil, nil, nil) }
        return
      }

      // Perform the move
      let sourceSection = sourceIndexPath.section
      let destSection = destinationIndexPath.section
      let destItem = min(destinationIndexPath.item, self._statusGroups[destSection].tasks.count)

      let draggedTask = self._statusGroups[sourceSection].tasks.remove(at: sourceIndexPath.item)
      self._statusGroups[destSection].tasks.insert(draggedTask, at: destItem)

      let sourceStatus = self._statusGroups[sourceSection].status
      let destinationStatus = self._statusGroups[destSection].status

      DispatchQueue.main.async {
        // Notify about the change
        self.notifyItemMoved(
          task: draggedTask,
          sourceStatus: sourceStatus,
          destinationStatus: destinationStatus
        )
        self.notifyDataChanged()
        completion(true, draggedTask, sourceStatus, destinationStatus)
      }
    }
  }

  /// Check if a section is the new group section
  func isNewGroupSection(_ section: Int) -> Bool {
    return dataQueue.sync {
      guard section < _statusGroups.count else { return false }
      return _statusGroups[section].status.id == newGroupId
    }
  }

  /// Add a new task to a specific section
  func addTask(_ task: Task, to section: Int) {
    dataQueue.async { [weak self] in
      guard let self = self,
        section < self._statusGroups.count,
        self._statusGroups[section].status.id != self.newGroupId
      else {
        return
      }

      self._statusGroups[section].tasks.append(task)

      DispatchQueue.main.async {
        self.notifyDataChanged()
      }
    }
  }

  /// Remove task at specific index path
  func removeTask(at indexPath: IndexPath, completion: @escaping (Task?) -> Void) {
    dataQueue.async { [weak self] in
      guard let self = self,
        indexPath.section < self._statusGroups.count,
        indexPath.item < self._statusGroups[indexPath.section].tasks.count,
        self._statusGroups[indexPath.section].status.id != self.newGroupId
      else {
        DispatchQueue.main.async { completion(nil) }
        return
      }

      let removedTask = self._statusGroups[indexPath.section].tasks.remove(at: indexPath.item)

      DispatchQueue.main.async {
        self.notifyDataChanged()
        completion(removedTask)
      }
    }
  }

  // MARK: - Private Methods

  private func notifyDataChanged() {
    let filteredData = statusGroups.compactMap { $0.toJSON() }
    delegate?.dataDidChange(filteredData)
  }

  private func notifyItemMoved(task: Task, sourceStatus: TaskStatus, destinationStatus: TaskStatus)
  {
    delegate?.itemIndexPathDidChange(
      item: task,
      sourceStatus: sourceStatus,
      destinationStatus: destinationStatus
    )
  }
}
