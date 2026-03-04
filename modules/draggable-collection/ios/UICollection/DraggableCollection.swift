import UIKit

final class DraggableCollection: UICollectionView {
  // MARK: - Properties
  private let dataManager = TaskDataManager()
  var dataChangeDelegate: DraggableCollectionViewDelegate? {
    didSet {
      dataManager.delegate = dataChangeDelegate
    }
  }

  // Legacy compatibility - direct access to data
  var data: [TaskStatusGroup] {
    return dataManager.allStatusGroups
  }

  static let newGroupId = "__new-group__"

  // MARK: - Initialization
  override init(
    frame: CGRect, collectionViewLayout layout: UICollectionViewLayout
  ) {
    super.init(frame: frame, collectionViewLayout: layout)
    setupCollectionView()
  }

  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  // MARK: - Public Methods
  func setData(_ data: [TaskStatusGroup]) {
    dataManager.setData(data)
    DispatchQueue.main.async {
      self.reloadData()
    }
  }

  // MARK: - Data Manager Access
  func getDataManager() -> TaskDataManager {
    return dataManager
  }

  // MARK: - Private Setup
  private func setupCollectionView() {
    dataSource = self
    delegate = self
    prefetchDataSource = self

    dragDelegate = self
    dropDelegate = self

    dragInteractionEnabled = true

    showsVerticalScrollIndicator = false
    showsHorizontalScrollIndicator = true
    alwaysBounceHorizontal = true
    alwaysBounceVertical = false

    backgroundColor = .clear
    contentInsetAdjustmentBehavior = .scrollableAxes
    clipsToBounds = true

    contentInset = UIEdgeInsets(
      top: 0, left: 16, bottom: safeAreaInsets.bottom, right: 16
    )

    register(
      DraggableCollectionCell.self,
      forCellWithReuseIdentifier: DraggableCollectionCell.identifier
    )

    register(
      DraggableCollectionHeaderView.self,
      forSupplementaryViewOfKind: UICollectionView.elementKindSectionHeader,
      withReuseIdentifier: DraggableCollectionHeaderView.identifier
    )
  }

  // MARK: - Layout
  static func createCompositionalLayout() -> UICollectionViewLayout {
    let sectionBackgroundDecorationKind = DraggableCollectionBackgroundView.identifier

    let layout = UICollectionViewCompositionalLayout {
      (sectionIndex, environment) -> NSCollectionLayoutSection? in

      let headerSize = NSCollectionLayoutSize(
        widthDimension: .absolute(260 + 24),
        heightDimension: .absolute(46)
      )
      let sectionHeader = NSCollectionLayoutBoundarySupplementaryItem(
        layoutSize: headerSize,
        elementKind: UICollectionView.elementKindSectionHeader,
        alignment: .top
      )
      sectionHeader.pinToVisibleBounds = false

      let itemSize = NSCollectionLayoutSize(
        widthDimension: .fractionalWidth(1.0),
        heightDimension: .estimated(160)
      )
      let item = NSCollectionLayoutItem(layoutSize: itemSize)
      item.contentInsets = NSDirectionalEdgeInsets(top: 0, leading: 0, bottom: 0, trailing: 0)

      let groupSize = NSCollectionLayoutSize(
        widthDimension: .absolute(260),
        heightDimension: .estimated(160)
      )

      let group = NSCollectionLayoutGroup.vertical(layoutSize: groupSize, subitems: [item])
      group.interItemSpacing = .fixed(0)

      let section = NSCollectionLayoutSection(group: group)
      section.boundarySupplementaryItems = [sectionHeader]

      section.interGroupSpacing = 8
      section.contentInsets = NSDirectionalEdgeInsets(
        top: 55, leading: 12, bottom: 12, trailing: 12)
      section.supplementariesFollowContentInsets = false

      let sectionBackgroundDecoration = NSCollectionLayoutDecorationItem.background(
        elementKind: sectionBackgroundDecorationKind)
      sectionBackgroundDecoration.contentInsets = NSDirectionalEdgeInsets(
        top: 0, leading: 0, bottom: 0, trailing: 0)
      section.decorationItems = [sectionBackgroundDecoration]

      section.orthogonalScrollingBehavior = .continuous

      section.visibleItemsInvalidationHandler = { (items, offset, environment) in
        if items.isEmpty {
          // Handle empty state if needed
        }
      }

      return section
    }

    let config = UICollectionViewCompositionalLayoutConfiguration()
    config.scrollDirection = .horizontal
    config.interSectionSpacing = 22
    layout.configuration = config

    layout.register(
      DraggableCollectionBackgroundView.self,
      forDecorationViewOfKind: DraggableCollectionBackgroundView.identifier
    )

    return layout
  }
}
