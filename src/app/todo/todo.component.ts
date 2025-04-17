import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TodoService} from '../services/todo.service';
import {FormsModule} from '@angular/forms';
import {TodoModel} from '../models/todo.model';
import {AddTodoComponent} from '../add-todo/add-todo.component';
import {TodoFilterPipe} from '../filters/todo-filter.pipe';

@Component({
  selector: 'app-todo',
  imports: [
    AddTodoComponent,
    FormsModule,
    CommonModule,
    TodoFilterPipe
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent implements OnInit {

  showAddTodo = false;

  todos: TodoModel[] = [];

  search = '';

  sortBy: 'priority' | 'status' = 'priority';

  constructor(private todoService: TodoService) {

  }

  ngOnInit() {
    this.loadTodos();
  }

  /**
   * Loads the list of todos by retrieving them from the todo service and updating the internal todos array.
   *
   * @return {void}
   */
  loadTodos(): void {
    this.todos = [...this.todoService.getAll()];
  }

  /**
   * Determines if a given todo item can be marked as completed
   * based on the completion status of its dependencies.
   *
   * @param {TodoModel} todo - The todo item for which to check if it can be completed.
   * @return {boolean} True if all dependencies of the todo item are marked as done, false otherwise.
   */
  canComplete(todo: TodoModel): boolean {
    return todo.dependencies.every(id => {
      const dep = this.todoService.getById(id);
      return dep?.done;
    });
  }

  /**
   * Toggles the completion status of the provided todo item.
   * If the todo item is eligible for completion, updates its status
   * and sends the updated item to the todo service. If the item cannot
   * be completed due to unmet dependencies, displays an alert.
   *
   * @param {TodoModel} todo - The todo item to toggle the completion status for.
   * @return {void} Does not return a value.
   */
  toggleDone(todo: TodoModel) {
    if (this.canComplete(todo)) {
      todo.done = !todo.done;
      this.todoService.update(todo);
    } else {
      alert('Cannot complete this task until dependencies are done.');
    }
  }

  /**
   * Deletes a task based on the provided task ID.
   *
   * @param {number} id - The unique identifier of the task to be deleted.
   * @return {void} This method does not return a value.
   */
  deleteTask(id: number): void {
    const todo = this.todos.find(t => t.id === id);

    if (!todo) return;

    if (this.isReferencedAsDependency(id)) {
      alert(`"${todo.title}" cannot be deleted because it is a dependency of another task.`);
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete "${todo.title}"?`);

    if (confirmed) {
      this.todoService.delete(id);
      this.loadTodos();
    }
  }


  /**
   * Handles the event when a new task is added.
   * Sets the state to hide the "add todo" interface and reloads the list of tasks.
   *
   * @return {void}
   */
  onTaskAdded() {
    this.showAddTodo = false;
    this.loadTodos();
  }

  /**
   * Retrieves the title of a dependency task based on its ID.
   *
   * @param {number} id - The unique identifier of the dependency task.
   * @return {string} The title of the dependency task if found, otherwise 'Unknown Task'.
   */
  getDependencyTitle(id: number): string {
    const dep = this.todoService.getById(id);
    return dep?.title ?? 'Unknown Task';
  }

  /**
   * Checks if a dependency with the given ID is marked as done.
   *
   * @param {number} id - The unique identifier of the dependency to check.
   * @return {boolean} Returns true if the dependency is marked as done, otherwise false.
   */
  isDependencyDone(id: number): boolean {
    const dep = this.todoService.getById(id);
    return !!dep?.done;
  }

  /**
   * Checks if the specified todo item is referenced as a dependency by any other todo in the list.
   *
   * @param {number} todoId - The unique identifier of the todo item to check.
   * @return {boolean} Returns true if the todo item is referenced as a dependency, otherwise false.
   */
  isReferencedAsDependency(todoId: number): boolean {
    return this.todos.some(todo =>
      todo.dependencies.includes(todoId)
    );
  }
}
