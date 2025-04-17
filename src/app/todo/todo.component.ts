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

  loadTodos(): void {
    this.todos = [...this.todoService.getAll()];
  }

  canComplete(todo: TodoModel): boolean {
    return todo.dependencies.every(id => {
      const dep = this.todoService.getById(id);
      return dep?.done;
    });
  }

  toggleDone(todo: TodoModel) {
    if (this.canComplete(todo)) {
      todo.done = !todo.done;
      this.todoService.update(todo);
    } else {
      alert('Cannot complete this task until dependencies are done.');
    }
  }

  deleteTask(id: number) {
    this.todoService.delete(id);
    this.loadTodos();
  }

  onTaskAdded() {
    this.showAddTodo = false;
    this.loadTodos();
  }

  getDependencyTitle(id: number): string {
    const dep = this.todoService.getById(id);
    return dep?.title ?? 'Unknown Task';
  }

  isDependencyDone(id: number): boolean {
    const dep = this.todoService.getById(id);
    return !!dep?.done;
  }
}
