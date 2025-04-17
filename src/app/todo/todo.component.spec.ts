import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TodoComponent } from './todo.component';
import { TodoService } from '../services/todo.service';
import { TodoModel } from '../models/todo.model';
import { AddTodoComponent } from '../add-todo/add-todo.component';
import { TodoFilterPipe } from '../filters/todo-filter.pipe';
import { of } from 'rxjs';

// Mock data
const sampleTodos: TodoModel[] = [
  {
    id: 1,
    title: 'First Todo',
    done: false,
    priority: 'Low',
    recurrence: 'None',
    dependencies: []
  },
  {
    id: 2,
    title: 'Second Todo',
    done: true,
    priority: 'High',
    recurrence: 'Weekly',
    dependencies: [1]
  }
];

// Mock service
class MockTodoService {
  private todos = [...sampleTodos];

  getAll(): TodoModel[] {
    return this.todos;
  }

  getById(id: number): TodoModel | undefined {
    return this.todos.find(t => t.id === id);
  }

  update(updated: TodoModel): void {
    this.todos = this.todos.map(t => (t.id === updated.id ? updated : t));
  }

  delete(id: number): void {
    this.todos = this.todos.filter(t => t.id !== id);
  }
}

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let todoService: TodoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoComponent, FormsModule, TodoFilterPipe],
      providers: [
        { provide: TodoService, useClass: MockTodoService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    todoService = TestBed.inject(TodoService);

    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load todos on init', () => {
    expect(component.todos.length).toBeGreaterThan(0);
  });

  it('should toggle done if dependencies are completed', () => {
    const todo = component.todos[0];
    expect(todo.done).toBeFalse();

    component.toggleDone(todo);
    expect(todo.done).toBeTrue();
  });

  it('should not allow toggling a todo with unmet dependencies', () => {
    const todo = component.todos.find(t => t.dependencies.length > 0);
    if (todo) {
      spyOn(window, 'alert');
      component.toggleDone(todo);
      expect(window.alert).toHaveBeenCalledWith('Cannot complete this task until dependencies are done.');
    }
  });

  it('should confirm before deleting a task', () => {
    const todo = component.todos.find(t => !component.isReferencedAsDependency(t.id));
    expect(todo).toBeTruthy(); // Make sure we have a deletable task

    const initialLength = component.todos.length;

    spyOn(window, 'confirm').and.returnValue(true); // simulate user confirming

    component.deleteTask(todo!.id);

    expect(window.confirm).toHaveBeenCalledWith(`Are you sure you want to delete "${todo!.title}"?`);
    expect(component.todos.length).toBe(initialLength - 1);
  });

  it('should cancel deletion if user does not confirm', () => {
    const todo = component.todos[0];
    spyOn(window, 'confirm').and.returnValue(false);
    const initialLength = component.todos.length;

    component.deleteTask(todo.id);
    expect(component.todos.length).toEqual(initialLength);
  });

  it('should not delete if the todo is a dependency', () => {
    const dependent = component.todos[0]; // id = 1
    spyOn(window, 'alert');
    spyOn(window, 'confirm').and.returnValue(true);

    component.deleteTask(dependent.id);

    expect(window.alert).toHaveBeenCalledWith(`"${dependent.title}" cannot be deleted because it is a dependency of another task.`);
  });

  it('should mark the todo as a dependency when used in another task', () => {
    const result = component.isReferencedAsDependency(1); // id of first todo
    expect(result).toBeTrue();
  });

  it('should return the title of a valid dependency', () => {
    const title = component.getDependencyTitle(1);
    expect(title).toBe('First Todo');
  });

  it('should return "Unknown Task" for a non-existent dependency', () => {
    const title = component.getDependencyTitle(999);
    expect(title).toBe('Unknown Task');
  });
});
