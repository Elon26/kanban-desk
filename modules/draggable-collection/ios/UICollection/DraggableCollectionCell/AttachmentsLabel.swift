import UIKit

final class AttachmentsLabel: UIView {
  private lazy var iconImageView: UIImageView = {
    let base64string =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAYAAACMRWrdAAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKXSURBVHgB7ZqvU+NAFMe/zZxAnuNk5EkkMv0Pzt3JnkJSiaP8BWgUg6tjkKgWhwQHiuDAVVa1vEeToSS7m+z27aaBfGbedEgyZb/7fm22C3R0dPikB0smk8lP+siN2cnMBN/fJ0vZ+v3+FJ6pFEZCeFB7ZL/JfqFahAqehMO1v1OyKdkJiUzhAaMwEsVC/uHDO64Uha0zInEnEEYrLBM1gJuHipiEMSlZX9J7keEee0pCVB1isieazGMIofQY/QPOqT+Qo8pj60zJ/m/qPZ3H9tAcCd7ndrLRxOqExWiWmOxyk9AsCcuKxrYwovGcwgGVx0IVjLoMSdw5LFEJ27Rn+WBgKy5CexjYhGUoj80gw7BuQQnpsTlk4IIyrHoopDAprzGnJC4xPRBSWApZuM/FupshhT1CFq4F2koZ2mMpZEl0IRm63F9DrojkKKtkaGEvZBeQFZdk2xWfaKJBs7gzsjvIkRQv/EAzcOm/IrvBaiW/i9V+CuOyQCgt3JsSlsMCJTyXFi+0aa1oopSzX0VYiS8rzDXH6uz+1mEO+b72jouwv1jtCktxi1XjFsU2FLkUS4pi9uHhHdBWGIeN5OsHsu+T/k7rUGRhvCSSnOEXeMAlx7zMsDRdH2sbqlCsDLMoinaXy6VVH6PnX+GpZ0ExZpccO1gsFi7b4PNerzcmgc8IgCoUTR7jaui6t79DomL4oTRmW2F8z7U8cxjeww+lENf98HcE81rQpY95WxfSj4Sj4jVdjrFXYujZpj6Wqi7qyv0D2oPyDTwyPLz1qwtiRmFYXxg9zLkwhr++I0E+RiWhDrBIw9E0JgdoK3Sts1TZ8Qi2GM3BHmIhnP93WVRpcTkklp+nyr3oy5uztU/OpTbkfEfHt+ENUmey2oooDkwAAAAASUVORK5CYII="

    let imageView = UIImageView()

    if base64string.hasPrefix("data:image"),
      let base64Data = base64string.components(separatedBy: ",").last,
      let imageData = Data(base64Encoded: base64Data),
      let image = UIImage(data: imageData)
    {
      imageView.image = image
    }

    imageView.contentMode = .scaleAspectFit
    imageView.translatesAutoresizingMaskIntoConstraints = false
    return imageView
  }()

  private let label: UILabel = {
    let label = UILabel()
    label.font = .systemFont(ofSize: 12, weight: .medium)
    label.textColor = UIColor(hex: "#BFBFBF")
    label.numberOfLines = 1
    label.translatesAutoresizingMaskIntoConstraints = false
    return label
  }()

  var attachments: [TaskAttachment]? {
    didSet {
      if let attachments = attachments, !attachments.isEmpty {
        let text = attachments.map { $0.name }.joined(separator: ", ")
        label.text = text
        iconImageView.isHidden = false
      } else {
        iconImageView.isHidden = true
        label.text = nil
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
    addSubview(iconImageView)
    addSubview(label)

    backgroundColor = .white.withAlphaComponent(0.07)
    layer.cornerRadius = 3
    layer.masksToBounds = true

    NSLayoutConstraint.activate([
      iconImageView.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 3),
      iconImageView.centerYAnchor.constraint(equalTo: centerYAnchor),
      iconImageView.widthAnchor.constraint(equalToConstant: 18),
      iconImageView.heightAnchor.constraint(equalToConstant: 18),

      label.leadingAnchor.constraint(equalTo: iconImageView.trailingAnchor, constant: 8),
      label.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -3),
      label.centerYAnchor.constraint(equalTo: centerYAnchor),
    ])
  }

}
