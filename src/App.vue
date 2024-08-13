<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import BookRepository from './Repository/BookRepository';
import Book from './models/Book';
import { useUserStore } from './storeToken/storedToken';
import { toast } from 'vue3-toastify';
import { v4 as uuidv4 } from 'uuid';

const store = useUserStore();

const id = ref<string>('');
const title = ref<string>('');
const author = ref<string>('');
const publishedDate = ref<Date | null>(null);
const isbnId = ref<string>('');
const bookDetails = ref<Book[]>([]);
const currentPage = ref<number>(1);
const pageSize = ref<number>(5);
const showModal = ref<boolean>(false);
const errors = ref<{ [key: string]: string }>({});
const searchQuery = ref<string>('');

const editingBook = ref<Book | null>(null);

onMounted(async () => {
  await getBookList();
});

async function getBookList() {
  bookDetails.value = await BookRepository.getBookList();
}

const totalPages = computed(() => Math.ceil(filteredBooks.value.length / pageSize.value));

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredBooks.value.slice(start, end);
});

const filteredBooks = computed(() => {
  if (!searchQuery.value) return bookDetails.value;
  return bookDetails.value.filter(book =>
    book.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    book.isbn.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function toggleModal() {
  if (showModal.value) {
    showModal.value = false;
    clearForm();
  } else {
    showModal.value = true;
    if (!editingBook.value) {
      id.value = uuidv4();
      title.value = 'Add title here';
      author.value = '';
      publishedDate.value = null;
      isbnId.value = '';
    }
  }
}

function validateForm() {
  errors.value = {};
  if (!editingBook.value?.title) errors.value.title = 'Title is required';
  if (!editingBook.value?.author) errors.value.author = 'Author is required';
  if (!editingBook.value?.publishedDate) errors.value.publishedDate = 'Published Date is required';
  if (!editingBook.value?.isbn) errors.value.isbnId = 'ISBN is required';
  return Object.keys(errors.value).length === 0;
}

function addBookValidateForm() {
  errors.value = {};
  if (!title.value) errors.value.title = 'Title is required';
  if (!author.value) errors.value.author = 'Author is required';
  if (!publishedDate.value) errors.value.publishedDate = 'Published Date is required';
  if (!isbnId.value) errors.value.isbnId = 'ISBN is required';
  return Object.keys(errors.value).length === 0;
}

async function addBookToList() {
  if (addBookValidateForm()) {
    const newBook: Book = {
      id: id.value,
      title: title.value,
      author: author.value,
      publishedDate: publishedDate.value!,
      isbn: isbnId.value,
    };
    bookDetails.value.push(newBook);

    try {
      await BookRepository.addBookToList(newBook);
      clearForm();
      showModal.value = false;
      toast.success('Book added successfully!');
    } catch (error) {
      toast.error('Failed to add book.');
    }
  }
}

function openEditModal(book: Book) {
  editingBook.value = { ...book };
  id.value = book.id; 
  title.value = book.title;
  author.value = book.author;
  publishedDate.value = book.publishedDate;
  isbnId.value = book.isbn;
  showModal.value = true;
}

async function updateBook() {
  if (validateForm()) {
    try {
      if (!editingBook.value) return;
      await BookRepository.editBookDetails(editingBook.value);

      const index = bookDetails.value.findIndex(book => book.id === editingBook.value?.id);
      if (index !== -1) {
        bookDetails.value[index] = { ...editingBook.value };
      }
      clearForm();
      showModal.value = false;
      toast.success('Book updated successfully!');
    } catch (error) {
      toast.error('Failed to update book.');
    }
  }
}

async function deleteBook(bookId: string) {
  try {
    await BookRepository.deleteBookById(bookId);

    bookDetails.value = bookDetails.value.filter(book => book.id !== bookId);
    toast.success('Book deleted successfully!');
  } catch (error) {
    toast.error('Failed to delete book.');
  }
}

function clearForm() {
  id.value = '';
  title.value = '';
  author.value = '';
  publishedDate.value = null;
  isbnId.value = '';
  editingBook.value = null;
}
</script>

<template>
  <div>
    <h1>Book Library</h1>
    <div class="search-container">
      <input v-model="searchQuery" type="text" placeholder="Search..." />
      <br>
      <button @click="toggleModal" class="add-button"><i class="fa-solid fa-circle-plus"></i> New Book</button>
      <br>
    </div>
    <div>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Book ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Published Date</th>
            <th>ISBN</th>
            <th>&nbsp;</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in paginatedBooks" :key="book.id">
            <td><i class="fa-solid fa-book">&nbsp;</i></td>
            <td>{{ book.id }}</td>
            <td>{{ book.title }}</td>
            <td>{{ book.author }}</td>
            <td>{{ book.publishedDate }}</td>
            <td>{{ book.isbn }}</td>
            <td>&nbsp;</td>
            <td>
              <button @click="openEditModal(book)"><i class="fa-solid fa-pen-to-square"></i></button>
              <button @click="deleteBook(book.id)"><i class="fa-solid fa-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pagination-controls">
        <br>
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <span>&nbsp; Page {{ currentPage }} of {{ totalPages }} &nbsp;</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>{{ editingBook ? 'Edit Book' : 'Add New Book' }}</h2>
        <form @submit.prevent="editingBook ? updateBook() : addBookToList()">
          <div>
            <br>
            <label for="title">Title: &nbsp;</label>
            <input v-model="title" id="title" type="text" />
            <br>
            <span v-if="errors.title" class="error">{{ errors.title }}</span>
          </div>
          <div>
            <br>
            <label for="author">Author: &nbsp;</label>
            <input v-model="author" id="author" type="text" />
            <br>
            <span v-if="errors.author" class="error">{{ errors.author }}</span>
          </div>
          <div>
            <br>
            <label for="publishedDate">Published Date: &nbsp;</label>
            <input v-model="publishedDate" id="publishedDate" type="date" />
            <br>
            <span v-if="errors.publishedDate" class="error">{{ errors.publishedDate }}</span>
          </div>
          <div>
            <br>
            <label for="isbn">ISBN: &nbsp;</label>
            <input v-model="isbnId" id="isbn" type="text" />
            <br>
            <span v-if="errors.isbnId" class="error">{{ errors.isbnId }}</span>
          </div>
          <div>
            <br>
            <button type="submit">{{ editingBook ? 'Save Changes' : 'Add Book' }}</button>
            &nbsp;
            <button type="button" @click="toggleModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-button {
  margin-left: auto;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%; 
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: rgba(255, 255, 255, 0.1); 
  backdrop-filter: blur(20px); 
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  max-width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2); 
}

.error {
  color: red;
  font-size: 0.9em;
}

table {
  width: 100%;
  height: 75%;
  border-radius: 25px;
  padding: 50px;
  background-color: light dark; 
  overflow-y: scroll;
  box-shadow: 20px 20px 50px grey;
  margin-top: 20px;
  border-collapse: collapse;
}

th, td {
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid #ddd; 
}

tr:hover {
  background-color: grey;
}
</style>