import UIKit

final class DraggableCollectionCell: UICollectionViewCell {
  static let identifier = "DraggableCollectionCell"
  private lazy var priorityLabel: PriorityLabel = {
    let label = PriorityLabel()
    label.translatesAutoresizingMaskIntoConstraints = false
    return label
  }()

  private lazy var titleAndTagView: TitleAndTagLabels = {
    let view = TitleAndTagLabels()
    view.translatesAutoresizingMaskIntoConstraints = false
    return view
  }()
  private var titleAndTagViewTopToPriorityConstraint: NSLayoutConstraint?
  private var titleAndTagViewTopToMarginsConstraint: NSLayoutConstraint?

  private lazy var descriptionLabel: UILabel = {
    let label = UILabel()
    label.font = .systemFont(ofSize: 12)
    label.textColor = UIColor(hex: "#BFBFBF")
    label.numberOfLines = 2
    label.translatesAutoresizingMaskIntoConstraints = false
    return label
  }()

  private lazy var updatedLabel: UpdatedLabel = {
    let label = UpdatedLabel()
    label.translatesAutoresizingMaskIntoConstraints = false
    return label
  }()

  private lazy var attachmentsLabel: AttachmentsLabel = {
    let label = AttachmentsLabel()
    label.translatesAutoresizingMaskIntoConstraints = false
    return label
  }()
  private var attachmentsHeightConstraintFull: NSLayoutConstraint?
  private var attachmentsHeightConstraintCollapsed: NSLayoutConstraint?

  override init(frame: CGRect) {
    super.init(frame: frame)
    setup()
  }

  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  private func setup() {
    layer.cornerRadius = 7
    layer.masksToBounds = true

    addSubview(priorityLabel)
    NSLayoutConstraint.activate([
      priorityLabel.leadingAnchor.constraint(equalTo: layoutMarginsGuide.leadingAnchor),
      priorityLabel.topAnchor.constraint(equalTo: layoutMarginsGuide.topAnchor),
      priorityLabel.widthAnchor.constraint(greaterThanOrEqualToConstant: 20),
      priorityLabel.heightAnchor.constraint(equalToConstant: 20),
    ])

    addSubview(titleAndTagView)
    NSLayoutConstraint.activate([
      titleAndTagView.leadingAnchor.constraint(equalTo: layoutMarginsGuide.leadingAnchor),
      titleAndTagView.trailingAnchor.constraint(equalTo: layoutMarginsGuide.trailingAnchor),
      titleAndTagView.heightAnchor.constraint(equalToConstant: 20),
    ])
    titleAndTagViewTopToPriorityConstraint = titleAndTagView.topAnchor.constraint(
      equalTo: priorityLabel.bottomAnchor, constant: 8)
    titleAndTagViewTopToMarginsConstraint = titleAndTagView.topAnchor.constraint(
      equalTo: layoutMarginsGuide.topAnchor)

    addSubview(descriptionLabel)
    NSLayoutConstraint.activate([
      descriptionLabel.leadingAnchor.constraint(equalTo: layoutMarginsGuide.leadingAnchor),
      descriptionLabel.trailingAnchor.constraint(equalTo: layoutMarginsGuide.trailingAnchor),
      descriptionLabel.topAnchor.constraint(equalTo: titleAndTagView.bottomAnchor, constant: 8),
    ])

    addSubview(updatedLabel)
    NSLayoutConstraint.activate([
      updatedLabel.leadingAnchor.constraint(equalTo: layoutMarginsGuide.leadingAnchor),
      updatedLabel.trailingAnchor.constraint(equalTo: layoutMarginsGuide.trailingAnchor),
      updatedLabel.topAnchor.constraint(equalTo: descriptionLabel.bottomAnchor, constant: 8),
    ])

    addSubview(attachmentsLabel)
    NSLayoutConstraint.activate([
      attachmentsLabel.leadingAnchor.constraint(equalTo: layoutMarginsGuide.leadingAnchor),
      attachmentsLabel.trailingAnchor.constraint(
        lessThanOrEqualTo: layoutMarginsGuide.trailingAnchor),
      attachmentsLabel.topAnchor.constraint(equalTo: updatedLabel.bottomAnchor, constant: 8),
    ])
    attachmentsHeightConstraintFull = attachmentsLabel.heightAnchor.constraint(equalToConstant: 24)
    attachmentsHeightConstraintCollapsed = attachmentsLabel.heightAnchor.constraint(
      equalToConstant: 0)

    let bottomConstraint = attachmentsLabel.bottomAnchor.constraint(
      equalTo: layoutMarginsGuide.bottomAnchor)
    bottomConstraint.isActive = true
    bottomConstraint.priority = UILayoutPriority(999)

  }

  override func preferredLayoutAttributesFitting(
    _ layoutAttributes: UICollectionViewLayoutAttributes
  ) -> UICollectionViewLayoutAttributes {
    let attributes = super.preferredLayoutAttributesFitting(layoutAttributes)

    layoutIfNeeded()
    let targetSize = CGSize(width: layoutAttributes.frame.width, height: 0)

    attributes.frame.size = systemLayoutSizeFitting(
      targetSize,
      withHorizontalFittingPriority: .required,
      verticalFittingPriority: .fittingSizeLevel
    )
    return attributes
  }

  func configure(with task: Task, color: UIColor) {
    backgroundColor = color.withAlphaComponent(0.15)
    priorityLabel.priority = task.priority
    priorityLabel.isHidden = task.priority == nil

    titleAndTagView.configure(with: task)
    if task.priority == nil {
      titleAndTagViewTopToPriorityConstraint?.isActive = false
      titleAndTagViewTopToMarginsConstraint?.isActive = true
    } else {
      titleAndTagViewTopToMarginsConstraint?.isActive = false
      titleAndTagViewTopToPriorityConstraint?.isActive = true
    }

    descriptionLabel.text = task.description

    if let updatedAt = task.updatedAt {
      updatedLabel.configure(with: updatedAt)
      updatedLabel.isHidden = false
    } else {
      updatedLabel.isHidden = true
    }

    attachmentsLabel.attachments = task.attachments
    if task.attachments?.isEmpty == false {
      attachmentsHeightConstraintFull?.isActive = true
      attachmentsHeightConstraintCollapsed?.isActive = false
      attachmentsLabel.isHidden = false
    } else {
      attachmentsHeightConstraintFull?.isActive = false
      attachmentsHeightConstraintCollapsed?.isActive = true
      attachmentsLabel.isHidden = true
    }

    setNeedsLayout()

  }
}

final class TitleAndTagLabels: UIView {
  private lazy var tagLabel: TagLabel = {
    let label = TagLabel()
    label.translatesAutoresizingMaskIntoConstraints = false
    return label
  }()

  private lazy var titleLabel: UILabel = {
    let label = UILabel()
    label.font = .systemFont(ofSize: 18, weight: .semibold)
    label.textColor = .white
    label.numberOfLines = 1
    label.translatesAutoresizingMaskIntoConstraints = false
    return label
  }()

  private var titleTrailingConstraintToTag: NSLayoutConstraint?
  private var titleTrailingConstraintToParent: NSLayoutConstraint?
  private var tagTrailingConstraint: NSLayoutConstraint?
  private var titleMaxWidthConstraint: NSLayoutConstraint?
  private var titleMinWidthConstraint: NSLayoutConstraint?
  private var tagWidthConstraint: NSLayoutConstraint?
  private var tagMaxWidthConstraint: NSLayoutConstraint?
  private var titleWidthConstraint: NSLayoutConstraint?

  override init(frame: CGRect) {
    super.init(frame: frame)
    setup()
  }

  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  private func setup() {
    addSubview(titleLabel)
    addSubview(tagLabel)

    NSLayoutConstraint.activate([
      titleLabel.leadingAnchor.constraint(equalTo: leadingAnchor),
      titleLabel.topAnchor.constraint(equalTo: topAnchor),
      titleLabel.bottomAnchor.constraint(equalTo: bottomAnchor),

      tagLabel.topAnchor.constraint(equalTo: topAnchor),
      tagLabel.bottomAnchor.constraint(equalTo: bottomAnchor),
    ])

    titleTrailingConstraintToTag = titleLabel.trailingAnchor.constraint(
      equalTo: tagLabel.leadingAnchor, constant: -8)
    titleTrailingConstraintToParent = titleLabel.trailingAnchor.constraint(
      equalTo: trailingAnchor)
    tagTrailingConstraint = tagLabel.trailingAnchor.constraint(equalTo: trailingAnchor)

    tagLabel.setContentHuggingPriority(.defaultHigh, for: .horizontal)
    tagLabel.setContentCompressionResistancePriority(.required, for: .horizontal)
    titleLabel.setContentHuggingPriority(.defaultLow, for: .horizontal)
    titleLabel.setContentCompressionResistancePriority(.defaultLow, for: .horizontal)
  }

  func configure(with task: Task) {
    titleLabel.text = task.name
    tagLabel.taskTag = task.tag
    tagLabel.isHidden = task.tag == nil

    tagWidthConstraint?.isActive = false
    tagMaxWidthConstraint?.isActive = false
    titleWidthConstraint?.isActive = false
    titleMaxWidthConstraint?.isActive = false
    titleMinWidthConstraint?.isActive = false
    titleTrailingConstraintToTag?.isActive = false
    titleTrailingConstraintToParent?.isActive = false
    tagTrailingConstraint?.isActive = false

    if task.tag == nil {
      // No tag case - title takes full width
      titleTrailingConstraintToParent?.isActive = true
    } else {
      tagTrailingConstraint?.isActive = true
      titleTrailingConstraintToTag?.isActive = true

      // Force layout to get accurate intrinsic content sizes
      setNeedsLayout()
      layoutIfNeeded()

      let tagIntrinsicWidth = tagLabel.intrinsicContentSize.width
      let titleIntrinsicWidth = titleLabel.intrinsicContentSize.width
      let availableWidth = frame.width > 0 ? frame.width : 300  // fallback width
      let gap: CGFloat = 8

      let totalNeededWidth = tagIntrinsicWidth + titleIntrinsicWidth + gap

      if totalNeededWidth <= availableWidth {
        // Case 1: Both fit comfortably - let them use natural sizes
        // No additional constraints needed
      } else {
        // Case 2: Space constraint
        if tagIntrinsicWidth < 70 {
          // Case 2.1: Tag < 70px - tag gets content width, title gets remaining
          let remainingForTitle = availableWidth - tagIntrinsicWidth - gap
          titleMaxWidthConstraint = titleLabel.widthAnchor.constraint(
            lessThanOrEqualToConstant: max(150, remainingForTitle))
          titleMaxWidthConstraint?.priority = UILayoutPriority(999)
          titleMaxWidthConstraint?.isActive = true

          // Ensure title has a reasonable minimum
          titleMinWidthConstraint = titleLabel.widthAnchor.constraint(
            greaterThanOrEqualToConstant: min(150, remainingForTitle))
          titleMinWidthConstraint?.priority = UILayoutPriority(800)
          titleMinWidthConstraint?.isActive = true
        } else {
          // Case 2.2: Tag >= 70px - set EXACT widths
          let titleWidth = availableWidth - 70 - gap
          let minTitleWidth: CGFloat = 100

          // Set exact widths
          tagWidthConstraint = tagLabel.widthAnchor.constraint(equalToConstant: 70)
          tagWidthConstraint?.isActive = true

          titleWidthConstraint = titleLabel.widthAnchor.constraint(
            equalToConstant: max(minTitleWidth, titleWidth))
          titleWidthConstraint?.isActive = true
        }

      }
    }

    setNeedsLayout()
  }

}
