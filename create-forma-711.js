const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Конфигурация формы
const form = {
    id: '7-11',
    title: 'Форма 7.11 - Сопротивление сцены — не знак ошибки, а подтверждение частоты',
    lines: [
        'Таро — это память сцены, но не путь частоты',
        'Расклад мёртв, если реальность живая',
        'Не карта, а сцепка. Не жребий, а шаг'
    ],
    background: 'https://images.unsplash.com/photo-1501139083538-0139583c060f'
};

// Функция для создания HTML страницы
function createHTML(form) {
    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${form.title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: "Georgia", "Times New Roman", serif;
            background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${form.background}");
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            min-height: 100vh;
            color: #ffffff;
            line-height: 1.8;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        
        .title {
            font-size: 2.5rem;
            margin-bottom: 50px;
            text-align: center;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            opacity: 0;
            animation: fadeIn 1s ease-out forwards;
        }
        
        .text-container {
            background: rgba(0, 0, 0, 0.6);
            padding: 40px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
            opacity: 0;
            animation: fadeIn 1s ease-out 0.5s forwards;
        }
        
        .line {
            font-size: 1.4rem;
            margin-bottom: 20px;
            opacity: 0;
            transform: translateY(20px);
            animation: slideUp 0.8s ease-out forwards;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .line:nth-child(1) { animation-delay: 0.8s; }
        .line:nth-child(2) { animation-delay: 1.0s; }
        .line:nth-child(3) { animation-delay: 1.2s; }
        
        @media (max-width: 768px) {
            .title {
                font-size: 2rem;
            }
            
            .line {
                font-size: 1.2rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="title">${form.title}</h1>
        <div class="text-container">
            ${form.lines.map(line => `<div class="line">${line}</div>`).join('\n            ')}
        </div>
    </div>
</body>
</html>`;
}

// Функция для создания репозитория и публикации формы
async function createForm(form) {
    const repoName = `forma-${form.id}-${form.title.toLowerCase().replace(/[^a-zа-яё0-9]+/g, '-')}`;
    const repoPath = path.join(process.cwd(), repoName);
    
    console.log(`📝 Создаём форму ${form.id}...`);
    
    try {
        // Создаём директорию
        if (fs.existsSync(repoPath)) {
            fs.rmSync(repoPath, { recursive: true, force: true });
        }
        fs.mkdirSync(repoPath, { recursive: true });
        
        // Создаём HTML файл
        const html = createHTML(form);
        fs.writeFileSync(path.join(repoPath, 'index.html'), html);
        
        // Инициализируем Git
        execSync('git init', { cwd: repoPath });
        execSync('git branch -M main', { cwd: repoPath });
        execSync(`git remote add origin https://github.com/sergei9-hub/${repoName}.git`, { cwd: repoPath });
        execSync('git add .', { cwd: repoPath });
        execSync('git commit -m "Создание формы"', { cwd: repoPath });
        execSync('git push -u origin main --force', { cwd: repoPath });
        
        console.log(`✅ Форма ${form.id} создана успешно!`);
        console.log(`🌐 Страница будет доступна: https://sergei9-hub.github.io/${repoName}/`);
        
        return true;
    } catch (error) {
        console.error(`❌ Ошибка при создании формы ${form.id}:`, error);
        return false;
    }
}

// Запускаем создание формы
createForm(form).catch(console.error);
