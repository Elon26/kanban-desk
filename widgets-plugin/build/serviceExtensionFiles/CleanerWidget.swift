import Foundation
import SwiftUI
import WidgetKit

// MARK: - Widget Entry Data Model

struct CleanerWidgetEntry: TimelineEntry {
  let date: Date
  let storageInfoTotal: Double
  let storageInfoOccupied: Double
  let blurryPhotos: Int
  let screenshots: Int
  let duplicateNumbers: Int
  let similarPhotos: Int
  let screenshotsSize: Double
  let blurryPhotosSize: Double
  let similarPhotosSize: Double
  let duplicateNumbersSize: Double
}

let sampleCleanerWidgetEntry = CleanerWidgetEntry(
  date: Date(),
  storageInfoTotal: 64e9,
  storageInfoOccupied: 48e9,
  blurryPhotos: 19,
  screenshots: 54,
  duplicateNumbers: 7,
  similarPhotos: 235,
  screenshotsSize: 197,
  blurryPhotosSize: 193,
  similarPhotosSize: 120,
  duplicateNumbersSize: 53
)

// MARK: - Provider (without Timeline)

struct CleanerWidgetProvider: TimelineProvider {
  func placeholder(in context: Context) -> CleanerWidgetEntry {
    sampleCleanerWidgetEntry
  }

  func getSnapshot(in context: Context, completion: @escaping (CleanerWidgetEntry) -> Void) {
    // let entry = sampleCleanerWidgetEntry
    let entry = fetchCleanerData()
    completion(entry)
  }

  func getTimeline(
    in context: Context, completion: @escaping (Timeline<CleanerWidgetEntry>) -> Void
  ) {
    // let entry = sampleCleanerWidgetEntry
    let entry = fetchCleanerData()
    let timeline = Timeline(entries: [entry], policy: .never)
    completion(timeline)
  }

  private func fetchCleanerData() -> CleanerWidgetEntry {
    // return sampleCleanerWidgetEntry
    let userDefaults = UserDefaults(suiteName: suiteName)

    // Retrieve the dictionary for key "CleanerWidget"
    let cleanerWidgetDict =
      userDefaults?.dictionary(forKey: "CleanerWidget") as? [String: Any] ?? [:]

    let storageInfoTotal = cleanerWidgetDict["storageInfoTotal"] as? Double ?? 0
    let storageInfoOccupied = cleanerWidgetDict["storageInfoOccupied"] as? Double ?? 0
    let blurryPhotos = cleanerWidgetDict["blurryPhotos"] as? Int ?? 0
    let screenshots = cleanerWidgetDict["screenshots"] as? Int ?? 0
    let duplicateNumbers = cleanerWidgetDict["duplicateNumbers"] as? Int ?? 0
    let similarPhotos = cleanerWidgetDict["similarPhotos"] as? Int ?? 0
    let screenshotsSize = cleanerWidgetDict["screenshotsSize"] as? Double ?? 0
    let blurryPhotosSize = cleanerWidgetDict["blurryPhotosSize"] as? Double ?? 0
    let similarPhotosSize = cleanerWidgetDict["similarPhotosSize"] as? Double ?? 0
    let duplicateNumbersSize = cleanerWidgetDict["duplicateNumbersSize"] as? Double ?? 0

    return CleanerWidgetEntry(
      date: Date(),
      storageInfoTotal: storageInfoTotal,
      storageInfoOccupied: storageInfoOccupied,
      blurryPhotos: blurryPhotos,
      screenshots: screenshots,
      duplicateNumbers: duplicateNumbers,
      similarPhotos: similarPhotos,
      screenshotsSize: screenshotsSize,
      blurryPhotosSize: blurryPhotosSize,
      similarPhotosSize: similarPhotosSize,
      duplicateNumbersSize: duplicateNumbersSize
    )
  }
}

// MARK: - Widget View

struct CleanerWidgetEntryView: View {
  var entry: CleanerWidgetEntry

  var totalOccupied: (value: String, unit: String, full: String) {
    prettifyBytes(entry.storageInfoOccupied, decimalPartLength: 1)
  }

  var totalStorage: (value: String, unit: String, full: String) {
    prettifyBytes(entry.storageInfoTotal, decimalPartLength: 0)
  }

  var percentOccupied: Float {
    let occupied = Float(totalOccupied.value) ?? 0
    let total = Float(totalStorage.value) ?? 0
    let percent = occupied / total
    return percent
  }

  var totalItems: Int {
    entry.similarPhotos + entry.screenshots + entry.blurryPhotos + entry.duplicateNumbers
  }

  var progress: (ss: Float, dn: Float, dp: Float, bp: Float) {
    let total =
      entry.screenshots + entry.duplicateNumbers + entry.similarPhotos + entry.blurryPhotos
    let ss = Float(entry.screenshots) / Float(total)
    let dn = Float(entry.duplicateNumbers) / Float(total)
    let dp = Float(entry.similarPhotos) / Float(total)
    let bp = Float(entry.blurryPhotos) / Float(total)
    return (ss, dn, dp, bp)
  }

  var body: some View {
    HStack(spacing: 15) {
      VStack(alignment: .center) {
        ZStack {
          CircleDotsView(progress: percentOccupied)
          VStack(alignment: .center) {
            HStack(alignment: .firstTextBaseline, spacing: 0) {
              Text(String(Int(percentOccupied * 100)))
                .font(.system(size: 24, weight: .semibold))
                .foregroundColor(Color("uitext"))
              Text("%")
                .font(.system(size: 12))
                .foregroundColor(Color("uitext-medium"))
            }
            Text("loaded")
              .font(.system(size: 12))
              .foregroundColor(Color("uitext-medium"))
          }
        }.frame(width: 84, height: 84)
        Spacer()
        VStack(alignment: .center, spacing: 3) {
          Text("Storage Used").font(.system(size: 16, weight: .medium))
          HStack(alignment: .firstTextBaseline, spacing: 3) {
            Text("\(totalOccupied.value) \(totalOccupied.unit)")
              .font(.system(size: 14, weight: .medium))
              .foregroundColor(Color("uitext-medium"))
            Text("of")
              .font(.system(size: 12))
              .foregroundColor(Color("uitext-medium"))
            Text("\(totalStorage.value) \(totalStorage.unit)")
              .font(.system(size: 14, weight: .medium))
              .foregroundColor(Color("uitext-medium"))
          }
        }
      }
      .frame(width: 130)
      VStack(alignment: .leading) {
        ProgressEntry(
          color: Color("uipeach"),
          title: "Screenshots",
          count: entry.screenshots,
          progress: progress.ss)
        Spacer()
        ProgressEntry(
          color: Color("uimint"),
          title: "Duplicate Numbers",
          count: entry.duplicateNumbers,
          progress: progress.dn)
        Spacer()
        ProgressEntry(
          color: Color("uiviolet"),
          title: "Duplicate Photos",
          count: entry.similarPhotos,
          progress: progress.dp)
        Spacer()
        ProgressEntry(
          color: Color("uirose"),
          title: "Blurry Photos",
          count: entry.blurryPhotos,
          progress: progress.bp)
      }
      .frame(maxWidth: .infinity)
    }
  }
}

struct ProgressEntry: View {
  var color: Color
  var title: String
  var count: Int
  var progress: Float

  var body: some View {
    VStack(alignment: .leading, spacing: 3) {
      HStack(alignment: .center, spacing: 3) {
        Circle()
          .frame(width: 7, height: 7)
          .foregroundColor(color)
        Text(title)
          .font(.system(size: 12))
          .foregroundColor(Color("uitext"))
        Text("\(count) files")
          .font(.system(size: 11))
          .foregroundColor(Color("uitext-light"))
        Spacer()
      }
      GeometryReader { geo in
        ZStack(alignment: .leading) {
          RoundedRectangle(cornerRadius: 3.5)
            .fill(Color("progress-bg"))

          RoundedRectangle(cornerRadius: 3.5)
            .fill(color)
            .frame(width: geo.size.width * CGFloat(progress))
        }
      }
      .frame(height: 7)
    }.frame(maxWidth: .infinity)
  }
}

struct CircleDotsView: View {
  var progress: Float

  let dotCount = 20
  let radius: CGFloat = 42
  let dotSize: CGFloat = 4

  var maxHighlightedIndex: Int {
    Int(progress * Float(dotCount))
  }

  var body: some View {
    ZStack {
      ForEach(0..<dotCount, id: \.self) { i in
        let angle = (Double(i) / Double(dotCount)) * 2 * .pi
        let adjustedAngle = angle - .pi / 2
        Circle()
          .fill(i <= maxHighlightedIndex ? Color("uiblue") : Color("uitext-light"))
          .frame(width: dotSize, height: dotSize)
          .offset(
            x: cos(adjustedAngle) * radius,
            y: sin(adjustedAngle) * radius
          )
      }
    }
    .frame(width: radius * 2 + dotSize, height: radius * 2 + dotSize)
  }
}

struct CleanerWidgetEntryView_Previews: PreviewProvider {
  static var previews: some View {
    Group {
      CleanerWidgetView(entry: sampleCleanerWidgetEntry)
        .previewContext(WidgetPreviewContext(family: .systemMedium))

      CleanerWidgetView(entry: sampleCleanerWidgetEntry)
    }
  }
}

// MARK: - Widget Configuration

struct CleanerWidgetView: View {
  let entry: CleanerWidgetEntry

  @Environment(\.widgetFamily) private var family

  var body: some View {
    switch family {
    case .systemMedium:
      CleanerWidgetEntryView(entry: entry)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(15)
        .background(Color("uibackground"))
    case .accessoryRectangular:
      CleanerLockScreenWidgetEntryView(entry: entry)
    default:
      CleanerWidgetEntryView(entry: entry)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
  }
}

struct CleanerWidget: Widget {
  let kind: String = "CleanerWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: CleanerWidgetProvider()) { entry in
      if #available(iOS 17.0, *) {
        CleanerWidgetView(entry: entry)
          .containerBackground(.fill.tertiary, for: .widget)
          .frame(maxWidth: .infinity, maxHeight: .infinity)
      } else {
        CleanerWidgetView(entry: entry)
          .frame(maxWidth: .infinity, maxHeight: .infinity)
      }
    }
    .configurationDisplayName("Smart Cleaner Widget")
    .description("Shows system load and cleanup info.")
    .contentMarginsDisabled()
    .supportedFamilies(supportedFamilies())
  }

  // Function to return the supported families based on iOS version
  @ViewBuilder
  private func supportedFamilies() -> [WidgetFamily] {
    if #available(iOS 16.0, *) {
      return [.systemMedium, .accessoryRectangular]
    } else {
      return [.systemMedium]
    }
  }
}

// MARK: - Lockscreen

struct CleanerLockScreenWidgetEntryView: View {
  var entry: CleanerWidgetEntry

  var body: some View {
    VStack(alignment: .leading, spacing: 5) {
      LockScreenRowView(icon: "screenshot-aod", label: "Screen", value: entry.screenshotsSize)
      LockScreenRowView(icon: "blurry-aod", label: "Blurry", value: entry.blurryPhotosSize)
      LockScreenRowView(icon: "dublicate-aod", label: "Dublic", value: entry.duplicateNumbersSize)
    }
    .padding(.vertical, 5)
    .backgroundModifier()
  }
}

struct LockScreenRowView: View {
  var icon: String
  var label: String
  var value: Double

  var body: some View {
    HStack {
      Image(icon)
        .frame(width: 16, height: 16)
      Text(label)
        .font(.subheadline)
        .fontWeight( /*@START_MENU_TOKEN@*/.bold /*@END_MENU_TOKEN@*/)
        .foregroundColor(.white)
      Spacer()
      Text(prettifyBytes(value, decimalPartLength: 2).full)
        .font(.subheadline)
        .foregroundColor(.white)
    }
  }
}