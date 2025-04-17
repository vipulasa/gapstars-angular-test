import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {TodoModel} from '../models/todo.model';

// storage key defined to store the todos in local storage
const STORAGE_KEY = 'gapstars_app_todos';

/**
 * The TodoService provides functionality to manage a list of Todo items.
 * It maintains the state of Todo items and exposes reactive streams for external components to subscribe to updates.
 * Provides methods to add, delete, update, and retrieve Todo items, while ensuring state updates are reflected to subscribers.
 */
@Injectable({
  providedIn: 'root'
})
export class TodoService {

  /**
   * Represents a collection of todo items.
   * Each item in the collection is an instance of the TodoModel, which defines the structure
   * and properties of an individual todo.
   *
   * This array is initialized as empty and its used to store and manage a list
   * of tasks or todo items for an application.
   */
  private todos: TodoModel[] = [];

  /**
   * A BehaviorSubject that holds and emits the current list of todo items.
   *
   * The initial value is an empty array, which represents no todos.
   * It is used to manage and observe the state of a collection of TodoModel objects.
   * Changes to the list of todos can be emitted through this subject, allowing
   * subscribers to stay updated with the latest states.
   *
   * @type {BehaviorSubject<TodoModel[]>}
   */
  private todoSubject = new BehaviorSubject<TodoModel[]>([]);

  /**
   * An observable stream of todo items that can be subscribed to.
   *
   * This property exposes the BehaviorSubject as an observable, allowing
   * external components or services to subscribe to changes in the list of todos.
   *
   * @type {BehaviorSubject<TodoModel[]>}
   */
  todos$ = this.todoSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Determines whether the runtime environment is a web browser.
   * Checks for the presence of specific browser-related global objects such as `window` and `localStorage`.
   *
   * This is added to prevent errors from firing in non-browser environments (Angular SSR)
   *
   * @return {boolean} True if the environment is a browser, otherwise false.
   */
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  /**
   * Loads the todo list data from localStorage if available.
   * If no data is found or parsing fails, initializes with default sample data.
   * If executed in a non-browser environment, logs a warning and exits without doing anything.
   *
   * @return {void}
   */
  private loadFromStorage(): void {

    if (!this.isBrowser()) {
      console.warn('LocalStorage not available in this environment.');
      return;
    }


    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        this.todos = JSON.parse(saved) as TodoModel[];
      } catch (e) {
        console.error('Failed to parse stored todos:', e);
        this.todos = [];
      }
    } else {
      // Add initial sample data in order to test the application
      this.todos = [
        {
          id: Date.now(),
          title: 'Sample Todo Undone',
          done: false,
          priority: 'Low',
          recurrence: 'None',
          dependencies: []
        },
        {
          id: Date.now() + 1,
          title: 'Sample Todo Done',
          done: true,
          priority: 'High',
          recurrence: 'None',
          dependencies: []
        }
      ];
    }

    this.updateSubject();
  }

  /**
   * Updates the state of the subject with the current list of todos.
   * The method emits a new value to all subscribers by creating a new array
   * from the current todos.
   *
   * @return {void}
   */
  private updateSubject() {
    this.todoSubject.next([...this.todos]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos));
  }

  /**
   * Adds a new todo item to the list and updates the subject.
   *
   * @param {TodoModel} todo - The todo item to be added.
   * @return {void}
   */
  add(todo: TodoModel) {
    this.todos.push(todo);
    this.updateSubject();
  }

  /**
   * Deletes a todo item from the list based on the provided id.
   *
   * @param {number} id - The unique identifier of the todo item to be deleted.
   * @return {void}
   */
  delete(id: number) {
    this.todos = this.todos.filter(t => t.id !== id);
    this.updateSubject();
  }

  /**
   * Updates an existing Todo item in the list with the updated values.
   *
   * @param {TodoModel} updated - The Todo item with updated values.
   *                               It must have a valid id that matches an existing item.
   * @return {void}
   */
  update(updated: TodoModel) {
    this.todos = this.todos.map(t => (t.id === updated.id ? updated : t));
    this.updateSubject();
  }

  /**
   * Retrieves a TodoModel by its unique identifier.
   *
   * @param {number} id - The unique identifier of the TodoModel to retrieve.
   * @return {TodoModel | undefined} The TodoModel with the specified ID if found, or undefined if not found.
   */
  getById(id: number): TodoModel | undefined {
    return this.todos.find(t => t.id === id);
  }

  getAll(): TodoModel[] {
    return this.todos;
  }
}
