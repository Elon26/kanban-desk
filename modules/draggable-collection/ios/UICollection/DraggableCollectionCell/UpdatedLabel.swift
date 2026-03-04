import UIKit

final class UpdatedLabel: UIView {
  private lazy var dateFormatter: DateFormatter = {
    let formatter = DateFormatter()
    formatter.dateFormat = "MMMM dd, HH:mm"
    return formatter
  }()

  private let label1: UILabel = {
    let label = UILabel()
    label.font = .systemFont(ofSize: 12, weight: .medium)
    label.textColor = UIColor(hex: "#63CBF7") ?? .clear

    return label
  }()
  private let label2: UILabel = {
    let label = UILabel()
    label.font = .systemFont(ofSize: 12, weight: .medium)
    label.textColor = UIColor(hex: "#63CBF7") ?? .clear
    label.textAlignment = .left
    return label
  }()

  var updatedAt: Date? {
    didSet {
      let dict = DraggableCollectionView.sharedDictionary
      label1.text = "\(dict.updated):"
      dateFormatter.locale = Locale(identifier: dict.locale_identifier)
      if let updatedAt {
        label2.text = dateFormatter.string(from: updatedAt)
      } else {
        label2.text = nil
      }
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
    addSubview(label1)
    label1.translatesAutoresizingMaskIntoConstraints = false
    NSLayoutConstraint.activate([
      label1.leadingAnchor.constraint(equalTo: leadingAnchor),
      label1.topAnchor.constraint(equalTo: topAnchor),
      label1.bottomAnchor.constraint(equalTo: bottomAnchor),
    ])

    addSubview(label2)
    label2.translatesAutoresizingMaskIntoConstraints = false
    NSLayoutConstraint.activate([
      label2.leadingAnchor.constraint(equalTo: label1.trailingAnchor, constant: 8),
      label2.topAnchor.constraint(equalTo: topAnchor),
      label2.bottomAnchor.constraint(equalTo: bottomAnchor),
    ])
  }
  func configure(with date: Date) {
    updatedAt = date
  }
}
