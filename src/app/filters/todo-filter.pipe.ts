import {Pipe, PipeTransform} from '@angular/core';
import {TodoModel} from '../models/todo.model';

/**
 * A custom Angular pipe that filters and sorts an array of TodoModel objects.
 *
 * The `TodoFilterPipe` allows filtering based on a search string and sorting
 * by either priority or status. The filtering is case-insensitive and checks
 * if the `title` of a `TodoModel` includes the search term. Sorting behavior
 * depends on the `sortBy` parameter, which can either prioritize by task
 * priority or task-completion status.
 *
 * Usage:
 * - This pipe can be applied to an array of `TodoModel` objects to dynamically
 *   display filtered and sorted results.
 *
 * Functionality:
 * - Filters todos based on a provided search string.
 * - Sorts todos by priority in the order of 'High', 'Medium', 'Low'.
 * - Sorts todos by their status, with incomplete tasks appearing first.
 *
 * Parameters:
 * @param todos The array of `TodoModel` objects to be filtered and sorted.
 * @param search The search string that will filter todos by their title.
 * @param sortBy The sort key determining whether to sort by priority or status.
 *
 * Returns:
 * An array of filtered and sorted `TodoModel` objects.
 */
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
