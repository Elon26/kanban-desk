import UIKit

class DraggableCollectionHeaderView: UICollectionReusableView {
  static let identifier = "DraggableCollectionHeaderView"

  private lazy var titleLabel: UILabel = {
    let label = UILabel()
    label.font = .systemFont(ofSize: 18, weight: .semibold)
    label.textColor = .white
    label.translatesAutoresizingMaskIntoConstraints = false

    label.setContentCompressionResistancePriority(.defaultLow, for: .horizontal)
    label.setContentHuggingPriority(.defaultLow, for: .horizontal)
    label.lineBreakMode = .byTruncatingTail
    return label
  }()

  private lazy var countLabel: UILabel = {
    let label = UILabel()
    label.font = .systemFont(ofSize: 12)
    label.textColor = UIColor(hex: "#BFBFBF")
    label.translatesAutoresizingMaskIntoConstraints = false

    label.setContentCompressionResistancePriority(.required, for: .horizontal)
    label.setContentHuggingPriority(.required, for: .horizontal)
    return label
  }()

  private lazy var colorIndicator: UIView = {
    let view = UIView()
    view.layer.cornerRadius = 6
    view.translatesAutoresizingMaskIntoConstraints = false
    return view
  }()

  override init(frame: CGRect) {
    super.init(frame: frame)
    setup()
  }

  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  override func prepareForReuse() {
    super.prepareForReuse()
    titleLabel.text = nil
    countLabel.text = nil
    colorIndicator.backgroundColor = .clear
  }

  private func setup() {
    addSubview(colorIndicator)
    addSubview(titleLabel)
    addSubview(countLabel)

    NSLayoutConstraint.activate([
      colorIndicator.leadingAnchor.constraint(
        equalTo: layoutMarginsGuide.leadingAnchor, constant: 8),
      colorIndicator.centerYAnchor.constraint(equalTo: centerYAnchor),
      colorIndicator.widthAnchor.constraint(equalToConstant: 12),
      colorIndicator.heightAnchor.constraint(equalToConstant: 12),

      countLabel.trailingAnchor.constraint(
        equalTo: layoutMarginsGuide.trailingAnchor, constant: -8),
      countLabel.centerYAnchor.constraint(equalTo: centerYAnchor),

      titleLabel.leadingAnchor.constraint(
        equalTo: colorIndicator.trailingAnchor, constant: 8),
      titleLabel.centerYAnchor.constraint(equalTo: centerYAnchor),
      titleLabel.trailingAnchor.constraint(
        lessThanOrEqualTo: countLabel.leadingAnchor, constant: -8),
    ])
  }

  func configure(with status: TaskStatus, taskCount: Int) {
    titleLabel.text =
      (status.id == DraggableCollection.newGroupId)
      ? DraggableCollectionView.sharedDictionary.new_group : status.name
    if status.id == DraggableCollection.newGroupId {
      countLabel.text = ""
    } else {
      let formattedCount = DraggableCollectionView.sharedDictionary.task.string(for: taskCount)
      countLabel.text = formattedCount
    }
    colorIndicator.backgroundColor = UIColor(hex: status.color) ?? .white
  }
}
