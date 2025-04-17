import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TodoModel } from '../models/todo.model';

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

  constructor() {}

  /**
   * Updates the state of the subject with the current list of todos.
   * The method emits a new value to all subscribers by creating a new array
   * from the current todos.
   *
   * @return {void}
   */
  private updateSubject() {
    this.todoSubject.next([...this.todos]);
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
}
