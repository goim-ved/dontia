const themeToggle = document.getElementById('theme-toggle');
const loadBtn = document.getElementById('load-btn');
const flashcardsWrapper = document.getElementById('flashcards-wrapper');
const loadingAnimation = document.querySelector('.loading-animation');

const theme = {
    init() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.innerHTML = savedTheme === 'light'
            ? '<i class="fas fa-moon"></i>'
            : '<i class="fas fa-sun"></i>';
    },
    toggle() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.innerHTML = newTheme === 'light'
            ? '<i class="fas fa-moon"></i>'
            : '<i class="fas fa-sun"></i>';
    }
};

const ui = {
    setLoading(isLoading) {
        loadingAnimation.classList.toggle('hidden', !isLoading);
        loadBtn.disabled = isLoading;
        loadBtn.innerHTML = isLoading 
            ? '<i class="fas fa-spinner fa-spin"></i>'
            : '<span>Charger 3 Flashcards</span><i class="fas fa-folder-open"></i>';
    },
    showError(message) {
        flashcardsWrapper.innerHTML = `
            <div class="placeholder-message" style="color: #ef4444;">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
            </div>
        `;
    }
};

let allFlashcards = [];
let currentIndex = 0;

const flashcards = {
    async load() {
        try {
            ui.setLoading(true);
            if (allFlashcards.length === 0) {
                const response = await fetch('flashcards.json');
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error fetching flashcards JSON:', errorText);
                    throw new Error('Failed to load flashcards data.');
                }
                const data = await response.json();
                allFlashcards = data;
                allFlashcards.sort(() => 0.5 - Math.random());
                currentIndex = 0;
            }
            return allFlashcards;
        } catch (error) {
            console.error('Error loading flashcards:', error);
            throw new Error('Failed to load flashcards. Please try again later.');
        } finally {
            ui.setLoading(false);
        }
    },
    renderThree() {
        flashcardsWrapper.innerHTML = '';
        if (allFlashcards.length === 0) {
            flashcardsWrapper.innerHTML = `
                <div class="placeholder-message" style="color: #ef4444;">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Aucune flashcard disponible. Veuillez réessayer.</p>
                </div>
            `;
            return;
        }
        if (currentIndex >= allFlashcards.length) {
            allFlashcards.sort(() => 0.5 - Math.random());
            currentIndex = 0;
        }
        const selected = allFlashcards.slice(currentIndex, currentIndex + 3);
        currentIndex += 3;
        selected.forEach((card, index) => {
            const flashcard = document.createElement('div');
            flashcard.className = 'flashcard';
            flashcard.innerHTML = `
                <div class="flashcard-inner">
                    <div class="flashcard-front">
                        <p>${card.question}</p>
                    </div>
                    <div class="flashcard-back">
                        <p>${card.answer}</p>
                    </div>
                </div>
            `;
            flashcard.addEventListener('click', () => {
                flashcard.classList.toggle('flipped');
            });
            flashcard.style.opacity = '0';
            flashcard.style.transform = 'translateY(20px)';
            flashcardsWrapper.appendChild(flashcard);
            setTimeout(() => {
                flashcard.style.transition = 'all 0.5s ease';
                flashcard.style.opacity = '1';
                flashcard.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    theme.init();
});
themeToggle.addEventListener('click', () => {
    theme.toggle();
});
loadBtn.addEventListener('click', async () => {
    try {
        await flashcards.load();
        flashcards.renderThree();
    } catch (error) {
        ui.showError(error.message);
    }
});
