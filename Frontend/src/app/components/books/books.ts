import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

type BookType = 'technical' | 'free time';
type ShelfMode = 'current' | 'retrospective';
type BookDialogMode = 'add' | 'edit';

interface Book {
  id: number;
  title: string;
  type: BookType;
  language: string;
  totalPages: number;
  currentPage: number;
  coverClass: string;
}

interface BookDraft {
  title: string;
  type: BookType;
  language: string;
  totalPages: number;
  currentPage: number;
}

@Component({
  selector: 'app-books',
  imports: [FormsModule],
  templateUrl: './books.html',
  styleUrl: './books.css',
  host: {
    class:
      'fixed inset-x-0 bottom-0 top-[4.5rem] z-[1] block overflow-hidden bg-[#f5f7fb] text-[#172033]',
  },
})
export class Books {
  private nextId = 8;
  private editingBookId: number | null = null;
  private readonly coverClasses = [
    'cover-teal',
    'cover-coral',
    'cover-indigo',
    'cover-moss',
    'cover-graphite',
  ];

  readonly languages = ['English', 'Hungarian', 'German', 'Spanish', 'French'];

  shelfMode: ShelfMode = 'current';
  selectedBookId = 1;
  isBookDialogOpen = false;
  bookDialogMode: BookDialogMode = 'add';
  progressBookId: number | null = null;
  progressPage = 0;

  allBooks: Book[] = [
{
      id: 1,
      title: 'Clean Architecture',
      type: 'technical',
      language: 'English',
      totalPages: 432,
      currentPage: 214,
      coverClass: 'cover-teal',
    },
    {
      id: 2,
      title: 'Designing Data-Intensive Applications',
      type: 'technical',
      language: 'English',
      totalPages: 616,
      currentPage: 388,
      coverClass: 'cover-indigo',
    },
    {
      id: 3,
      title: 'Project Hail Mary',
      type: 'free time',
      language: 'English',
      totalPages: 496,
      currentPage: 129,
      coverClass: 'cover-coral',
    },
    {
      id: 4,
      title: 'The Pragmatic Programmer',
      type: 'technical',
      language: 'English',
      totalPages: 352,
      currentPage: 352,
      coverClass: 'cover-graphite',
    },
    {
      id: 5,
      title: 'Atomic Habits',
      type: 'free time',
      language: 'English',
      totalPages: 320,
      currentPage: 320,
      coverClass: 'cover-moss',
    },
    {
      id: 6,
      title: 'Refactoring UI',
      type: 'technical',
      language: 'English',
      totalPages: 252,
      currentPage: 252,
      coverClass: 'cover-teal',
    },
    {
      id: 7,
      title: 'Dune',
      type: 'free time',
      language: 'Hungarian',
      totalPages: 688,
      currentPage: 688,
      coverClass: 'cover-coral',
    },
  ];

  currentBooks: Book[] = this.allBooks.filter((book) => book.currentPage < book.totalPages);

  retrospectiveBooks: Book[] = this.allBooks.filter((book) => book.currentPage === book.totalPages);

  bookDraft: BookDraft = this.createEmptyDraft();

  get activeBooks(): Book[] {
    return this.shelfMode === 'current' ? this.currentBooks : this.retrospectiveBooks;
  }

  get selectedBook(): Book | null {
    return (
      this.activeBooks.find((book) => book.id === this.selectedBookId) ??
      this.activeBooks[0] ??
      null
    );
  }

  get progressBook(): Book | null {
    return this.findBookById(this.progressBookId);
  }

  get dialogTitle(): string {
    return this.bookDialogMode === 'add' ? 'Add book' : 'Edit book';
  }

  get dialogEyebrow(): string {
    return this.bookDialogMode === 'add' ? 'New reading item' : 'Selected reading item';
  }

  get shelfTitle(): string {
    return this.shelfMode === 'current' ? 'Currently reading' : 'Retrospective';
  }

  get shelfCountLabel(): string {
    const bookCount = this.activeBooks.length;

    return `${bookCount} ${bookCount === 1 ? 'book' : 'books'}`;
  }

  selectBook(book: Book): void {
    this.selectedBookId = book.id;
  }

  showCurrentBooks(): void {
    this.setShelfMode('current');
  }

  showRetrospective(): void {
    this.setShelfMode('retrospective');
  }

  openAddDialog(): void {
    this.bookDialogMode = 'add';
    this.editingBookId = null;
    this.bookDraft = this.createEmptyDraft();
    this.isBookDialogOpen = true;
  }

  openEditDialog(book: Book): void {
    this.bookDialogMode = 'edit';
    this.editingBookId = book.id;
    this.bookDraft = this.createDraftFromBook(book);
    this.isBookDialogOpen = true;
  }

  closeBookDialog(): void {
    this.isBookDialogOpen = false;
    this.editingBookId = null;
  }

  saveBook(): void {
    const normalizedDraft = this.normalizeDraft(this.bookDraft);

    if (!normalizedDraft) {
      return;
    }

    if (this.bookDialogMode === 'edit' && this.editingBookId !== null) {
      const bookToBeUpdated = this.findBookById(this.editingBookId);

      if (!bookToBeUpdated) {
        return;
      }

      this.updateBook({
        ...bookToBeUpdated,
        ...normalizedDraft,
      });
      this.selectedBookId = bookToBeUpdated.id;
      this.closeBookDialog();
      return;
    }

    const book: Book = {
      id: this.nextId++,
      ...normalizedDraft,
      coverClass: this.coverClasses[(this.nextId - 1) % this.coverClasses.length],
    };

    this.currentBooks = [...this.currentBooks, book];
    this.shelfMode = 'current';
    this.selectedBookId = book.id;
    this.closeBookDialog();
  }

  openProgressDialog(book: Book): void {
    this.progressBookId = book.id;
    this.progressPage = book.currentPage;
  }

  closeProgressDialog(): void {
    this.progressBookId = null;
  }

  saveProgress(): void {
    const book = this.progressBook;
    const currentPage = Math.floor(Number(this.progressPage));

    if (!book || currentPage < 0) {
      return;
    }

    this.updateBook({
      ...book,
      currentPage: Math.min(currentPage, book.totalPages),
    });
    this.closeProgressDialog();
  }

  progressFor(book: Book): number {
    return Math.round((book.currentPage / book.totalPages) * 100);
  }

  remainingPages(book: Book): number {
    return Math.max(book.totalPages - book.currentPage, 0);
  }

  trackBook(_index: number, book: Book): number {
    return book.id;
  }

  @HostListener('document:keydown.escape')
  closeOnEscape(): void {
    this.closeBookDialog();
    this.closeProgressDialog();
  }

  private setShelfMode(mode: ShelfMode): void {
    this.shelfMode = mode;
    this.selectedBookId = this.activeBooks[0]?.id ?? 0;
  }

  private createEmptyDraft(): BookDraft {
    return {
      title: '',
      type: 'technical',
      language: this.languages[0],
      totalPages: 1,
      currentPage: 0,
    };
  }

  private createDraftFromBook(book: Book): BookDraft {
    return {
      title: book.title,
      type: book.type,
      language: book.language,
      totalPages: book.totalPages,
      currentPage: book.currentPage,
    };
  }

  private normalizeDraft(draft: BookDraft): BookDraft | null {
    const title = draft.title.trim();
    const language = draft.language.trim();
    const totalPages = Math.floor(Number(draft.totalPages));
    const currentPage = Math.floor(Number(draft.currentPage));

    if (!title || !language || totalPages < 1 || currentPage < 0) {
      return null;
    }

    return {
      title,
      type: draft.type,
      language,
      totalPages,
      currentPage: Math.min(currentPage, totalPages),
    };
  }

  private findBookById(bookId: number | null): Book | null {
    if (bookId === null) {
      return null;
    }

    return (
      this.currentBooks.find((book) => book.id === bookId) ??
      this.retrospectiveBooks.find((book) => book.id === bookId) ??
      null
    );
  }

  private updateBook(updatedBook: Book): void {
    const update = (books: Book[]): Book[] =>
      books.map((book) => (book.id === updatedBook.id ? updatedBook : book));

    if (updatedBook.currentPage === updatedBook.totalPages) {
      this.currentBooks = this.currentBooks.filter((book) => book.id !== updatedBook.id);
      this.retrospectiveBooks = [...this.retrospectiveBooks, updatedBook];
    } else {
      this.currentBooks = update(this.currentBooks);
    }

  }
}
