import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTodoComponent } from './add-todo.component';
import { TodoService } from '../services/todo.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TodoModel } from '../models/todo.model';
import { By } from '@angular/platform-browser';

// Mock TodoService
class MockTodoService {
  todos: TodoModel[] = [];

  add(todo: TodoModel) {
    this.todos.push(todo);
  }

  getAll(): TodoModel[] {
    return this.todos;
  }
}

describe('AddTodoComponent', () => {
  let component: AddTodoComponent;
  let fixture: ComponentFixture<AddTodoComponent>;
  let todoService: MockTodoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTodoComponent, FormsModule, CommonModule],
      providers: [
        { provide: TodoService, useClass: MockTodoService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddTodoComponent);
    component = fixture.componentInstance;
    todoService = TestBed.inject(TodoService) as unknown as MockTodoService;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should add a todo when form is valid', () => {
    const formEl = fixture.debugElement.query(By.css('form'));
    const titleInput = fixture.debugElement.query(By.css('input[name="title"]')).nativeElement;

    titleInput.value = 'New Task';
    titleInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    spyOn(component.taskAdded, 'emit');
    const form = formEl.injector.get(NgForm);

    component.addTask(form);

    expect(todoService.todos.length).toBe(1);
    expect(todoService.todos[0].title).toBe('New Task');
    expect(component.taskAdded.emit).toHaveBeenCalled();
  });

  it('should not add a todo if form is invalid', () => {
    const formEl = fixture.debugElement.query(By.css('form'));
    spyOn(todoService, 'add');

    const form = formEl.injector.get(NgForm);
    form.resetForm(); // makes form invalid

    component.addTask(form);
    expect(todoService.add).not.toHaveBeenCalled();
  });

  it('should toggle a dependency', () => {
    component.dependencies = [1, 2];
    component.toggleDependency(2);
    expect(component.dependencies).not.toContain(2);

    component.toggleDependency(3);
    expect(component.dependencies).toContain(3);
  });

  it('should correctly report if a dependency is checked', () => {
    component.dependencies = [1, 2];
    expect(component.isChecked(1)).toBeTrue();
    expect(component.isChecked(5)).toBeFalse();
  });
});
