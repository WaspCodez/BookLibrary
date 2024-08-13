import Repos from './Repos';
import Book from '../models/Book';

class BookRepository{

    async getBookList() {
        return Repos.get(`http://localhost:5148/api/v1/books`);
      }

      async getBookById(id: string) {
        return Repos.get(`http://localhost:5148/api/v1/books?id=${id}`);
      }
    
      async addBookToList(book: Book) {
        return Repos.add(`http://localhost:5148/api/v1/books`, book);
      }

      async editBookDetails(book: Book) {
        console.log(book);
        return Repos.put(`http://localhost:5148/api/v1/books`, book);
    }
    
    async deleteBookById(id: string) {
        return Repos.delete(`http://localhost:5148/api/v1/books?id=${id}`);
    }
}

export default new BookRepository()