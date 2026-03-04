import Foundation
import SwiftUI
import WidgetKit

// MARK: - Widget Entry Data Model

struct CalendarWidgetEntry: TimelineEntry {
    let date: Date
    let tasks: [TaskData]
}

struct TaskData {
    let id: String
    let name: String
    let priority: String
    let tagId: String
    let statusId: String
    let startTime: Date?
    let endTime: Date?
    let description: String
    let updatedAt: Date?
    let statusColor: String
}

let sampleCalendarWidgetEntry = CalendarWidgetEntry(
    date: Date(),
    tasks: [
        TaskData(
            id: "1",
            name: "Complete project proposal",
            priority: "high",
            tagId: "work",
            statusId: "in-progress",
            startTime: Date(),
            endTime: Date().addingTimeInterval(3600),
            description: "Finalize the Q1 project proposal",
            updatedAt: Date(),
            statusColor: "#dddddd"
        ),
        TaskData(
            id: "2",
            name: "Team meeting",
            priority: "medium",
            tagId: "work",
            statusId: "pending",
            startTime: Date().addingTimeInterval(7200),
            endTime: Date().addingTimeInterval(10800),
            description: "Weekly sync with the team",
            updatedAt: Date(),
            statusColor: "#dddddd"
        ),
    ]
)

// MARK: - Provider

struct CalendarWidgetProvider: TimelineProvider {
    func placeholder(in context: Context) -> CalendarWidgetEntry {
        sampleCalendarWidgetEntry
    }

    func getSnapshot(in context: Context, completion: @escaping (CalendarWidgetEntry) -> Void) {
        let entry = fetchCalendarData()
        completion(entry)
    }

    func getTimeline(
        in context: Context, completion: @escaping (Timeline<CalendarWidgetEntry>) -> Void
    ) {
        let entry = fetchCalendarData()
        // Update timeline every hour
        let nextUpdate = Date().addingTimeInterval(3600)
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }

    private func fetchCalendarData() -> CalendarWidgetEntry {
        let userDefaults = UserDefaults(suiteName: suiteName)

        // Retrieve the dictionary for key "CalendarWidget"
        let calendarWidgetDict =
            userDefaults?.dictionary(forKey: "CalendarWidget") as? [String: Any] ?? [:]

        // Parse tasks array
        let tasksArray = calendarWidgetDict["tasks"] as? [[String: Any]] ?? []

        let dateFormatter = ISO8601DateFormatter()
        dateFormatter.formatOptions = [.withFractionalSeconds, .withInternetDateTime]
        let calendar = Calendar.current
        let today = Date()

        let tasks = tasksArray.compactMap { taskDict -> TaskData? in
            guard let id = taskDict["id"] as? String,
                let name = taskDict["name"] as? String
            else {
                return nil
            }

            let startTime: Date? = {
                if let startTimeString = taskDict["startTime"] as? String,
                    !startTimeString.isEmpty
                {
                    return dateFormatter.date(from: startTimeString)
                }
                return nil
            }()

            let endTime: Date? = {
                if let endTimeString = taskDict["endTime"] as? String,
                    !endTimeString.isEmpty
                {
                    return dateFormatter.date(from: endTimeString)
                }
                return nil
            }()

            let updatedAt: Date? = {
                if let updatedAtString = taskDict["updatedAt"] as? String,
                    !updatedAtString.isEmpty
                {
                    return dateFormatter.date(from: updatedAtString)
                }
                return nil
            }()

            return TaskData(
                id: id,
                name: name,
                priority: taskDict["priority"] as? String ?? "",
                tagId: taskDict["tagId"] as? String ?? "",
                statusId: taskDict["statusId"] as? String ?? "",
                startTime: startTime,
                endTime: endTime,
                description: taskDict["description"] as? String ?? "",
                updatedAt: updatedAt,
                statusColor: taskDict["statusColor"] as? String ?? "#dddddd"
            )
        }

        // Filter tasks for today
        let todayTasks = tasks.filter { task in
            if let startTime = task.startTime, let endTime = task.endTime,
                let endTimePlusOneDay = calendar.date(byAdding: .day, value: 1, to: endTime)
            {
                let today = Date()
                return today >= calendar.startOfDay(for: startTime)
                    && today < calendar.startOfDay(for: endTimePlusOneDay)
            }
            return false
        }
        .sorted { task1, task2 in
            // Sort by start time
            if let time1 = task1.startTime, let time2 = task2.startTime {
                return time1 < time2
            }
            return false
        }
        .prefix(2)
        return CalendarWidgetEntry(
            date: today,
            tasks: Array(todayTasks)
        )
    }
}

// MARK: - Widget View

struct CalendarWidgetLarge: View {
    var entry: CalendarWidgetEntry

    var dateFormatterDate: DateFormatter {
        let formatter = DateFormatter()
        formatter.dateFormat = "dd"
        return formatter
    }

    var dateFormatterMonthYear: DateFormatter {
        let formatter = DateFormatter()
        formatter.dateFormat = "MMMM yyyy"
        return formatter
    }

    var dateFormatterMonthYearShort: DateFormatter {
        let formatter = DateFormatter()
        formatter.dateFormat = "MMM yyyy"
        return formatter
    }

    var timeFormatter: DateFormatter {
        let formatter = DateFormatter()
        formatter.dateFormat = "MMMM dd, h:mm a"
        formatter.amSymbol = "a.m."
        formatter.pmSymbol = "p.m."
        return formatter
    }

    var calendar: Calendar {
        Calendar.current
    }

    var today: Date {
        calendar.startOfDay(for: Date())
    }
    var visibleDates: [Date] {
        var dates = [Date]()
        let components = calendar.dateComponents([.year, .month], from: today)
        guard let firstOfMonth = calendar.date(from: components) else { return [] }
        var daysBack = calendar.component(.weekday, from: firstOfMonth) - 2
        if daysBack < 0 { daysBack += 7 }
        guard let first = calendar.date(byAdding: .day, value: -daysBack, to: firstOfMonth) else {
            return []
        }

        var date = first
        for _ in 0..<42 {
            dates.append(date)
            date = calendar.date(byAdding: .day, value: 1, to: date)!
        }

        return dates
    }

    var weekdaySymbols: [String] {
        let symbols = calendar.shortWeekdaySymbols
        return Array(symbols[1...]) + [symbols[0]]
    }

    var body: some View {
        VStack(spacing: 16) {
            Spacer()
            HStack(alignment: .center, spacing: 12) {
                VStack(alignment: .center, spacing: 10) {
                    Text(dateFormatterDate.string(from: today))
                        .font(.system(size: 70, weight: .bold))
                        .foregroundColor(Color("uitext"))
                        .frame(height: 50)
                    Text(dateFormatterMonthYear.string(from: today))
                        .font(.system(size: 12))
                        .foregroundColor(Color("uitext"))
                }.frame(width: 100)
                VStack(alignment: .center, spacing: 0) {
                    if entry.tasks.isEmpty {
                        Spacer()
                        HStack {
                            Spacer()
                            VStack(spacing: 8) {
                                Image(systemName: "checkmark.circle")
                                    .font(.system(size: 32))
                                    .foregroundColor(Color("uistatus-done"))
                                Text("No tasks for today")
                                    .font(.system(size: 14))
                                    .foregroundColor(Color("uitext-medium"))
                            }
                            Spacer()
                        }
                        Spacer()
                    } else {
                        VStack(alignment: .leading) {
                            ForEach(Array(entry.tasks.prefix(2).enumerated()), id: \.element.id) {
                                index, task in
                                TaskRowView(task: task, timeFormatter: timeFormatter)
                                if index < entry.tasks.count - 1 {
                                    Spacer()
                                }
                            }
                        }
                    }
                }.frame(maxWidth: .infinity)
            }
            .frame(height: 96)
            VStack {
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 7)) {
                    ForEach(weekdaySymbols, id: \.self) { weekday in
                        Text(weekday)
                            .font(.system(size: 12))
                            .foregroundColor(Color("uitext-light"))
                    }
                }
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 7)) {
                    ForEach(visibleDates, id: \.self) { date in
                        Text(dateFormatterDate.string(from: date))
                            .font(.system(size: 12))
                            .foregroundColor(
                                today == date ? Color("uiwhite") : Color("uitext")
                            )
                            .frame(width: 24, height: 24)
                            .background(
                                today == date ? Color("uiblue") : .clear
                            )
                            .cornerRadius(12)
                            .opacity(
                                calendar.component(.month, from: today)
                                    == calendar.component(.month, from: date)
                                    ? 1 : 0.5)

                    }
                }
            }.frame(maxHeight: .infinity)
            Spacer()
        }
    }
}

struct TaskRowView: View {
    let task: TaskData
    let timeFormatter: DateFormatter

    var body: some View {
        HStack(alignment: .top, spacing: 10) {
            // Priority indicator
            Circle()
                .fill(Color(hex: task.statusColor))
                .frame(width: 11, height: 11)
                .padding(.top, 5)

            VStack(alignment: .leading, spacing: 7) {
                Text(task.name)
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(Color("uitext"))
                    .lineLimit(1)
                    .frame(height: 21)

                if let endTime = task.endTime {
                    Text(timeFormatter.string(from: endTime))
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: task.statusColor))
                }
            }
        }
    }
}

struct CalendarWidgetSmall: View {
    var entry: CalendarWidgetEntry

    var body: some View {
        VStack {
            HStack(alignment: .center) {
                Image("task").resizable().frame(width: 30, height: 30, alignment: .center)
                Text("Task Manager").font(.system(size: 14, weight: .medium)).foregroundColor(
                    Color("uiwhite")
                )
                .lineLimit(1)
                .padding(.trailing, 3)
                Spacer()
                Image(systemName: "chevron.right")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .foregroundColor(Color("uiwhite"))
                    .frame(width: 8, height: 10)
            }
            Spacer()
            HStack(spacing: 12) {
                ForEach(Array(entry.tasks.prefix(2).enumerated()), id: \.element.id) {
                    index, task in

                    SmallWidgetTask(task: task)
                        .fixedSize()
                        .clipped()
                        .opacity(index == 0 ? 1 : 0.25)
                }
            }
            .frame(maxWidth: 140, alignment: .leading)

            Spacer()
            HStack(alignment: .center) {
                Spacer()
                Text("Add new").font(.system(size: 14))
                    .foregroundColor(Color("uiwhite"))
                Spacer()
            }
            .frame(height: 30)
            .background(Color("uiwhite").opacity(0.17))
            .cornerRadius(15)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(7)
        .background(Color("uiblue"))
        .cornerRadius(22)
    }
}

struct SmallWidgetTask: View {
    var task: TaskData

    var formatter: DateFormatter {
        let formatter = DateFormatter()
        formatter.dateFormat = "MM.dd, h:mm a"
        formatter.amSymbol = "a.m."
        formatter.pmSymbol = "p.m."

        return formatter
    }

    var body: some View {
        HStack(spacing: 10) {
            Rectangle()
                .fill(Color("uiwhite"))
                .frame(width: 3, height: 24)
                .cornerRadius(2)
            VStack(alignment: .leading, spacing: 3) {
                Text(task.name)
                    .font(.system(size: 14))
                    .foregroundColor(Color("uiwhite"))
                    .lineLimit(1)
                if let endTime = task.endTime {
                    Text(formatter.string(from: endTime))
                        .font(.system(size: 12))
                        .foregroundColor(Color("uiwhite").opacity(0.5))
                        .lineLimit(1)
                }
            }
        }
    }
}

// MARK: - Widget Configuration

struct CalendarWidgetView: View {
    let entry: CalendarWidgetEntry

    @Environment(\.widgetFamily) private var family

    var body: some View {
        switch family {
        case .systemSmall:
            CalendarWidgetSmall(entry: entry)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .padding(2)
                .background(Color("uibackground"))
        case .systemLarge:
            CalendarWidgetLarge(entry: entry)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                // .padding(.vertical, 35)
                .padding(.horizontal, 18)
                .background(Color("uibackground"))
        default:
            CalendarWidgetLarge(entry: entry)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .padding(.horizontal, 18)
                .background(Color("uibackground"))
        }
    }
}

struct CalendarWidget: Widget {
    let kind: String = "CalendarWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: CalendarWidgetProvider()) { entry in
            if #available(iOS 17.0, *) {
                CalendarWidgetView(entry: entry)
                    .containerBackground(.fill.tertiary, for: .widget)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                CalendarWidgetView(entry: entry)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
        .configurationDisplayName("Today's Tasks")
        .description("Shows today's date and upcoming tasks.")
        .contentMarginsDisabled()
        .supportedFamilies(supportedFamilies())
    }

    // Function to return the supported families based on iOS version
    private func supportedFamilies() -> [WidgetFamily] {
        return [.systemSmall, .systemLarge]
    }
}

// MARK: - Previews

struct CalendarWidget_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            CalendarWidgetView(entry: sampleCalendarWidgetEntry)
                .previewContext(WidgetPreviewContext(family: .systemSmall))
                .previewDisplayName("Small")

            CalendarWidgetView(entry: sampleCalendarWidgetEntry)
                .previewContext(WidgetPreviewContext(family: .systemLarge))
                .previewDisplayName("Large")

            CalendarWidgetView(entry: CalendarWidgetEntry(date: Date(), tasks: []))
                .previewContext(WidgetPreviewContext(family: .systemSmall))
                .previewDisplayName("Small - No Tasks")
        }
    }
}
