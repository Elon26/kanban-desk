import UIKit

final class PriorityLabel: UIView {
  private let label: UILabel = {
    let label = UILabel()
    label.font = .systemFont(ofSize: 12)
    label.textAlignment = .center
    label.textColor = .systemGray
    return label
  }()

  var priority: TaskPriority? {
    didSet {
      label.text = priority?.name
      let color = UIColor(hex: priority?.color ?? "") ?? .clear
      backgroundColor = color.withAlphaComponent(0.15)
      layer.borderColor = color.cgColor
      label.textColor = color
      setNeedsLayout()
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
    layer.borderWidth = 1
    // layer.cornerRadius = 10
    clipsToBounds = true

    addSubview(label)
    label.translatesAutoresizingMaskIntoConstraints = false
    NSLayoutConstraint.activate([
      label.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 8),
      label.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -8),
      label.topAnchor.constraint(equalTo: topAnchor),
      label.bottomAnchor.constraint(equalTo: bottomAnchor),
    ])
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    layer.cornerRadius = bounds.height / 2
  }
}
