import { TodoFilterPipe } from './todo-filter.pipe';
import { TodoModel } from '../models/todo.model';

describe('TodoFilterPipe', () => {
  let pipe: TodoFilterPipe;

  const todos: TodoModel[] = [
    { id: 1, title: 'Buy groceries', done: false, priority: 'Medium', recurrence: 'None', dependencies: [] },
    { id: 2, title: 'Workout', done: true, priority: 'High', recurrence: 'Daily', dependencies: [] },
    { id: 3, title: 'Read book', done: false, priority: 'Low', recurrence: 'None', dependencies: [] },
    { id: 4, title: 'buy Milk', done: true, priority: 'Low', recurrence: 'None', dependencies: [] }
  ];

  beforeEach(() => {
    pipe = new TodoFilterPipe();
  });

  it('should filter by search term (case-insensitive)', () => {
    const result = pipe.transform(todos, 'buy');
    expect(result.length).toBe(2);
    expect(result[0].title).toContain('Buy');
  });

  it('should sort by priority when sortBy = "priority"', () => {
    const result = pipe.transform(todos, '', 'priority');
    const priorities = result.map(t => t.priority);
    expect(priorities).toEqual(['High', 'Medium', 'Low', 'Low']);
  });

  it('should sort by status when sortBy = "status"', () => {
    const result = pipe.transform(todos, '', 'status');
    const doneStatuses = result.map(t => t.done);
    expect(doneStatuses).toEqual([false, false, true, true]);
  });

  it('should return empty array if input todos is null', () => {
    const result = pipe.transform(null as any);
    expect(result).toEqual([]);
  });

  it('should return all items if search term is empty', () => {
    const result = pipe.transform(todos);
    expect(result.length).toBe(4);
  });
});
