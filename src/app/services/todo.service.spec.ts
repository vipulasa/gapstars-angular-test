import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';
import { TodoModel } from '../models/todo.model';

describe('TodoService', () => {

  let service: TodoService;

  let mockStorage: { [key: string]: string } = {};

  beforeEach(() => {
    spyOn(localStorage, 'getItem').and.callFake((key: string) => mockStorage[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      mockStorage[key] = value;
    });
    spyOn(localStorage, 'removeItem').and.callFake((key: string) => {
      delete mockStorage[key];
    });
    spyOn(localStorage, 'clear').and.callFake(() => {
      Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
    });

    mockStorage = {}; // reset before each test

    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load initial todos from localStorage or fallback to sample', () => {
    const todos = service.getAll();
    expect(todos.length).toBeGreaterThan(0);
  });

  it('should add a new todo and store it', () => {
    const newTodo: TodoModel = {
      id: 100,
      title: 'New Task',
      done: false,
      priority: 'Medium',
      recurrence: 'None',
      dependencies: []
    };

    service.add(newTodo);
    const todos = service.getAll();
    expect(todos.find(t => t.id === 100)).toEqual(newTodo);
  });

  it('should update an existing todo', () => {
    const [existing] = service.getAll();
    const updated = { ...existing, title: 'Updated Title' };

    service.update(updated);

    const stored = service.getById(updated.id);
    expect(stored?.title).toBe('Updated Title');
  });

  it('should delete a todo by id', () => {
    const [todo] = service.getAll();
    service.delete(todo.id);

    const result = service.getById(todo.id);
    expect(result).toBeUndefined();
  });

  it('should emit updated todos via todos$', (done) => {
    const newTodo: TodoModel = {
      id: 200,
      title: 'Observable Test',
      done: false,
      priority: 'Low',
      recurrence: 'None',
      dependencies: []
    };

    service.todos$.subscribe(todos => {
      if (todos.find(t => t.id === 200)) {
        expect(todos.length).toBeGreaterThan(0);
        done();
      }
    });

    service.add(newTodo);
  });
});
