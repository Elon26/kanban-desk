import ExpoModulesCore

public class DraggableCollectionModule: Module {
  public func definition() -> ModuleDefinition {
    Name("DraggableCollection")

    View(DraggableCollectionView.self) {
      Events(
        "onDataChange", "onItemTap", "onItemIndexPathChange",
        "onAddNewGroupTapped")

      Prop("data") { (view: DraggableCollectionView, data: [[String: Any]]) in
        view.collectionView?.setData(data.compactMap { TaskStatusGroup.fromJSON($0) })
      }

      Prop("dictionary") { (view: DraggableCollectionView, dictionary: [String: Any]) in
        view.dictionary = DraggableCollectionDict.create(dictionary)
      }
    }
  }
}
