import {Component, EventEmitter, Output} from '@angular/core';
import {TodoService} from '../services/todo.service';
import {Priority, Recurrence, TodoModel} from '../models/todo.model';
import {FormsModule, NgForm} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-add-todo',
  imports: [
    FormsModule,
    CommonModule
  ],
  standalone: true,
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css']
})
export class AddTodoComponent {

  title = '';

  priority: Priority = 'Medium';

  recurrence: Recurrence = 'None';

  dependencies: number[] = [];

  constructor(public todoService: TodoService) {
  }

  @Output() taskAdded = new EventEmitter<void>();

  @Output() closed = new EventEmitter<void>();

  /**
   * Determines whether the given ID exists in the dependencies list.
   *
   * @param {number} id - The ID to check for inclusion in the dependencies.
   * @return {boolean} True if the ID is included in the dependencies, otherwise false.
   */
  isChecked(id: number): boolean {
    return this.dependencies.includes(id);
  }

  /**
   * Toggles the inclusion of a dependency ID in the dependencies list.
   * If the ID is already in the list, it will be removed.
   * If the ID is not in the list, it will be added.
   *
   * @param {number} id - The ID of the dependency to be toggled in the list.
   * @return {void}
   */
  toggleDependency(id: number): void {
    this.dependencies.includes(id)
      ? this.dependencies = this.dependencies.filter(d => d !== id)
      : this.dependencies = [...this.dependencies, id];
  }

  /**
   * Adds a new task to the task list based on the form input.
   * Resets the form after successfully adding the task.
   *
   * @param {NgForm} form - The reactive form containing task details.
   *                       Must be valid to add the task.
   * @return {void}
   */
  addTask(form: NgForm): void {

    if (!form || form.invalid) return;

    const newTask: TodoModel = {
      id: Date.now(),
      title: this.title,
      done: false,
      priority: this.priority,
      recurrence: this.recurrence,
      dependencies: this.dependencies
    };

    this.todoService.add(newTask);

    form.resetForm({
      priority: 'Medium',
      recurrence: 'None',
      dependencies: []
    });

    this.taskAdded.emit();
  }
}
