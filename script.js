// Calcula os dias juntos desde o início do relacionamento
function calculateDaysTogether() {
    try {
        const startDate = new Date('2024-09-13T00:00:00-03:00');
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        document.getElementById('days-count').textContent = diffDays;
    } catch (error) {
        console.error('Erro ao calcular os dias:', error);
    }
}

// Calcula os meses juntos para a mensagem de marco
function calculateMonthsTogether(pageDate) {
    try {
        const startDate = new Date('2024-09-13T00:00:00-03:00');
        const yearDiff = pageDate.getFullYear() - startDate.getFullYear();
        const monthDiff = pageDate.getMonth() - startDate.getMonth();
        let months = yearDiff * 12 + monthDiff;
        if (pageDate.getDate() >= 14) {
            return months + 1;
        }
        return months;
    } catch (error) {
        console.error('Erro ao calcular os meses:', error);
        return 0;
    }
}

// Verifica se uma página está bloqueada com base na data (exceto Carta 5)
function isPageLocked(page, index) {
    try {
        // Carta 5 (índice 4) é tratada separadamente com senha
        if (index === 4) return false;

        const dateElement = page.querySelector('.date');
        if (!dateElement) return false;
        const dateText = dateElement.textContent.trim();
        const [day, month, year] = dateText.split('/').map(Number);
        const pageDate = new Date(year, month - 1, day);
        const currentDate = new Date();
        currentDate.setUTCHours(0, 0, 0, 0);

        // Cartas a partir da Carta 6 (índice 5, 14/07/2025) estão bloqueadas até o dia 14 do mês correspondente
        if (index >= 5) {
            if (
                currentDate.getFullYear() < year ||
                (currentDate.getFullYear() === year && currentDate.getMonth() < month - 1) ||
                (currentDate.getFullYear() === year && currentDate.getMonth() === month - 1 && currentDate.getDate() < 14)
            ) {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('Erro ao verificar bloqueio da página:', error);
        return false;
    }
}

// Verifica se a Carta 5 está bloqueada com senha
function isCarta5Locked(page, index) {
    try {
        if (index !== 4) return false;
        const pageContent = page.querySelector('.page-content');
        // Se a classe 'locked' estiver presente, a carta está bloqueada
        return pageContent.classList.contains('locked');
    } catch (error) {
        console.error('Erro ao verificar bloqueio da Carta 5:', error);
        return false;
    }
}

// Atualiza o contador de tempo para páginas bloqueadas (exceto Carta 5)
function updateCountdown(page, index) {
    try {
        if (index === 4) return;

        const dateElement = page.querySelector('.date');
        const countdownElement = page.querySelector(`#countdown-${index} .timer`);
        const milestoneMessage = page.querySelector('.milestone-message');
        const monthCount = page.querySelector('.month-count');
        const unlockSection = page.querySelector('.unlock-section');

        if (!dateElement || !countdownElement) return;

        const dateText = dateElement.textContent.trim();
        const [day, month, year] = dateText.split('/').map(Number);
        const unlockDate = new Date(year, month - 1, 14);
        unlockDate.setUTCHours(0, 0, 0, 0);
        const currentDate = new Date();
        currentDate.setUTCHours(0, 0, 0, 0);

        if (currentDate < unlockDate) {
            const timeLeft = unlockDate - currentDate;
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            countdownElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
            if (milestoneMessage) milestoneMessage.classList.add('hidden');
            if (unlockSection) unlockSection.classList.add('hidden');
        } else {
            countdownElement.textContent = 'Chegou o dia!';
            if (milestoneMessage) milestoneMessage.classList.remove('hidden');
            if (monthCount) monthCount.textContent = calculateMonthsTogether(new Date(year, month - 1, day));
            if (unlockSection) unlockSection.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Erro ao atualizar o contador:', error);
    }
}

// Verifica a senha do enigma do Dia dos Namorados para a Carta 5
function checkDiaDosNamoradosPassword(button) {
    try {
        const unlockSection = button.parentElement;
        const input = unlockSection.querySelector('.unlock-input');
        const pageContent = unlockSection.closest('.page-content');
        const answer = input.value.trim().toLowerCase();
        const correctAnswer = 'florcartachocolate';

        if (answer === correctAnswer) {
            pageContent.classList.remove('locked');
            const comingSoonCard = pageContent.querySelector('.coming-soon-card');
            if (comingSoonCard) comingSoonCard.classList.add('hidden');
            // Forçar a atualização da página para garantir que o conteúdo seja exibido
            const pageIndex = parseInt(pageContent.closest('.page').id.split('-')[1]);
            showPage(pageIndex);
        } else {
            alert('Tente novamente, Juju! Dica: Siga a ordem dos emojis 🌸💌🍫 e junte as palavras sem espaços! 💕');
            input.value = '';
        }
    } catch (error) {
        console.error('Erro ao verificar a senha do Dia dos Namorados:', error);
    }
}

// Verifica a resposta do enigma para outras páginas
function checkUnlock(button) {
    try {
        const unlockSection = button.parentElement;
        const input = unlockSection.querySelector('.unlock-input');
        const pageContent = unlockSection.closest('.page-content');
        const answer = input.value.trim().toLowerCase();
        const correctAnswer = 'nosso amor';

        if (answer === correctAnswer) {
            pageContent.classList.remove('locked');
            const comingSoonCard = pageContent.querySelector('.coming-soon-card');
            if (comingSoonCard) comingSoonCard.classList.add('hidden');
            // Forçar a atualização da página
            const pageIndex = parseInt(pageContent.closest('.page').id.split('-')[1]);
            showPage(pageIndex);
        } else {
            alert('Tente novamente, Juju! Dica: É o que nos une para sempre! 💕');
            input.value = '';
        }
    } catch (error) {
        console.error('Erro ao verificar o desbloqueio:', error);
    }
}

// Mostra o livro e esconde a capa
function openBook() {
    try {
        const bookCover = document.querySelector('.book-cover');
        const book = document.getElementById('book');
        if (bookCover && book) {
            bookCover.classList.add('hidden');
            book.classList.remove('hidden');
            showPage(0);
        } else {
            console.error('Capa ou seção do livro não encontrada');
        }
    } catch (error) {
        console.error('Erro ao abrir o livro:', error);
    }
}

// Alterna entre ler mais e ler menos
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
        console.error('Erro ao alternar ler mais/menos:', error);
    }
}

// Funcionalidade de carrossel
let currentPage = 0;
let pages;

function showPage(index) {
    try {
        pages.forEach((page, i) => {
            const pageContent = page.querySelector('.page-content');
            const comingSoonCard = page.querySelector('.coming-soon-card');

            if (i === index) {
                page.classList.add('active');
                page.classList.remove('hidden');
                if (i === 4) {
                    // Carta 5: Verifica se está bloqueada
                    if (isCarta5Locked(page, i)) {
                        pageContent.classList.add('locked'); // Garante que a classe 'locked' esteja presente
                        if (comingSoonCard) {
                            comingSoonCard.classList.remove('hidden');
                            const countdown = comingSoonCard.querySelector('.countdown');
                            const milestoneMessage = comingSoonCard.querySelector('.milestone-message');
                            const unlockSection = comingSoonCard.querySelector('.unlock-section');
                            if (countdown) countdown.classList.add('hidden');
                            if (milestoneMessage) milestoneMessage.classList.add('hidden');
                            // Garante que a seção de desbloqueio esteja visível
                            if (unlockSection) {
                                unlockSection.classList.remove('hidden');
                                // Força a visibilidade com CSS direto para depuração
                                unlockSection.style.display = 'block';
                            }
                        }
                    } else {
                        // Carta 5 desbloqueada: Mostra o conteúdo
                        pageContent.classList.remove('locked');
                        if (comingSoonCard) comingSoonCard.classList.add('hidden');
                        const textContents = page.querySelectorAll('.text-content');
                        textContents.forEach(content => {
                            content.classList.add('truncated');
                            const button = content.nextElementSibling;
                            if (button && button.classList.contains('read-more-btn')) {
                                button.textContent = 'Ler Mais';
                            }
                        });
                    }
                } else if (isPageLocked(page, i)) {
                    // Outras páginas bloqueadas (Carta 6+): Mostra o contador
                    pageContent.classList.add('locked');
                    if (comingSoonCard) comingSoonCard.classList.remove('hidden');
                    updateCountdown(page, i);
                } else {
                    // Páginas desbloqueadas
                    pageContent.classList.remove('locked');
                    if (comingSoonCard) comingSoonCard.classList.add('hidden');
                    const textContents = page.querySelectorAll('.text-content');
                    textContents.forEach(content => {
                        content.classList.add('truncated');
                        const button = content.nextElementSibling;
                        if (button && button.classList.contains('read-more-btn')) {
                            button.textContent = 'Ler Mais';
                        }
                    });
                }
            } else {
                page.classList.remove('active');
                page.classList.add('hidden');
                if (comingSoonCard) comingSoonCard.classList.add('hidden');
            }
        });
        const prevButton = document.querySelector('.prev-page');
        const nextButton = document.querySelector('.next-page');
        if (prevButton && nextButton) {
            prevButton.style.display = index === 0 ? 'none' : 'block';
            nextButton.style.display = index === pages.length - 1 ? 'none' : 'block';
        }
    } catch (error) {
        console.error('Erro ao mostrar a página:', error);
    }
}

function nextPage() {
    try {
        if (currentPage < pages.length - 1) {
            currentPage++;
            showPage(currentPage);
        }
    } catch (error) {
        console.error('Erro ao avançar a página:', error);
    }
}

function prevPage() {
    try {
        if (currentPage > 0) {
            currentPage--;
            showPage(currentPage);
        }
    } catch (error) {
        console.error('Erro ao voltar a página:', error);
    }
}

// Atualiza os contadores de tempo a cada segundo (exceto Carta 5)
function startCountdowns() {
    try {
        setInterval(() => {
            pages.forEach((page, i) => {
                if (i !== 4 && isPageLocked(page, i)) {
                    updateCountdown(page, i);
                }
            });
        }, 1000);
    } catch (error) {
        console.error('Erro ao iniciar os contadores:', error);
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    try {
        pages = document.querySelectorAll('.page');
        // Bloqueia a Carta 5 inicialmente
        const carta5 = pages[4];
        if (carta5) {
            const pageContent = carta5.querySelector('.page-content');
            pageContent.classList.add('locked'); // Garante que a Carta 5 comece bloqueada
        }
        calculateDaysTogether();
        showPage(currentPage);
        startCountdowns();
    } catch (error) {
        console.error('Erro na inicialização:', error);
    }
});