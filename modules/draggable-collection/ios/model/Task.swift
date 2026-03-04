import Foundation

protocol TaskPropDecodable {
  var id: String { get }
  var name: String { get }
  var color: String { get }

  init(id: String, name: String, color: String)

  static func fromJSON(_ json: [String: Any]) -> Self?
}

extension TaskPropDecodable {
  static func fromJSON(_ json: [String: Any]) -> Self? {
    let id = json["id"] as? String ?? UUID().uuidString
    let name = json["name"] as? String ?? ""
    let color = json["color"] as? String ?? "#FFFFFF"
    return Self(id: id, name: name, color: color)
  }
}

struct Task: Codable {
  let id: String
  let name: String
  let priority: TaskPriority?
  let tag: TaskTag?
  // let status: TaskStatus?
  let startTime: Date?
  let endTime: Date?
  let description: String?
  let updatedAt: Date?
  let attachments: [TaskAttachment]?

  static func fromJSON(_ json: [String: Any]) -> Task? {
    let formatter = ISO8601DateFormatter()
    formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]

    let id = json["id"] as? String ?? UUID().uuidString
    let name = json["name"] as? String ?? ""
    let priorityDict = json["priority"] as? [String: Any]
    let priority = priorityDict.flatMap { TaskPriority.fromJSON($0) }
    let tagDict = json["tag"] as? [String: Any]
    let tag = tagDict.flatMap { TaskTag.fromJSON($0) }
    let startTime = (json["startTime"] as? String).flatMap { formatter.date(from: $0) }
    let endTime = (json["endTime"] as? String).flatMap { formatter.date(from: $0) }
    let description = json["description"] as? String
    let updatedAt = (json["updatedAt"] as? String).flatMap { formatter.date(from: $0) }
    let attachmentsArray = json["attachments"] as? [[String: Any]] ?? []
    let attachments = attachmentsArray.compactMap { TaskAttachment.fromJSON($0) }
    return Task(
      id: id,
      name: name,
      priority: priority,
      tag: tag,
      startTime: startTime,
      endTime: endTime,
      description: description,
      updatedAt: updatedAt,
      attachments: attachments
    )
  }

  func toJSON() -> [String: Any]? {
    do {
      let encoder = JSONEncoder()
      encoder.dateEncodingStrategy = .iso8601
      let data = try encoder.encode(self)
      if let jsonObject = try JSONSerialization.jsonObject(with: data, options: [])
        as? [String: Any]
      {
        return jsonObject
      } else {
        return nil
      }
    } catch {
      return nil
    }
  }

}

struct TaskTag: Codable, TaskPropDecodable {
  let id: String
  let name: String
  let color: String
}

struct TaskPriority: Codable, TaskPropDecodable {
  let id: String
  let name: String
  let color: String
}

struct TaskStatus: Codable, TaskPropDecodable {
  let id: String
  let name: String
  let color: String
}

struct TaskAttachment: Codable {
  let id: String
  let name: String
  let url: String

  static func fromJSON(_ json: [String: Any]) -> TaskAttachment? {
    let id = json["id"] as? String ?? UUID().uuidString
    let name = json["name"] as? String ?? ""
    let url = json["url"] as? String ?? ""
    return TaskAttachment(id: id, name: name, url: url)
  }

}

struct TaskStatusGroup: Codable {
  let status: TaskStatus
  var tasks: [Task]

  static func fromJSON(_ json: [String: Any]) -> TaskStatusGroup? {
    guard let statusDict = json["status"] as? [String: Any],
      let status = TaskStatus.fromJSON(statusDict),
      let tasksArray = json["tasks"] as? [[String: Any]]
    else {
      return nil
    }

    let tasks = tasksArray.compactMap { Task.fromJSON($0) }
    return TaskStatusGroup(status: status, tasks: tasks)
  }

  func toJSON() -> [String: Any]? {
    do {
      let encoder = JSONEncoder()
      encoder.dateEncodingStrategy = .iso8601
      let data = try encoder.encode(self)
      if let jsonObject = try JSONSerialization.jsonObject(with: data, options: [])
        as? [String: Any]
      {
        return jsonObject
      } else {
        return nil
      }
    } catch {
      return nil
    }
  }

}
