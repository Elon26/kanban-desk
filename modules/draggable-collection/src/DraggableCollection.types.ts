import type { StyleProp, ViewStyle } from 'react-native';

export type OnDataChangeEventPayload = {
  data: TaskStatusGroup[];
};

export type OnItemTapEventPayload = Task;

export type OnItemIndexPathChangePayload = {
  taskId: string;
  sourceCategoryId: string;
  destinationCategoryId: string;
};

export type DraggableCollectionModuleEvents = {
  onDataChange: (event: { nativeEvent: OnDataChangeEventPayload }) => void;
  onItemTap: (event: { nativeEvent: OnItemTapEventPayload }) => void;
  onItemIndexPathChange: (event: { nativeEvent: OnItemIndexPathChangePayload }) => void;
  onAddNewGroupTapped: () => void;
};

export type DraggableCollectionViewProps = {
  data: TaskStatusGroup[];
  onDataChange?: (event: { nativeEvent: OnDataChangeEventPayload }) => void;
  onItemTap?: (event: { nativeEvent: OnItemTapEventPayload }) => void;
  onItemIndexPathChange?: (event: { nativeEvent: OnItemIndexPathChangePayload }) => void;
  onAddNewGroupTapped?: () => void;
  style?: StyleProp<ViewStyle>;
  dictionary?: DraggableCollectionDict;
};

//*************** data ***************//
//
/**
 * Represents an attachment for a task
 */
export type TaskAttachment = {
  /** Unique identifier for the attachment */
  id: string;
  /** Name of the attachment */
  name: string;
  /** URL where the attachment can be accessed */
  url: string;
};

/**
 * Base properties for task-related entities like priority, tag, and status
 */
type TaskProp = {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Color code in hexadecimal format (e.g., "#FFFFFF") */
  color: string;
};

/**
 * Represents a task priority level
 */
export type TaskPriority = TaskProp;

/**
 * Represents a categorization tag for a task
 */
export type TaskTag = TaskProp;

/**
 * Represents the status of a task
 */
export type TaskStatus = TaskProp;

/**
 * Represents a task with its properties and metadata
 */
export type Task = {
  /** Unique identifier for the task */
  id: string;
  /** Name/title of the task */
  name: string;
  /** Priority level of the task */
  priority?: TaskPriority;
  /** Categorization tag */
  tag?: TaskTag;
  /** Start time of the task (ISO 8601 string format) */
  startTime?: string;
  /** End time or deadline of the task (ISO 8601 string format) */
  endTime?: string;
  /** Detailed description of the task */
  description?: string;
  /** Last update timestamp (ISO 8601 string format) */
  updatedAt?: string;
  /** List of files or resources attached to the task */
  attachments?: TaskAttachment[];
};

/**
 * Represents a group of tasks with the same status
 */
export type TaskStatusGroup = {
  /** The status that defines this group */
  status: TaskStatus;
  /** Collection of tasks that have this status */
  tasks: Task[];
};

/**
 * Dictionary for DraggableCollectionView labels with pluralization support.
 *
 * Plural categories:
 * - zero: 0 (special-case, rarely used in English)
 * - one:  1 (singular)
 * - two:  2 (languages with dual forms)
 * - few:  small counts (e.g., 3–4; Slavic languages)
 * - many: larger counts (e.g., 5+; Slavic languages)
 * - other: generic plural (default catch-all)
 *
 * Token replacement:
 * - Use `{{count}}` inside pluralized strings; it will be replaced with the actual number.
 *
 * Fallbacks (if a category is not provided):
 * - zero -> other -> one
 * - two  -> few -> other -> one
 * - few  -> many -> other -> one
 * - many -> few -> other -> one
 * - other -> one
 *
 * Example (English):
 * {
 *   task_one: "{{count}} task",
 *   task_other: "{{count}} tasks",
 *   new_group: "New group",
 *   create_new_group: "Create new group",
 *   updated: "Updated"
 * }
 */
export type DraggableCollectionDict = {
  /**
   * Used for a count of exactly 0.
   * Example: "No tasks" or "{{count}} tasks"
   * Note: In English, you can omit this to use `task_other` for zero.
   */
  task_zero?: string;

  /**
   * Singular form; used for a count of exactly 1.
   * Example: "{{count}} task" or "1 task"
   */
  task_one: string;

  /**
   * Dual form; used for a count of exactly 2 in languages that require it.
   * Example (language-dependent): "{{count}} tasks"
   * Note: For English, usually omit and rely on `task_other`.
   */
  task_two?: string;

  /**
   * Few form; used for small counts (e.g., 3–4) in some languages.
   * Example (language-dependent): "{{count}} tasks"
   */
  task_few?: string;

  /**
   * Many form; used for larger counts (e.g., 5+) in some languages.
   * Example (language-dependent): "{{count}} tasks"
   */
  task_many?: string;

  /**
   * Generic plural; used as the default for counts other than 1.
   * Example: "{{count}} tasks"
   * Note: If not provided, code will fall back to `task_one`.
   */
  task_other?: string;

  new_group: string;
  create_new_group: string;
  updated: string;

  /**
   * Locale identifier for date formatter.
   * Example: "en_US" for English (United States)
   */
  locale_identifier: string;
};
