import UIKit

final class TagLabel: UIView {
  private let label: UILabel = {
    let label = UILabel()
    label.font = .systemFont(ofSize: 12, weight: .medium)
    label.textAlignment = .center
    label.textColor = .white
    label.translatesAutoresizingMaskIntoConstraints = false
    // Prevent the label from expanding beyond its content
    label.setContentHuggingPriority(.required, for: .horizontal)
    label.setContentCompressionResistancePriority(.required, for: .horizontal)
    return label
  }()

  var taskTag: TaskTag? {
    didSet {
      if let taskTag {
        label.text = "# \(taskTag.name)"
      } else {
        label.text = nil
      }

      backgroundColor = UIColor(hex: taskTag?.color ?? "") ?? .clear
      invalidateIntrinsicContentSize()
    }
  }

  init() {
    super.init(frame: .zero)
    setup()
  }

  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  private func setup() {
    layer.cornerRadius = 10
    clipsToBounds = true

    addSubview(label)

    NSLayoutConstraint.activate([
      // Center the label and let it determine the size
      label.centerXAnchor.constraint(equalTo: centerXAnchor),
      label.centerYAnchor.constraint(equalTo: centerYAnchor),

      // Add minimum padding constraints
      label.leadingAnchor.constraint(greaterThanOrEqualTo: leadingAnchor, constant: 8),
      label.trailingAnchor.constraint(lessThanOrEqualTo: trailingAnchor, constant: -8),
      label.topAnchor.constraint(greaterThanOrEqualTo: topAnchor),
      label.bottomAnchor.constraint(lessThanOrEqualTo: bottomAnchor),
    ])
  }

  override var intrinsicContentSize: CGSize {
    let labelSize = label.intrinsicContentSize
    return CGSize(
      width: labelSize.width + 16,  // 8pt padding on each side
      height: labelSize.height
    )
  }
}
