document.addEventListener('DOMContentLoaded', () => {
    
    // Elementos DOM
    const modal = document.getElementById('booking-modal');
    const openBtns = document.querySelectorAll('.open-modal');
    const closeBtn = document.querySelector('.close-btn');
    const timeGrid = document.getElementById('time-slots');
    const confirmBtn = document.getElementById('confirm-btn');
    
    let selectedTime = null;

    // --- Funções do Modal ---

    const openModal = () => {
        modal.classList.add('active');
        renderTimeSlots(); // Gera os horários sempre que abre
    };

    const closeModal = () => {
        modal.classList.remove('active');
        resetSelection();
    };

    // Event Listeners para abrir
    openBtns.forEach(btn => btn.addEventListener('click', openModal));

    // Event Listeners para fechar
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // --- Lógica de Horários (07:00 as 17:00) ---

    function renderTimeSlots() {
        timeGrid.innerHTML = ''; // Limpa slots anteriores
        const start = 7;
        const end = 17;

        for (let i = start; i <= end; i++) {
            const btn = document.createElement('button');
            const timeStr = `${i.toString().padStart(2, '0')}:00`;
            
            btn.classList.add('time-slot');
            btn.textContent = timeStr;
            
            // Evento de Seleção
            btn.addEventListener('click', () => selectSlot(btn, timeStr));
            
            timeGrid.appendChild(btn);
        }
    }

    function selectSlot(element, time) {
        // Remove 'selected' de todos
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });

        // Adiciona 'selected' ao clicado (Visual Rose Gold Sólido)
        element.classList.add('selected');
        
        selectedTime = time;
        
        // Habilita confirmação
        confirmBtn.disabled = false;
        confirmBtn.textContent = `Confirmar para às ${time}`;
    }

    function resetSelection() {
        selectedTime = null;
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Confirmar Horário';
    }

    // --- Ação Final ---
    confirmBtn.addEventListener('click', () => {
        if(selectedTime) {
            alert(`✨ Agendamento realizado com sucesso!\n\nHorário: ${selectedTime}\nMal podemos esperar para recebê-la.`);
            closeModal();
        }
    });
});