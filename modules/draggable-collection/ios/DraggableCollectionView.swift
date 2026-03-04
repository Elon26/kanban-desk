import ExpoModulesCore

class DraggableCollectionView: ExpoView, DraggableCollectionViewDelegate {
  let onDataChange = EventDispatcher()
  let onItemTap = EventDispatcher()
  let onItemIndexPathChange = EventDispatcher()
  let onAddNewGroupTapped = EventDispatcher()
  var collectionView: DraggableCollection?

  static var sharedDictionary = DraggableCollectionDict(
    task: PluralDict(
      one: "{{count}} task",
      other: "{{count}} tasks"
    ),
    new_group: "New group",
    create_new_group: "Create new group",
    updated: "Updated",
    locale_identifier: "en_US"
  )

  var dictionary: DraggableCollectionDict {
    get { Self.sharedDictionary }
    set {
      Self.sharedDictionary = newValue
      if let cv = collectionView {
        if cv.numberOfSections > 0 {
          cv.reloadSections(IndexSet(integersIn: 0..<cv.numberOfSections))
        } else {
          cv.reloadData()
        }
        cv.collectionViewLayout.invalidateLayout()
        cv.setNeedsLayout()
        cv.layoutIfNeeded()
      }
    }
  }

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    clipsToBounds = true
    setupView()
  }

  override func layoutSubviews() {
    collectionView?.frame = bounds
  }

  private func setupView() {
    collectionView = DraggableCollection(
      frame: bounds, collectionViewLayout: DraggableCollection.createCompositionalLayout()
    )
    guard let collectionView = collectionView else {
      return
    }

    collectionView.dataChangeDelegate = self

    addSubview(collectionView)
  }

  func dataDidChange(_ data: [[String: Any]]) {
    onDataChange(["data": data])
  }

  func itemDidTap(_ item: [String: Any]) {
    onItemTap(item)
  }

  func itemIndexPathDidChange(item: Task, sourceStatus: TaskStatus, destinationStatus: TaskStatus) {
    onItemIndexPathChange([
      "taskId": item.id,
      "sourceCategoryId": sourceStatus.id,
      "destinationCategoryId": destinationStatus.id,
    ])
  }

  func addNewGroupTapped() {
    onAddNewGroupTapped()
  }

}

protocol DraggableCollectionViewDelegate: AnyObject {
  func dataDidChange(_ data: [[String: Any]])
  func itemDidTap(_ item: [String: Any])
  func itemIndexPathDidChange(item: Task, sourceStatus: TaskStatus, destinationStatus: TaskStatus)
  func addNewGroupTapped()
}

struct DraggableCollectionDict {
  let task: PluralDict
  let new_group: String
  let create_new_group: String
  let updated: String
  let locale_identifier: String

  static func create(_ input: [String: Any]) -> Self {
    DraggableCollectionDict(
      task: PluralDict.create(name: "task", input),
      new_group: input["new_group"] as? String ?? "",
      create_new_group: input["create_new_group"] as? String ?? "",
      updated: input["updated"] as? String ?? "",
      locale_identifier: input["locale_identifier"] as? String ?? "en_US"
    )
  }
}

struct PluralDict {
  let zero: String
  let one: String
  let two: String
  let few: String
  let many: String
  let other: String

  init(
    zero: String? = nil,
    one: String? = nil,
    two: String? = nil,
    few: String? = nil,
    many: String? = nil,
    other: String? = nil
  ) {
    precondition(
      zero != nil || one != nil || two != nil || few != nil || many != nil || other != nil,
      "PluralDict requires at least one non-nil value."
    )

    let resolvedOther =
      other ?? one
      ?? zero ?? two ?? few ?? many
      ?? ""

    let resolvedOne = one ?? resolvedOther

    let resolvedZero = zero ?? resolvedOther ?? resolvedOne
    let resolvedTwo = two ?? few ?? resolvedOther ?? resolvedOne
    let resolvedFew = few ?? many ?? resolvedOther ?? resolvedOne
    let resolvedMany = many ?? few ?? resolvedOther ?? resolvedOne

    self.zero = resolvedZero
    self.one = resolvedOne
    self.two = resolvedTwo
    self.few = resolvedFew
    self.many = resolvedMany
    self.other = resolvedOther
  }

  static func create(name: String, _ input: [String: Any]) -> Self {
    let zero = input["\(name)_zero"] as? String
    let one = input["\(name)_one"] as? String
    let two = input["\(name)_two"] as? String
    let few = input["\(name)_few"] as? String
    let many = input["\(name)_many"] as? String
    let other = input["\(name)_other"] as? String

    return Self(zero: zero, one: one, two: two, few: few, many: many, other: other)
  }

  init(one: String) {
    self.init(zero: nil, one: one, two: nil, few: nil, many: nil, other: nil)
  }

  func string(for count: Int) -> String {
    let n = abs(count)
    let template: String

    if n == 0, zero != other {
      template = zero
    } else if n == 1 {
      template = one
    } else if n == 2, two != other {
      template = two
    } else if (3...4).contains(n), few != other {
      template = few
    } else if n >= 5, many != other {
      template = many
    } else {
      template = other
    }

    return template.replacingOccurrences(of: "{{count}}", with: String(count))
  }
}
