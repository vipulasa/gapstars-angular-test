
/**
 * Defines the priority levels that can be assigned.
 *
 * This type represents a set of predefined string values to indicate
 * the priority of an entity or task. The allowed values are:
 * - 'Low': Represents a low level of priority.
 * - 'Medium': Represents a medium level of priority.
 * - 'High': Represents a high level of priority.
 */
export type Priority = 'Low' | 'Medium' | 'High';


/**
 * Represents the recurrence pattern for an event or action.
 *
 * Possible values:
 * - 'None': Indicates no recurrence.
 * - 'Daily': Indicates the event or action recurs daily.
 * - 'Weekly': Indicates the event or action recurs weekly.
 * - 'Monthly': Indicates the event or action recurs monthly.
 */
export type Recurrence = 'None' | 'Daily' | 'Weekly' | 'Monthly';

/**
 * Represents a to-do item in a task management system.
 *
 * @interface Todo
 *
 * @property {number} id - Unique identifier for the to-do item.
 * @property {string} title - Title or description of the to-do item.
 * @property {boolean} done - Status of the to-do item (true if completed; otherwise, false).
 * @property {Priority} priority - Priority level assigned to the to-do item (e.g., low, medium, high).
 * @property {Recurrence} recurrence - Recurrence pattern of the to-do item (e.g., daily, weekly).
 * @property {number[]} dependencies - List of task IDs that must be completed prior to this to-do item.
 */
export interface Todo {
  id: number;
  title: string;
  done: boolean;
  priority: Priority;
  recurrence: Recurrence;
  dependencies: number[];
}
