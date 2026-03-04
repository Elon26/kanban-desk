import Foundation

// Sample data generator for TaskStatusGroup
class SampleData {
  // Generate a complete sample data set
  static func generateSampleTaskStatusGroups() -> [TaskStatusGroup] {
    // Create task statuses
    let todoStatus = TaskStatus(id: "status-1", name: "To Do", color: "#E0E0E0")
    let inProgressStatus = TaskStatus(id: "status-2", name: "In Progress", color: "#64B5F6")
    let reviewStatus = TaskStatus(id: "status-3", name: "In Review", color: "#FFD54F")
    let doneStatus = TaskStatus(id: "status-4", name: "Done", color: "#81C784")

    // Create task priorities
    let highPriority = TaskPriority(
      id: "priority-1", name: "High", color: "#FF5252")
    let mediumPriority = TaskPriority(
      id: "priority-2", name: "Medium", color: "#FFA726")
    let lowPriority = TaskPriority(
      id: "priority-3", name: "Low", color: "#66BB6A")

    // Create task tags
    let workTag = TaskTag(id: "tag-1", name: "Work", color: "#5C6BC0")
    let personalTag = TaskTag(id: "tag-2", name: "Personal", color: "#EC407A")
    let learningTag = TaskTag(id: "tag-3", name: "Learning", color: "#26A69A")
    let urgentTag = TaskTag(id: "tag-4", name: "Urgent", color: "#EF5350")

    // Helper to create dates
    let calendar = Calendar.current
    let now = Date()

    // Tasks for "To Do"
    let todoTasks = [
      Task(
        id: "task-1",
        name: "Research new framework",
        priority: lowPriority,
        tag: learningTag,
        startTime: calendar.date(byAdding: .day, value: 1, to: now),
        endTime: calendar.date(byAdding: .day, value: 3, to: now),
        description:
          "Explore React Native capabilities for our next project. Focus on performance and ease of integration. Consider alternatives like Flutter and Xamarin.",
        updatedAt: now,
        attachments: nil
      ),
      Task(
        id: "task-2",
        name: "Plan Q3 roadmap",
        priority: nil,
        tag: workTag,
        startTime: calendar.date(byAdding: .day, value: 2, to: now),
        endTime: calendar.date(byAdding: .day, value: 2, to: now),
        description: "Define key deliverables and milestones for Q3.",
        updatedAt: calendar.date(byAdding: .hour, value: -3, to: now),
        attachments: [
          TaskAttachment(
            id: "att-1", name: "Q2 Review.pdf", url: "https://example.com/docs/q2-review.pdf"),
          TaskAttachment(
            id: "att-5", name: "Q3 Planning Template.xlsx",
            url: "https://example.com/docs/q3-planning-template.xlsx"),
          TaskAttachment(
            id: "att-6", name: "Stakeholder Feedback.docx",
            url: "https://example.com/docs/stakeholder-feedback.docx"),
        ]
      ),
      Task(
        id: "task-8",
        name: "Organize team retreat",
        priority: mediumPriority,
        tag: personalTag,
        startTime: calendar.date(byAdding: .day, value: 3, to: now),
        endTime: calendar.date(byAdding: .day, value: 5, to: now),
        description: "Plan activities and logistics for the annual team retreat.",
        updatedAt: calendar.date(byAdding: .hour, value: -4, to: now),
        attachments: nil
      ),
      Task(
        id: "task-9",
        name: "Update project documentation",
        priority: lowPriority,
        tag: workTag,
        startTime: calendar.date(byAdding: .day, value: 4, to: now),
        endTime: calendar.date(byAdding: .day, value: 6, to: now),
        description: "Revise API docs and user guides based on recent changes.",
        updatedAt: calendar.date(byAdding: .hour, value: -5, to: now),
        attachments: nil
      ),
      Task(
        id: "task-10",
        name: "Prepare for client presentation",
        priority: highPriority,
        tag: urgentTag,
        startTime: calendar.date(byAdding: .day, value: 0, to: now),
        endTime: calendar.date(byAdding: .day, value: 1, to: now),
        description: "Create slides and demo for the upcoming client meeting.",
        updatedAt: calendar.date(byAdding: .hour, value: -1, to: now),
        attachments: nil
      ),
    ]

    // Tasks for "In Progress"
    let inProgressTasks = [
      Task(
        id: "task-3",
        name: "Implement user authentication",
        priority: highPriority,
        tag: nil,
        startTime: calendar.date(byAdding: .day, value: -1, to: now),
        endTime: calendar.date(byAdding: .day, value: 1, to: now),
        description: "Add OAuth2 support and JWT token handling.",
        updatedAt: calendar.date(byAdding: .hour, value: -2, to: now),
        attachments: [
          TaskAttachment(
            id: "att-2", name: "Auth Flow Diagram.png",
            url: "https://example.com/diagrams/auth-flow.png")
        ]
      ),
      Task(
        id: "task-4",
        name: "Design new dashboard",
        priority: mediumPriority,
        tag: workTag,
        startTime: calendar.date(byAdding: .day, value: -2, to: now),
        endTime: calendar.date(byAdding: .day, value: 2, to: now),
        description: "Create wireframes and mockups for the analytics dashboard.",
        updatedAt: calendar.date(byAdding: .minute, value: -30, to: now),
        attachments: nil
      ),
    ]

    // Tasks for "In Review"
    let reviewTasks = [
      Task(
        id: "task-5",
        name: "Code review PR #42",
        priority: mediumPriority,
        tag: workTag,
        startTime: calendar.date(byAdding: .day, value: -1, to: now),
        endTime: now,
        description: "Review API integration changes in PR #42.",
        updatedAt: calendar.date(byAdding: .hour, value: -1, to: now),
        attachments: nil
      )
    ]

    // Tasks for "Done"
    let doneTasks = [
      Task(
        id: "task-6",
        name: "Set up CI/CD pipeline",
        priority: highPriority,
        tag: workTag,
        startTime: calendar.date(byAdding: .day, value: -5, to: now),
        endTime: calendar.date(byAdding: .day, value: -1, to: now),
        description: "Configure GitHub Actions for automated testing and deployment.",
        updatedAt: calendar.date(byAdding: .day, value: -1, to: now),
        attachments: [
          TaskAttachment(
            id: "att-3", name: "CI/CD Documentation.md",
            url: "https://example.com/docs/cicd-setup.md")
        ]
      ),
      Task(
        id: "task-7",
        name: "Weekly team meeting",
        priority: mediumPriority,
        tag: personalTag,
        startTime: calendar.date(byAdding: .day, value: -2, to: now),
        endTime: calendar.date(byAdding: .day, value: -2, to: now),
        description: "Discuss project progress and blockers.",
        updatedAt: calendar.date(byAdding: .day, value: -2, to: now),
        attachments: [
          TaskAttachment(
            id: "att-4", name: "Meeting Notes.txt",
            url: "https://example.com/notes/meeting-7-22.txt")
        ]
      ),
    ]

    // Create TaskStatusGroups
    return [
      TaskStatusGroup(status: todoStatus, tasks: todoTasks),
      TaskStatusGroup(status: inProgressStatus, tasks: inProgressTasks),
      TaskStatusGroup(status: reviewStatus, tasks: reviewTasks),
      TaskStatusGroup(status: doneStatus, tasks: doneTasks),
    ]
  }
}
