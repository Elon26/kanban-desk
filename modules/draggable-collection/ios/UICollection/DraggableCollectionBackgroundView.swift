final class DraggableCollectionBackgroundView: UICollectionReusableView {
  static let identifier = "DraggableCollectionBackgroundView"
  private let contentView = UIView()
  private var contentViewFullHeightConstraint: NSLayoutConstraint?
  private var contentViewCollapsedHeightConstraint: NSLayoutConstraint?

  private lazy var addTaskButton: UIButton = {
    let button = UIButton(type: .system)
    // Title is set at display-time to use the latest dictionary
    button.translatesAutoresizingMaskIntoConstraints = false
    button.addTarget(self, action: #selector(addTaskButtonTapped), for: .touchUpInside)
    button.layer.cornerRadius = 22
    button.layer.masksToBounds = true
    button.backgroundColor = UIColor(hex: "#3D93F2")
    button.setTitleColor(.white, for: .normal)
    button.titleLabel?.font = .systemFont(ofSize: 14, weight: .medium)

    return button
  }()

  var onAddButtonTapped: (() -> Void)? {
    didSet {
      if onAddButtonTapped == nil {
        addTaskButton.removeFromSuperview()
      } else {
        contentView.addSubview(addTaskButton)
        addTaskButton.setTitle(
          DraggableCollectionView.sharedDictionary.create_new_group, for: .normal)
        NSLayoutConstraint.activate([
          addTaskButton.heightAnchor.constraint(equalToConstant: 44),
          addTaskButton.leadingAnchor.constraint(
            equalTo: contentView.layoutMarginsGuide.leadingAnchor, constant: 8),
          addTaskButton.trailingAnchor.constraint(
            equalTo: contentView.layoutMarginsGuide.trailingAnchor, constant: -8),
          addTaskButton.bottomAnchor.constraint(
            equalTo: contentView.layoutMarginsGuide.bottomAnchor, constant: -12),
        ])
      }
    }
  }

  var color: UIColor? {
    didSet {
      contentView.backgroundColor = color?.withAlphaComponent(0.15)
    }
  }

  var isCollapsed: Bool = false {
    didSet {
      contentViewFullHeightConstraint?.isActive = !isCollapsed
      contentViewCollapsedHeightConstraint?.isActive = isCollapsed
    }
  }

  override init(frame: CGRect) {
    super.init(frame: frame)
    setup()
  }

  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  private func setup() {
    // layer.cornerRadius = 12
    // layer.masksToBounds = true
    contentView.translatesAutoresizingMaskIntoConstraints = false
    addSubview(contentView)
    NSLayoutConstraint.activate([
      contentView.leadingAnchor.constraint(equalTo: leadingAnchor),
      contentView.trailingAnchor.constraint(equalTo: trailingAnchor),
      contentView.topAnchor.constraint(equalTo: topAnchor),
    ])
    contentViewFullHeightConstraint = contentView.bottomAnchor.constraint(equalTo: bottomAnchor)
    contentViewCollapsedHeightConstraint = contentView.heightAnchor.constraint(equalToConstant: 120)

    contentView.backgroundColor = .clear
    contentView.layer.cornerRadius = 12
    contentView.layer.masksToBounds = true
  }

  override func didMoveToWindow() {
    super.didMoveToWindow()
    if window != nil {
      // Ensure dictionary is applied when visible
      addTaskButton.setTitle(
        DraggableCollectionView.sharedDictionary.create_new_group, for: .normal)
    }
  }

  @objc private func addTaskButtonTapped() {
    UIView.animate(
      withDuration: 0.15,
      animations: {
        self.addTaskButton.transform = CGAffineTransform(scaleX: 0.95, y: 0.95)
        self.addTaskButton.alpha = 0.8
      },
      completion: { _ in
        UIView.animate(withDuration: 0.15) {
          self.addTaskButton.transform = CGAffineTransform.identity
          self.addTaskButton.alpha = 1.0
        }
      })
    onAddButtonTapped?()
  }
}
