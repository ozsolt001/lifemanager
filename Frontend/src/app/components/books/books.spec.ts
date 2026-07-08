import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Books } from './books';

describe('Books', () => {
  let component: Books;
  let fixture: ComponentFixture<Books>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Books],
    }).compileComponents();

    fixture = TestBed.createComponent(Books);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('selects a current book and calculates its progress', () => {
    const book = component.currentBooks[1];

    component.selectBook(book);

    expect(component.selectedBook?.title).toBe('Designing Data-Intensive Applications');
    expect(component.progressFor(book)).toBe(63);
  });

  it('swaps the shelf to already read books for retrospective view', () => {
    component.showRetrospective();

    expect(component.shelfMode).toBe('retrospective');
    expect(component.selectedBook?.currentPage).toBe(component.selectedBook?.totalPages);
    expect(component.activeBooks.every((book) => component.progressFor(book) === 100)).toBe(true);
  });

  it('adds a new book to the current reading shelf with a selected language', () => {
    component.showRetrospective();
    component.bookDraft = {
      title: 'Domain-Driven Design',
      type: 'technical',
      language: 'German',
      totalPages: 560,
      currentPage: 80,
    };

    component.saveBook();

    expect(component.shelfMode).toBe('current');
    expect(component.selectedBook?.title).toBe('Domain-Driven Design');
    expect(component.currentBooks.at(-1)?.language).toBe('German');
    expect(component.currentBooks.at(-1)?.currentPage).toBe(80);
  });

  it('edits the selected book details', () => {
    const book = component.currentBooks[0];

    component.openEditDialog(book);
    component.bookDraft = {
      title: 'Clean Architecture Revised',
      type: 'technical',
      language: 'Hungarian',
      totalPages: 450,
      currentPage: 225,
    };
    component.saveBook();

    expect(component.selectedBook?.title).toBe('Clean Architecture Revised');
    expect(component.selectedBook?.language).toBe('Hungarian');
    expect(component.selectedBook?.totalPages).toBe(450);
    expect(component.selectedBook?.currentPage).toBe(225);
  });

  it('updates only the reading progress', () => {
    const book = component.currentBooks[0];

    component.openProgressDialog(book);
    component.progressPage = 300;
    component.saveProgress();

    expect(component.selectedBook?.title).toBe(book.title);
    expect(component.selectedBook?.currentPage).toBe(300);
  });
});
