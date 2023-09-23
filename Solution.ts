/*Solution

SOLID Principles:
Single Responsibility Principle: La clase LibraryManager se ocupa únicamente de la lógica de la biblioteca, mientras que el servicio EmailService se ocupa del envío de correos electrónicos.
Open/Closed Principle: Las clases están abiertas para extensión (por ejemplo, añadiendo más tipos de notificaciones) pero cerradas para modificación.
Liskov Substitution Principle: User implementa la interfaz IObserver, lo que significa que se puede sustituir por cualquier otro objeto que también implemente la interfaz.
Dependency Inversion Principle: Se inyecta IEmailService en LibraryManager, lo que significa que LibraryManager no depende de una implementación concreta.

Inyección de Dependencias:
Inyectar IEmailService en LibraryManager.

Lambda Expressions:
Usar expresiones lambda en funciones como find y forEach.

Singleton Pattern:
Garantizar que solo haya una instancia de LibraryManager con el método getInstance.

Observer Pattern:
Los usuarios (User) se registran como observadores y son notificados cuando se añade un nuevo libro.

Builder Pattern:
Se utiliza para construir instancias de Book de una manera más limpia y escalable.

Refactorización:
eliminar el uso de ANY mejorar el performance

Aspectos (Opcional)
Puedes anadir logs de info, warning y error en las llamadas, para un mejor control

Diseño por Contrato (Opcional):
Puedes anadir validaciones en precondiciones o postcondiciones como lo veas necesario*/



// Definición de la interfaz para el servicio de correo electrónico
// Inyección de Dependencias:
// Inyectar IEmailService en LibraryManager.
interface IEmailService {
    sendEmail(userID: string, message: string): void;
}

// Implementación del servicio de correo electrónico
class EmailService implements IEmailService {
    sendEmail(userID: string, message: string) {
        console.log(`Enviando email a ${userID}: ${message}`);
        // Implementación real del envío de correo electrónico
    }
}

// Observer Pattern:
// Los usuarios (User) se registran como observadores y son notificados cuando se añade un nuevo libro.

// Definición de la interfaz para los observadores
interface IObserver {
    update(book: Book): void;
}

// Implementación de la clase de usuario como observador
class User implements IObserver {
    constructor(private userID: string) {}

    update(book: Book) {
        console.log(`Usuario ${this.userID} ha sido notificado sobre el libro: ${book.title}`);
    }
}

// Builder Pattern:
// Se utiliza para construir instancias de Book de una manera más limpia y escalable.

class BookBuilder {
    private title: string = "";
    private author: string = "";
    private ISBN: string = "";

    setTitle(title: string): BookBuilder {
        this.title = title;
        return this;
    }

    setAuthor(author: string): BookBuilder {
        this.author = author;
        return this;
    }

    setISBN(ISBN: string): BookBuilder {
        this.ISBN = ISBN;
        return this;
    }

    build(): Book {
        return new Book(this.title, this.author, this.ISBN);
    }
}

// Implementación de la clase Book
class Book {
    constructor(public title: string, public author: string, public ISBN: string) {}
}

// Implementación de la clase LibraryManager
// Refactorización:
// eliminar el uso de ANY mejorar el performance
class LibraryManager {
    private static instance: LibraryManager;
    private books: Book[] = [];
    private loans: any[] = [];
    private observers: IObserver[] = [];

    private constructor(private emailService: IEmailService) {}

    // Singleton Pattern:
    // Garantizar que solo haya una instancia de LibraryManager con el método getInstance.

    public static getInstance(emailService: IEmailService): LibraryManager {
        if (!LibraryManager.instance) {
            LibraryManager.instance = new LibraryManager(emailService);
        }
        return LibraryManager.instance;
    }

    // Aspectos (Opcional)
    // Puedes anadir logs de info, warning y error en las llamadas, para un mejor control

    // Diseño por Contrato (Opcional):
    // Puedes anadir validaciones en precondiciones o postcondiciones como lo veas necesario*/

    addBook(book: Book) {
        if (!book) {
            throw new Error("El libro no puede ser nulo.");
        }

        const existingBook = this.books.find(b => b.ISBN === book.ISBN);
        if (existingBook) {
            throw new Error(`El libro con ISBN ${book.ISBN} ya existe en la biblioteca.`);
        }

        this.books.push(book);
        this.notifyObservers(book);
        console.log(`Libro agregado: ${book.title}`);
    }

    removeBook(ISBN: string) {
        const index = this.books.findIndex(b => b.ISBN === ISBN);
        if (index !== -1) {
            this.books.splice(index, 1);
            console.log(`Libro eliminado con ISBN: ${ISBN}`);
        }
    }

    searchByTitle(query: string) {
        return this.books.filter(book => book.title.includes(query));
    }

    searchByAuthor(query: string) {
        return this.books.filter(book => book.author.includes(query));
    }

    searchByISBN(query: string) {
        return this.books.filter(book => book.ISBN === query);
    }

    loanBook(ISBN: string, userID: string) {
        const book = this.books.find(b => b.ISBN === ISBN);
        if (book) {
            this.loans.push({ ISBN, userID, date: new Date() });
            this.sendEmail(userID, `Has solicitado el libro ${book.title}`);
            console.log(`Libro prestado a ${userID}: ${book.title}`);
        }
    }

    returnBook(ISBN: string, userID: string) {
        const index = this.loans.findIndex(loan => loan.ISBN === ISBN && loan.userID === userID);
        if (index !== -1) {
            this.loans.splice(index, 1);
            this.sendEmail(userID, `Has devuelto el libro con ISBN ${ISBN}. ¡Gracias!`);
            console.log(`Libro devuelto por ${userID}: ${ISBN}`);
        }
    }

    addObserver(observer: IObserver) {
        this.observers.push(observer);
    }
    // Lambda Expressions:
    // Usar expresiones lambda en funciones como find y forEach.
    
    private notifyObservers(book: Book) {
        this.observers.forEach(observer => observer.update(book));
    }

    private sendEmail(userID: string, message: string) {
        this.emailService.sendEmail(userID, message);
    }
}

// Ejemplo de uso
const emailService = new EmailService();
const library = LibraryManager.getInstance(emailService);

const user1 = new User("user01");
library.addObserver(user1);

// const book1 = new Book("El Gran Gatsby", "F. Scott Fitzgerald", "123456789");
// library.addBook(book1);

// const book2 = new Book("1984", "George Orwell", "987654321");
// library.addBook(book2);


// Uso del Builder Pattern
const bookBuilder = new BookBuilder();
const book1 = bookBuilder.setTitle("El Gran Gatsby")
    .setAuthor("F. Scott Fitzgerald")
    .setISBN("123456789")
    .build();

const book2 = bookBuilder.setTitle("1984")
    .setAuthor("George Orwell")
    .setISBN("987654321")
    .build();

