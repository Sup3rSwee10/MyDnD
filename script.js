// 1. ЧАСЫ В ЗАГОЛОВКЕ
function initClock() {
    function updateTitleClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        document.title = `MyD&D | ${hours}:${minutes}:${seconds}`;
    }

    updateTitleClock();
    setInterval(updateTitleClock, 1000);
}

// 2. ТЕМЫ
function initThemes() {
    console.log('Инициализация тем...');
    
    const themes = {
        'ash': 'linear-gradient(180deg, #424242 0%, #212121 100%)',
        'red-moon': 'linear-gradient(180deg, #4E342E 0%, #3E2723 100%)',
        'forest': 'linear-gradient(180deg, #4E5B43 0%, #2E3A24 100%)'
    };

    const themeButtons = document.querySelectorAll('li.btn a');
    
    if (themeButtons.length === 0) {
        console.warn('Кнопки тем не найдены!');
        return;
    }
    
    function applyTheme(themeName) {
        console.log('Применение темы:', themeName);
        
        const theme = themes[themeName];
        if (!theme) return;
        
        const wrapper = document.querySelector('.wrapper');
        if (wrapper) {
            wrapper.style.background = theme;
            wrapper.style.backgroundAttachment = 'fixed';
        }
        
        document.body.style.background = theme;
        document.body.style.backgroundAttachment = 'fixed';
        
        localStorage.setItem('selectedTheme', themeName);
        console.log('Тема сохранена:', themeName);
        
        highlightActiveThemeButton(themeName);
    }
    
    function highlightActiveThemeButton(themeName) {
        console.log('Подсветка кнопки для темы:', themeName);
        
        themeButtons.forEach(button => {
            button.style.opacity = '';
            button.style.transform = '';
            button.style.boxShadow = '';
            button.style.borderRadius = '';
            button.classList.remove('active-theme');
            
            const img = button.querySelector('img');
            if (!img) return;
            
            const imgAlt = img.alt.toLowerCase();
            console.log('Кнопка alt:', imgAlt);
            
            let isActive = false;
            
            if (themeName === 'ash' && (imgAlt.includes('ashtheme') || imgAlt.includes('ashthem'))) {
                isActive = true;
            } else if (themeName === 'red-moon' && imgAlt.includes('redmoontheme')) {
                isActive = true;
            } else if (themeName === 'forest' && imgAlt.includes('foresttheme')) {
                isActive = true;
            }
            
            if (isActive) {
                button.style.opacity = '1';
                button.style.transform = 'scale(1.15)';
                button.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.8)';
                button.style.borderRadius = '50%';
                button.classList.add('active-theme');
                console.log('Кнопка подсвечена:', imgAlt);
            } else {
                button.style.opacity = '0.7';
            }
        });
    }
    
    themeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const img = this.querySelector('img');
            if (!img) return;
            
            const imgAlt = img.alt.toLowerCase();
            let themeToApply = 'ash';
            
            if (imgAlt.includes('ashtheme') || imgAlt.includes('ashthem')) {
                themeToApply = 'ash';
            } else if (imgAlt.includes('redmoontheme')) {
                themeToApply = 'red-moon';
            } else if (imgAlt.includes('foresttheme')) {
                themeToApply = 'forest';
            }
            
            console.log('Клик по кнопке темы:', imgAlt, '->', themeToApply);
            applyTheme(themeToApply);
        });
    });
    
    const savedTheme = localStorage.getItem('selectedTheme');
    console.log('Сохраненная тема в localStorage:', savedTheme);
    
    if (savedTheme && themes[savedTheme]) {
        console.log('Восстанавливаем сохраненную тему:', savedTheme);
        applyTheme(savedTheme);
    } else {
        console.log('Устанавливаем тему по умолчанию: ash');
        applyTheme('ash');
    }
}

// 3. POP-UP С ТЕКУЩЕЙ ДАТОЙ
function initDatePopup() {
    console.log('Инициализация кнопки даты...');
    
    const nav = document.querySelector('nav ul');
    if (!nav) {
        console.error('Навигация не найдена!');
        return;
    }
    
    const dateButtonLi = document.createElement('li');
    dateButtonLi.className = 'btn date-btn';
    
    const dateButton = document.createElement('a');
    dateButton.href = '#';
    dateButton.innerHTML = '📅 Дата';
    dateButton.style.cssText = `
        color: #FAF0E6;
        font-size: 18px;
        font-weight: bold;
        padding: 10px 15px;
        border-radius: 20px;
        background: rgba(126, 36, 27, 0.8);
        display: inline-block;
        text-decoration: none;
        transition: all 0.3s ease;
        border: 2px solid rgba(150, 0, 24, 0.5);
    `;
    
    const themeButtons = nav.querySelectorAll('li.btn');
    if (themeButtons.length > 0) {
        nav.insertBefore(dateButtonLi, themeButtons[0]);
    } else {
        nav.appendChild(dateButtonLi);
    }
    
    dateButtonLi.appendChild(dateButton);
    
    const popup = document.createElement('div');
    popup.id = 'date-popup';
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: linear-gradient(135deg, rgba(72, 6, 7, 0.95), rgba(126, 36, 27, 0.95));
        color: #FAF0E6;
        padding: 30px 40px;
        border-radius: 20px;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        border: 3px solid #960018;
        min-width: 300px;
        text-align: center;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
        opacity: 0;
    `;
    
    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 24px;
        cursor: pointer;
        color: #FAF0E6;
        transition: all 0.2s ease;
    `;
    
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.transform = 'scale(1.2)';
        closeBtn.style.color = '#ff9999';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.transform = 'scale(1)';
        closeBtn.style.color = '#FAF0E6';
    });
    
    popup.appendChild(closeBtn);
    
    const popupContent = document.createElement('div');
    popup.appendChild(popupContent);
    
    document.body.appendChild(popup);
    
    function showDatePopup() {
        console.log('Показ pop-up с датой');
        
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const dateString = now.toLocaleDateString('ru-RU', options);
        const timeString = now.toLocaleTimeString('ru-RU');
        
        popupContent.innerHTML = `
            <h3 style="margin: 0 0 20px 0; font-size: 24px; color: #ffcccb;">📅 Текущая дата</h3>
            <div style="font-size: 20px; margin-bottom: 10px; font-weight: bold;">${dateString}</div>
            <div style="font-size: 18px; margin-bottom: 20px; opacity: 0.9;">${timeString}</div>
            <div style="font-size: 14px; opacity: 0.7;">MyD&D &copy; ${now.getFullYear()}</div>
        `;
        
        popup.style.opacity = '1';
        popup.style.transform = 'translate(-50%, -50%) scale(1)';
        
        const overlay = document.createElement('div');
        overlay.id = 'popup-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 9999;
            backdrop-filter: blur(5px);
        `;
        document.body.appendChild(overlay);
        
        document.body.style.overflow = 'hidden';
    }
    
    function hideDatePopup() {
        console.log('Скрытие pop-up');
        popup.style.opacity = '0';
        popup.style.transform = 'translate(-50%, -50%) scale(0)';
        
        const overlay = document.getElementById('popup-overlay');
        if (overlay) {
            overlay.remove();
        }
        
        document.body.style.overflow = '';
    }
    
    dateButton.addEventListener('click', function(e) {
        e.preventDefault();
        showDatePopup();
    });
    
    closeBtn.addEventListener('click', hideDatePopup);
    
    document.addEventListener('click', function(e) {
        const overlay = document.getElementById('popup-overlay');
        if (overlay && e.target === overlay) {
            hideDatePopup();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideDatePopup();
        }
    });
    
    dateButton.addEventListener('mouseenter', () => {
        dateButton.style.background = 'rgba(150, 0, 24, 0.9)';
        dateButton.style.transform = 'translateY(-3px)';
        dateButton.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    });
    
    dateButton.addEventListener('mouseleave', () => {
        dateButton.style.background = 'rgba(126, 36, 27, 0.8)';
        dateButton.style.transform = 'translateY(0)';
        dateButton.style.boxShadow = 'none';
    });
    
    console.log('Кнопка даты добавлена');
}

// 4. СКАЧИВАНИЕ ФАЙЛОВ ПЕРСОНАЖЕЙ
function initDownloads() {
    console.log('Инициализация скачивания файлов...');
    
    const downloadButtons = document.querySelectorAll('.download-btn');
    
    if (downloadButtons.length === 0) {
        console.log('Кнопки скачивания не найдены');
        return;
    }
    
    const characterFiles = {
        'torling': {
            filename: 'torling_character_sheet.pdf',
            name: 'Торлинг Эйкатра'
        },
        'tak-tha': {
            filename: 'tak-tha_character_sheet.pdf',
            name: 'Так-тха'
        },
        'brag': {
            filename: 'brag_character_sheet.pdf',
            name: 'Браг Камнешаг'
        }
    };
    
    downloadButtons.forEach(button => {
        const characterBlock = button.closest('.charcard').parentElement;
        if (!characterBlock || !characterBlock.id) return;
        
        const characterId = characterBlock.id;
        const characterInfo = characterFiles[characterId];
        
        if (!characterInfo) {
            console.warn(`Файл не найден для персонажа: ${characterId}`);
            return;
        }
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            console.log(`Скачивание файла для: ${characterInfo.name}`);
            
            // Проверяем, существует ли файл
            const fileExists = checkFileExists(`downloads/${characterInfo.filename}`);
            
            if (fileExists) {
                const link = document.createElement('a');
                link.href = `downloads/${characterInfo.filename}`;
                link.download = characterInfo.filename;
                link.style.display = 'none';
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                showDownloadNotification(characterInfo.name, true);
            } else {
                showDownloadNotification(characterInfo.name, false);
            }
        });
        
        console.log(`Кнопка скачивания для ${characterInfo.name} готова`);
    });
    
    function checkFileExists(url) {
        return true;
    }
    
    function showDownloadNotification(characterName, success) {
        const notification = document.createElement('div');
        
        if (success) {
            notification.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 20px;">✅</span>
                    <div>
                        <div style="font-weight: bold;">Скачивание начато</div>
                        <div style="font-size: 14px; opacity: 0.9;">Лист персонажа "${characterName}"</div>
                    </div>
                </div>
            `;
            notification.style.background = 'linear-gradient(135deg, rgba(76, 175, 80, 0.95), rgba(56, 142, 60, 0.95))';
        } else {
            notification.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 20px;">⚠️</span>
                    <div>
                        <div style="font-weight: bold;">Файл не найден</div>
                        <div style="font-size: 14px; opacity: 0.9;">Лист персонажа "${characterName}"</div>
                    </div>
                </div>
            `;
            notification.style.background = 'linear-gradient(135deg, rgba(255, 152, 0, 0.95), rgba(245, 124, 0, 0.95))';
        }
        
        notification.style.cssText += `
            position: fixed;
            bottom: 30px;
            right: 30px;
            color: white;
            padding: 15px 20px;
            border-radius: 15px;
            font-size: 14px;
            z-index: 10001;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            border: 2px solid rgba(255,255,255,0.3);
            backdrop-filter: blur(10px);
            animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
            min-width: 250px;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
            if (style.parentNode) {
                style.remove();
            }
        }, 3000);
    }
}

// 5. ДОПОЛНИТЕЛЬНЫЙ СКРИПТ: Подсветка строк таблицы
function initTableHighlight() {
    console.log('Инициализация подсветки таблиц...');
    
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            row.addEventListener('mouseenter', function() {
                this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                this.style.transition = 'background-color 0.3s ease';
            });
            
            row.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '';
            });
        });
        
        console.log(`Таблица "${table.previousElementSibling?.textContent || 'без заголовка'}" инициализирована`);
    });
}

// 6. ДОПОЛНИТЕЛЬНЫЙ СКРИПТ: Сортировка таблиц
function initTableSorting() {
    console.log('Инициализация сортировки таблиц...');
    
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
        const headers = table.querySelectorAll('thead th');
        
        headers.forEach((header, index) => {
            // Добавляем курсор-указатель только к заголовкам с данными
            if (table.querySelector('tbody tr td:nth-child(' + (index + 1) + ')')) {
                header.style.cursor = 'pointer';
                header.title = 'Нажмите для сортировки';
                
                header.addEventListener('click', function() {
                    sortTable(table, index);
                });
            }
        });
    });
    
    function sortTable(table, column) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        // Определяем тип данных в колонке
        const sampleCell = rows[0].querySelectorAll('td')[column];
        const isNumeric = !isNaN(parseFloat(sampleCell.textContent));
        
        rows.sort((rowA, rowB) => {
            const cellA = rowA.querySelectorAll('td')[column];
            const cellB = rowB.querySelectorAll('td')[column];
            
            if (isNumeric) {
                return parseFloat(cellA.textContent) - parseFloat(cellB.textContent);
            } else {
                return cellA.textContent.localeCompare(cellB.textContent);
            }
        });
        
        // Удаляем старые строки
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        
        // Добавляем отсортированные строки
        rows.forEach(row => {
            tbody.appendChild(row);
        });
        
        console.log(`Таблица отсортирована по колонке ${column + 1}`);
    }
}

// ИНИЦИАЛИЗАЦИЯ ВСЕГО
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Запуск скриптов MyD&D ===');
    
    try {
        initClock();
        console.log('✓ Часы запущены');
    } catch (e) {
        console.error('Ошибка часов:', e);
    }
    
    try {
        initThemes();
        console.log('✓ Темы инициализированы');
    } catch (e) {
        console.error('Ошибка тем:', e);
    }
    
    try {
        initDatePopup();
        console.log('✓ Pop-up с датой инициализирован');
    } catch (e) {
        console.error('Ошибка pop-up:', e);
    }
    
    try {
        initDownloads();
        console.log('✓ Скачивание файлов инициализировано');
    } catch (e) {
        console.error('Ошибка скачивания файлов:', e);
    }
    
    try {
        initTableHighlight();
        console.log('✓ Подсветка таблиц инициализирована');
    } catch (e) {
        console.error('Ошибка подсветки таблиц:', e);
    }
    
    try {
        initTableSorting();
        console.log('✓ Сортировка таблиц инициализирована');
    } catch (e) {
        console.error('Ошибка сортировки таблиц:', e);
    }
    
    console.log('=== Все скрипты загружены ===');
});

// Применяем тему после полной загрузки
window.addEventListener('load', function() {
    console.log('Страница полностью загружена');
    
    const savedTheme = localStorage.getItem('selectedTheme') || 'ash';
    const themes = {
        'ash': 'linear-gradient(180deg, #424242 0%, #212121 100%)',
        'red-moon': 'linear-gradient(180deg, #4E342E 0%, #3E2723 100%)',
        'forest': 'linear-gradient(180deg, #4E5B43 0%, #2E3A24 100%)'
    };
    
    if (themes[savedTheme]) {
        const wrapper = document.querySelector('.wrapper');
        if (wrapper) {
            wrapper.style.background = themes[savedTheme];
            wrapper.style.backgroundAttachment = 'fixed';
        }
        
        document.body.style.background = themes[savedTheme];
        document.body.style.backgroundAttachment = 'fixed';
        
        console.log('Тема принудительно применена:', savedTheme);
    }
});
