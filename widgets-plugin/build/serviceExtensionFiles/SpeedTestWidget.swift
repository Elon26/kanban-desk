import Foundation
import SwiftUI
import WidgetKit

// MARK: - Widget Entry Data Model

struct SpeedWidgetEntry: TimelineEntry {
  let date: Date
  let speeds: [String: Double]
}

let SampleSpeedWidgetEntry = SpeedWidgetEntry(
  date: Date(), speeds: ["downloadSpeed": 150.99, "uploadSpeed": 89.25])

// MARK: - Provider (without Timeline)

struct SpeedLockScreenWidgetEntryView: View {
  var entry: SpeedWidgetEntry

  var body: some View {
    ZStack(alignment: .bottom) {
      Image("speed-aod-bg")
      Spacer()
      VStack {
        HStack {
          Text("\(Int(entry.speeds["downloadSpeed"] ?? 0))")
            .font(.caption)
          Text("\(Int(entry.speeds["uploadSpeed"] ?? 0))")
            .font(.caption)
        }
        .foregroundColor(.white)
      }
    }
    .backgroundModifier()
  }
}

struct SpeedTestWidgetLockScreen: Widget {
  let kind: String = "SpeedTestLockScreenWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: SpeedWidgetProvider()) { entry in
      SpeedWidgetEntryView(entry: entry)
    }
    .supportedFamilies([.accessoryCircular])
  }
}

// MARK: - Widget View

struct SpeedWidgetEntryView: View {
  var entry: SpeedWidgetEntry
  var downloadSpeedPretty: String {
    if let speed = entry.speeds["downloadSpeed"] {
      return String(format: "%.2f", speed)
    } else {
      return "--.--"
    }
  }

  var uploadSpeedPretty: String {
    if let speed = entry.speeds["uploadSpeed"] {
      return String(format: "%.2f", speed)
    } else {
      return "--.--"
    }
  }

  var body: some View {
    VStack(spacing: 16) {
      VStack(alignment: .leading, spacing: 8) {
        Text("Download")
          .font(.system(size: 12, design: .rounded))
          .foregroundColor(Color("uitext-medium"))
        HStack(alignment: .firstTextBaseline, spacing: 4) {
          Text(downloadSpeedPretty)
            .font(.system(size: 23, weight: .medium, design: .rounded))
            .foregroundColor(Color("uitext"))
          Text("Mbps")
            .font(.system(size: 12, design: .rounded))
            .foregroundColor(Color("uitext-medium"))
        }
      }
      .frame(maxWidth: .infinity, alignment: .leading)

      Spacer()

      VStack(alignment: .leading, spacing: 8) {
        Text("Upload")
          .font(.system(size: 12, design: .rounded))
          .foregroundColor(Color("uitext-medium"))
        HStack(alignment: .firstTextBaseline, spacing: 4) {
          Text(uploadSpeedPretty)
            .font(.system(size: 23, weight: .medium, design: .rounded))
            .foregroundColor(Color("uitext"))
          Text("Mbps")
            .font(.system(size: 12, design: .rounded))
            .foregroundColor(Color("uitext-medium"))
        }
      }
      .frame(maxWidth: .infinity, alignment: .leading)
    }
    .frame(maxWidth: .infinity, alignment: .leading)
  }

}

struct SpeedWidgetEntryView_Previews: PreviewProvider {
  static var previews: some View {
    if #available(iOS 17.0, *) {
      SpeedWidgetEntryView(entry: SampleSpeedWidgetEntry)
        .previewContext(WidgetPreviewContext(family: .systemSmall))
        .containerBackground(.fill.tertiary, for: .widget)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
  }
}

// MARK: - Provider (without Timeline)

struct SpeedWidgetProvider: TimelineProvider {
  func placeholder(in context: Context) -> SpeedWidgetEntry {
    SampleSpeedWidgetEntry
  }

  func getSnapshot(in context: Context, completion: @escaping (SpeedWidgetEntry) -> Void) {
    let entry = fetchSpeeds()
    completion(entry)
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<SpeedWidgetEntry>) -> Void)
  {
    let entry = fetchSpeeds()
    let timeline = Timeline(entries: [entry], policy: .never)
    completion(timeline)
  }

  private func fetchSpeeds() -> SpeedWidgetEntry {
    let userDefaults = UserDefaults(suiteName: suiteName)
    let speeds =
      userDefaults?.dictionary(forKey: "SpeedWidget") as? [String: Double] ?? [
        "downloadSpeed": 0.0, "uploadSpeed": 0.0,
      ]
    return SpeedWidgetEntry(date: Date(), speeds: speeds)
  }
}

// MARK: - Widget Configuration

struct SpeedWidgetView: View {
  let entry: SpeedWidgetEntry

  @Environment(\.widgetFamily) private var family

  var body: some View {
    switch family {
    case .systemSmall:
      SpeedWidgetEntryView(entry: entry)
        .padding(22)
        .background(Color("uibackground"))
    case .accessoryCircular:
      SpeedLockScreenWidgetEntryView(entry: entry)
    default:
      EmptyView()
    }
  }
}

struct SpeedWidget: Widget {
  let kind: String = "SpeedWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: SpeedWidgetProvider()) { entry in
      if #available(iOS 17.0, *) {
        SpeedWidgetView(entry: entry)
          .containerBackground(.fill.tertiary, for: .widget)
          .frame(maxWidth: .infinity, maxHeight: .infinity)
      } else {
        SpeedWidgetView(entry: entry)
          .frame(maxWidth: .infinity, maxHeight: .infinity)
      }
    }
    .configurationDisplayName("Speed Widget")
    .description("Shows upload and download speeds.")
    .supportedFamilies(supportedFamilies())
    .contentMarginsDisabled()
  }

  @ViewBuilder
  private func supportedFamilies() -> [WidgetFamily] {
    if #available(iOS 16.0, *) {
      return [.systemSmall, .accessoryCircular]
    } else {
      return [.systemMedium]
    }
  }
}
