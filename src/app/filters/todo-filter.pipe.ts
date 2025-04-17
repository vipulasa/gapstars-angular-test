import {Pipe, PipeTransform} from '@angular/core';
import {TodoModel} from '../models/todo.model';

@Pipe({
  name: 'todoFilter',
  standalone: true
})
export class TodoFilterPipe implements PipeTransform {

  transform(todos: TodoModel[], search: string = '', sortBy: 'priority' | 'status' = 'priority'): TodoModel[] {
    if (!todos) return [];

    const filtered = todos.filter(todo =>
      todo.title.toLowerCase().includes(search.toLowerCase())
    );

    if (sortBy === 'priority') {
      const priorityOrder: Record<string, number> = {'High': 1, 'Medium': 2, 'Low': 3};
      return filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }

    if (sortBy === 'status') {
      return filtered.sort((a, b) => Number(a.done) - Number(b.done));
    }

    return filtered;
  }
}
