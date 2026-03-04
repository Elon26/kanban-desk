import type {
  Task,
  TaskPriority,
  TaskStatus,
  TaskStatusGroup,
  TaskTag,
} from '@/modules/draggable-collection';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class SampleData {
  /**
   * Generate a complete sample data set
   */
  static generateSampleTaskStatusGroups(): TaskStatusGroup[] {
    // Create task statuses
    const todoStatus: TaskStatus = {
      id: 'status-1',
      name: 'To Do',
      color: '#E0E0E0',
    };

    const inProgressStatus: TaskStatus = {
      id: 'status-2',
      name: 'In Progress',
      color: '#64B5F6',
    };

    const reviewStatus: TaskStatus = {
      id: 'status-3',
      name: 'In Review',
      color: '#FFD54F',
    };

    const doneStatus: TaskStatus = {
      id: 'status-4',
      name: 'Done',
      color: '#81C784',
    };

    // Create task priorities
    const highPriority: TaskPriority = {
      id: 'priority-1',
      name: 'High',
      color: '#FF5252',
    };

    const mediumPriority: TaskPriority = {
      id: 'priority-2',
      name: 'Medium',
      color: '#FFA726',
    };

    const lowPriority: TaskPriority = {
      id: 'priority-3',
      name: 'Low',
      color: '#66BB6A',
    };

    // Create task tags
    const workTag: TaskTag = {
      id: 'tag-1',
      name: 'Work',
      color: '#5C6BC0',
    };

    const personalTag: TaskTag = {
      id: 'tag-2',
      name: 'Personal',
      color: '#EC407A',
    };

    const learningTag: TaskTag = {
      id: 'tag-3',
      name: 'Learning',
      color: '#26A69A',
    };

    const urgentTag: TaskTag = {
      id: 'tag-4',
      name: 'Urgent',
      color: '#EF5350',
    };

    // Helper to create dates
    const now = new Date();

    // Helper function to add days to date and return ISO string
    const addDays = (date: Date, days: number): string => {
      const result = new Date(date);
      result.setDate(date.getDate() + days);
      return result.toISOString();
    };

    // Helper function to add hours to date and return ISO string
    const addHours = (date: Date, hours: number): string => {
      const result = new Date(date);
      result.setHours(date.getHours() + hours);
      return result.toISOString();
    };

    // Helper function to add minutes to date and return ISO string
    const addMinutes = (date: Date, minutes: number): string => {
      const result = new Date(date);
      result.setMinutes(date.getMinutes() + minutes);
      return result.toISOString();
    };

    // Tasks for "To Do"
    const todoTasks: Task[] = [
      {
        id: 'task-1',
        name: 'Short',
        priority: lowPriority,
        tag: learningTag,
        startTime: addDays(now, 1),
        endTime: addDays(now, 3),
        description:
          'Explore React Native capabilities for our next project. Focus on performance and ease of integration. Consider alternatives like Flutter and Xamarin.',
        updatedAt: now.toISOString(),
        attachments: [],
      },
      {
        id: 'task-2',
        name: 'Plan Q3 roadmap',
        priority: undefined,
        tag: workTag,
        startTime: addDays(now, 2),
        endTime: addDays(now, 2),
        description: 'Define key deliverables and milestones for Q3.',
        updatedAt: addHours(now, -3),
        attachments: [
          {
            id: 'att-1',
            name: 'Q2 Review.pdf',
            url: 'https://example.com/docs/q2-review.pdf',
          },
          {
            id: 'att-5',
            name: 'Q3 Planning Template.xlsx',
            url: 'https://example.com/docs/q3-planning-template.xlsx',
          },
          {
            id: 'att-6',
            name: 'Stakeholder Feedback.docx',
            url: 'https://example.com/docs/stakeholder-feedback.docx',
          },
        ],
      },
      {
        id: 'task-8',
        name: 'Organize team retreat',
        priority: mediumPriority,
        tag: personalTag,
        startTime: addDays(now, 3),
        endTime: addDays(now, 5),
        description: 'Plan activities and logistics for the annual team retreat.',
        updatedAt: addHours(now, -4),
        attachments: [],
      },
      {
        id: 'task-9',
        name: 'Update project documentation',
        priority: lowPriority,
        tag: workTag,
        startTime: addDays(now, 4),
        endTime: addDays(now, 6),
        description: 'Revise API docs and user guides based on recent changes.',
        updatedAt: addHours(now, -5),
        attachments: [],
      },
      {
        id: 'task-10',
        name: 'Prepare for client presentation',
        priority: highPriority,
        tag: urgentTag,
        startTime: addDays(now, 0),
        endTime: addDays(now, 1),
        description: 'Create slides and demo for the upcoming client meeting.',
        updatedAt: addHours(now, -1),
        attachments: [],
      },
    ];

    // Tasks for "In Progress"
    const inProgressTasks: Task[] = [
      {
        id: 'task-3',
        name: 'Implement user authentication',
        priority: highPriority,
        tag: undefined,
        startTime: addDays(now, -1),
        endTime: addDays(now, 1),
        description: 'Add OAuth2 support and JWT token handling.',
        updatedAt: addHours(now, -2),
        attachments: [
          {
            id: 'att-2',
            name: 'Auth Flow Diagram.png',
            url: 'https://example.com/diagrams/auth-flow.png',
          },
        ],
      },
      {
        id: 'task-4',
        name: 'Design new dashboard',
        priority: mediumPriority,
        tag: workTag,
        startTime: addDays(now, -2),
        endTime: addDays(now, 2),
        description: 'Create wireframes and mockups for the analytics dashboard.',
        updatedAt: addMinutes(now, -30),
        attachments: [],
      },
    ];

    // Tasks for "In Review"
    const reviewTasks: Task[] = [
      {
        id: 'task-5',
        name: 'Code review PR #42',
        priority: mediumPriority,
        tag: workTag,
        startTime: addDays(now, -1),
        endTime: now.toISOString(),
        description: 'Review API integration changes in PR #42.',
        updatedAt: addHours(now, -1),
        attachments: [],
      },
    ];

    // Tasks for "Done"
    const doneTasks: Task[] = [
      {
        id: 'task-6',
        name: 'Set up CI/CD pipeline',
        priority: highPriority,
        tag: workTag,
        startTime: addDays(now, -5),
        endTime: addDays(now, -1),
        description: 'Configure GitHub Actions for automated testing and deployment.',
        updatedAt: addDays(now, -1),
        attachments: [
          {
            id: 'att-3',
            name: 'CI/CD Documentation.md',
            url: 'https://example.com/docs/cicd-setup.md',
          },
        ],
      },
      {
        id: 'task-7',
        name: 'Weekly team meeting',
        priority: mediumPriority,
        tag: personalTag,
        startTime: addDays(now, -2),
        endTime: addDays(now, -2),
        description: 'Discuss project progress and blockers.',
        updatedAt: addDays(now, -2),
        attachments: [
          {
            id: 'att-4',
            name: 'Meeting Notes.txt',
            url: 'https://example.com/notes/meeting-7-22.txt',
          },
        ],
      },
    ];

    // Create TaskStatusGroups
    return [
      { status: todoStatus, tasks: todoTasks },
      { status: inProgressStatus, tasks: inProgressTasks },
      { status: reviewStatus, tasks: reviewTasks },
      { status: doneStatus, tasks: doneTasks },
    ];
  }
}
