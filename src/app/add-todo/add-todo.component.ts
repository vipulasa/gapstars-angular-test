import { Component, EventEmitter, Output } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { Priority, Recurrence, TodoModel } from '../models/todo.model';
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

  constructor(public todoService: TodoService) {}

  @Output() taskAdded = new EventEmitter<void>();

  @Output() closed = new EventEmitter<void>();

  isChecked(id: number): boolean {
    return this.dependencies.includes(id);
  }

  toggleDependency(id: number): void {
    this.dependencies.includes(id)
      ? this.dependencies = this.dependencies.filter(d => d !== id)
      : this.dependencies = [...this.dependencies, id];
  }

  /**
   *
   */
  addTask(form: NgForm) {

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
