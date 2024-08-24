document.addEventListener('DOMContentLoaded', () => console.log('Document is ready'));

let books = [];

function addBook() {
    const bookDetails = {
        title: document.getElementById('book-input').value,
        author: document.getElementById('author-input').value,
        publisher: document.getElementById('publisher-input').value,
        isbn: document.getElementById('ISBN-input').value,
        publicationYear: document.getElementById('pubyear-input').value,
        description: document.getElementById('desc-input').value,
        price: document.getElementById('price-input').value,
        coverFileName: document.getElementById('cover-input').files[0] ? document.getElementById('cover-input').files[0].name : 'default-cover.jpg',
        coverFile: document.getElementById('cover-input').files[0] || null
    };

    if (bookDetails.title) {
        const newCard = document.createElement('div');
        newCard.className = 'card-wrapper';

        newCard.innerHTML = `
            <div class="card-container">
                <div class="card-img">
                    <img src="#" alt="Book Cover" class="img-fluid cover-image">
                </div>
                <div class="card-txt">
                    <h5 class="card-title">${bookDetails.title.replace(/\b\w/g, char => char.toUpperCase())}</h5>
                    <button id="btn-expand" class="btn btn-primary btn-sm expand-btn" data-bs-toggle="modal" data-bs-target="#expandModal">
                        <i class="fa fa-expand" aria-hidden="true"></i>
                    </button>
                    <p class="card-text">
                        Author: ${bookDetails.author}<br>
                        Price: $${bookDetails.price}<br>

                    </p>
                </div>
            </div>
        `;

        const cardImage = newCard.querySelector('.cover-image');
        if (bookDetails.coverFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                cardImage.src = e.target.result;
                cardImage.alt = 'Book Cover';
            };
            reader.readAsDataURL(bookDetails.coverFile);
        } else {
            cardImage.src = '../res/default-cover.jpg';
            cardImage.alt = 'Default Book Cover';
        }

        const cardList = document.querySelector('.card-list');
        if (cardList) {
            cardList.appendChild(newCard);

            // Add event listener for expand button
            newCard.querySelector('.expand-btn').addEventListener('click', () => expandCard(bookDetails, newCard));

            // Store the book details in the global books array
            books.push(bookDetails);

            // Clear the input fields after adding the book
            clearInputs();
        } else {
            console.error('Card list container not found');
        }
    }
}

function expandCard(bookDetails, cardElement) {
    const modalTitle = document.querySelector('#expandModal .modal-title');
    const modalBody = document.querySelector('#expandModal .modal-body');
    const modalFooter = document.querySelector('#expandModal .modal-footer');

    modalTitle.textContent = bookDetails.title;

    // Set the cover image, using a default image if none is provided
    const coverImageSrc = bookDetails.coverFile 
        ? URL.createObjectURL(bookDetails.coverFile)
        : '../res/default-cover.jpg';

    modalBody.innerHTML = `
        <div class="modal-cover-image text-center">
            <img src="${coverImageSrc}" alt="Book Cover" style="height: 150px; width: 100px; object-fit: cover;">
        </div>
        <p>Author: ${bookDetails.author}</p>
        <p>Publisher: ${bookDetails.publisher}</p>
        <p>ISBN: ${bookDetails.isbn}</p>
        <p>Publication Year: ${bookDetails.publicationYear}</p>
        <p>Description: ${bookDetails.description}</p>
        <p>Price: $${bookDetails.price}</p>
    `;

    modalFooter.innerHTML = `
        <button id="btn-edit" class="btn btn-primary edit-btn" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Edit</button>
        <button id="btn-delete" class="btn btn-danger delete-btn">Delete</button>
    `;

    // Add event listeners for the edit and delete buttons inside the modal
    modalFooter.querySelector('.edit-btn').addEventListener('click', () => editCard(cardElement, bookDetails));
    modalFooter.querySelector('.delete-btn').addEventListener('click', () => deleteCard(cardElement));
}

function editCard(card, bookDetails) {
    // Populate the modal with existing book details
    document.getElementById('book-input').value = bookDetails.title;
    document.getElementById('author-input').value = bookDetails.author;
    document.getElementById('publisher-input').value = bookDetails.publisher;
    document.getElementById('ISBN-input').value = bookDetails.isbn;
    document.getElementById('pubyear-input').value = bookDetails.publicationYear;
    document.getElementById('desc-input').value = bookDetails.description;
    document.getElementById('price-input').value = bookDetails.price;

    // Update the modal button to "Save Changes"
    const addBookButton = document.getElementById('btn-addbook');
    addBookButton.textContent = 'Save Changes';

    // Ensure no multiple event listeners are added
    addBookButton.removeEventListener('click', handleSaveChanges);
    addBookButton.addEventListener('click', handleSaveChanges);

    function handleSaveChanges() {
        // Update the bookDetails object with new values from the form
        bookDetails.title = document.getElementById('book-input').value;
        bookDetails.author = document.getElementById('author-input').value;
        bookDetails.publisher = document.getElementById('publisher-input').value;
        bookDetails.isbn = document.getElementById('ISBN-input').value;
        bookDetails.publicationYear = document.getElementById('pubyear-input').value;
        bookDetails.description = document.getElementById('desc-input').value;
        bookDetails.price = document.getElementById('price-input').value;

        const newCoverFile = document.getElementById('cover-input').files[0];
        if (newCoverFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                card.querySelector('.card-img img').src = e.target.result;
                card.querySelector('.card-img img').alt = 'Book Cover';
                bookDetails.coverFile = newCoverFile;
                bookDetails.coverFileName = newCoverFile.name;
            };
            reader.readAsDataURL(newCoverFile);
        }

        // Update the card display with the new title and author
        card.querySelector('.card-title').textContent = bookDetails.title.replace(/\b\w/g, char => char.toUpperCase());
        card.querySelector('.card-text').innerHTML = `
            Author: ${bookDetails.author}<br>
            Price: $${bookDetails.price}<br>
            <button id="btn-expand" class="btn btn-primary btn-sm expand-btn" data-bs-toggle="modal" data-bs-target="#expandModal">
                <i class="fa fa-expand" aria-hidden="true"></i>
            </button>
        `;

        // Update the book in the global array
        const bookIndex = books.findIndex(b => b.isbn === bookDetails.isbn);
        if (bookIndex !== -1) {
            books[bookIndex] = bookDetails;
        }

        // Re-attach event listeners to the updated buttons
        card.querySelector('.expand-btn').addEventListener('click', () => expandCard(bookDetails, card));

        // Reset the modal button to its original state
        addBookButton.textContent = 'Add Book';
        addBookButton.removeEventListener('click', handleSaveChanges);
        addBookButton.addEventListener('click', addBook);

        // Close the modal
        document.getElementById('btn-close').click();

        clearInputs();
    }
}


function clearInputs() {
    const inputFields = ['book-input', 'author-input', 'publisher-input', 'ISBN-input', 'pubyear-input', 'desc-input', 'price-input', 'cover-input'];
    inputFields.forEach(id => document.getElementById(id).value = '');
}

function deleteCard(card) {
    card.remove();
    books = books.filter(b => b !== card);
}
