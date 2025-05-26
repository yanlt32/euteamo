// Calculate days together
function calculateDaysTogether() {
    try {
        const startDate = new Date('2024-09-13T00:00:00-03:00');
        const currentDate = new Date(); // Dynamically get the current date and time
        const diffTime = Math.abs(currentDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        document.getElementById('days-count').textContent = diffDays;
    } catch (error) {
        console.error('Error calculating days:', error);
    }
}

// Show book and hide cover
function openBook() {
    try {
        console.log('openBook called'); // Debug log
        const bookCover = document.querySelector('.book-cover');
        const book = document.getElementById('book');
        if (bookCover && book) {
            bookCover.classList.add('hidden');
            book.classList.remove('hidden');
            showPage(0); // Show first page
        } else {
            console.error('Book cover or book section not found');
        }
    } catch (error) {
        console.error('Error in openBook:', error);
    }
}

// Toggle read more/less
function toggleReadMore(button) {
    try {
        const textContent = button.previousElementSibling;
        if (textContent.classList.contains('truncated')) {
            textContent.classList.remove('truncated');
            button.textContent = 'Ler Menos';
        } else {
            textContent.classList.add('truncated');
            button.textContent = 'Ler Mais';
        }
    } catch (error) {
        console.error('Error in toggleReadMore:', error);
    }
}

// Carousel functionality
let currentPage = 0;
const pages = document.querySelectorAll('.page');

function showPage(index) {
    try {
        pages.forEach((page, i) => {
            if (i === index) {
                page.classList.add('active');
                page.classList.remove('hidden');
            } else {
                page.classList.remove('active');
                page.classList.add('hidden');
            }
        });
        // Update navigation button visibility
        const prevButton = document.querySelector('.prev-page');
        const nextButton = document.querySelector('.next-page');
        if (prevButton && nextButton) {
            prevButton.style.display = index === 0 ? 'none' : 'block';
            nextButton.style.display = index === pages.length - 1 ? 'none' : 'block';
        }
        // Reset "Ler Mais" state when switching pages
        const textContents = pages[index].querySelectorAll('.text-content');
        textContents.forEach(content => {
            content.classList.add('truncated');
            const button = content.nextElementSibling;
            if (button && button.classList.contains('read-more-btn')) {
                button.textContent = 'Ler Mais';
            }
        });
    } catch (error) {
        console.error('Error in showPage:', error);
    }
}

function nextPage() {
    try {
        if (currentPage < pages.length - 1) {
            currentPage++;
            showPage(currentPage);
        }
    } catch (error) {
        console.error('Error in nextPage:', error);
    }
}

function prevPage() {
    try {
        if (currentPage > 0) {
            currentPage--;
            showPage(currentPage);
        }
    } catch (error) {
        console.error('Error in prevPage:', error);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    try {
        calculateDaysTogether();
        showPage(currentPage); // Ensure initial page state
    } catch (error) {
        console.error('Error in initialization:', error);
    }
});