import SwiftUI
import WidgetKit

@main
struct widgetsPackBundle: WidgetBundle {
  var body: some Widget {
    CleanerWidget()
    SpeedWidget()
    CalendarWidget()
  }
}

func getMainBundleId() -> String? {
  Bundle.main.bundleIdentifier?.split(separator: ".").dropLast().joined(separator: ".")
}

let suiteName = "group.\(getMainBundleId() ?? "default.bundle.id").widget"

extension View {
  @ViewBuilder
  func backgroundModifier() -> some View {
    if #available(iOS 17.0, *) {
      self.containerBackground(.fill.tertiary, for: .widget)
    } else {
      self
    }
  }
}

extension Color {
  init(hex: String) {
    let scanner = Scanner(string: hex)
    scanner.scanLocation = 1
    var rgbValue: UInt64 = 0
    scanner.scanHexInt64(&rgbValue)
    let r = CGFloat((rgbValue & 0xff0000) >> 16) / 255
    let g = CGFloat((rgbValue & 0xff00) >> 8) / 255
    let b = CGFloat(rgbValue & 0xff) / 255
    self.init(red: r, green: g, blue: b)
  }
}

let blueGradient = LinearGradient(
  gradient: Gradient(colors: [Color(hex: "#43C2F9"), Color(hex: "#438FF9")]),
  startPoint: .leading,
  endPoint: .trailing
)

func prettifyBytes(_ bytes: Double, decimalPartLength: Int) -> (
  value: String, unit: String, full: String
) {
  let formatter = ByteCountFormatter()
  formatter.allowedUnits = [.useMB, .useGB]
  formatter.countStyle = .memory

  let formattedString = formatter.string(fromByteCount: Int64(bytes))
  let components = formattedString.components(separatedBy: " ")

  let doubleFormatter = NumberFormatter()
  doubleFormatter.decimalSeparator = ","

  return (
    String(
      format: "%." + String(decimalPartLength) + "f",
      Double(components.first!.replacingOccurrences(of: ",", with: "."))!), components.last!,
    formattedString
  )
}

func prettifyBits(_ bites: Double, decimalPartLength: Int) -> (
  value: String, unit: String, full: String
) {
  var i = -1
  let biteUnits = ["Kb/S", "Mb/S", "Gb/S", "Tb/S", "Pb/S", "Eb/S", "Zb/S", "Yb/S"]

  var bites = bites

  repeat {
    bites /= 1000
    i += 1
  } while bites > 1000

  let bitSize = max(bites, 0)
  let value = String(format: "%." + String(decimalPartLength) + "f", Double(bitSize))
  return (value, "\(biteUnits[i])", "\(value) \(biteUnits[i])")
}
