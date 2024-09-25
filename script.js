// 隨機打亂陣列的函數
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 動態生成卡牌數量和圖片路徑
const cardContainer = document.getElementById('cardContainer');
const timerDisplay = document.getElementById('timer');
const themeSelect = document.getElementById('themeSelect');

// 圖片路徑
const themes = {
    finger: [
        'images/picture1.jpg',
        'images/picture2.jpg',
        'images/picture3.jpg',
        'images/picture4.jpg',
        'images/picture5.jpg',
        'images/picture6.jpg',
        'images/picture7.jpg',
        'images/picture8.jpg'
    ],
    arabic: [
        'images/picture9.jpg',
        'images/picture10.jpg',
        'images/picture11.jpg',
        'images/picture12.jpg',
        'images/picture13.jpg',
        'images/picture14.jpg',
        'images/picture15.jpg',
        'images/picture16.jpg'
    ]
};

// 儲存所有卡牌元素
const cards = [];

// 跟蹤已翻開的卡牌
let firstCard = null;
let secondCard = null;

// 用於倒數計時的變數
let countdownInterval;
let countdown;

// 開始遊戲的功能
function startGame() {
    const selectedTheme = themeSelect.value;
    const cardImages = [...themes[selectedTheme], ...themes[selectedTheme]]; // 使用選擇的主題圖片
    shuffle(cardImages); // 打亂卡牌圖片的排列

    // 清空現有的卡牌
    cardContainer.innerHTML = '';
    cards.length = 0; // 清空卡牌數組

    // 清除舊的倒數計時器
    clearInterval(countdownInterval);
    countdown = 10; // 重置倒數
    timerDisplay.textContent = countdown; // 顯示倒數計時

    cardImages.forEach((imageSrc) => {
        // 創建卡片的元素
        const card = document.createElement('div');
        card.classList.add('card');
        cards.push(card); // 儲存卡牌以便後續操作
        
        // 創建卡片內部結構
        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');
        
        // 創建正面
        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        const frontImage = document.createElement('img');
        frontImage.src = 'images/picture17.jpg'; // 統一正面圖片
        frontImage.alt = 'Front Image';
        frontImage.classList.add('card-image');
        cardFront.appendChild(frontImage);
        
        // 創建背面
        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        const backImage = document.createElement('img');
        backImage.src = imageSrc; // 使用對應的背面圖片
        backImage.alt = `Back Image`;
        backImage.classList.add('card-image');
        cardBack.appendChild(backImage);
        
        // 組裝卡片
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        cardContainer.appendChild(card);
        
        // 添加翻轉功能（點擊翻轉）
        card.addEventListener('click', function () {
            if (!firstCard || !secondCard) { // 確保最多翻開兩張
                card.classList.toggle('flipped'); // 翻轉卡片
                if (!firstCard) {
                    firstCard = card; // 記錄第一張翻開的卡
                } else if (!secondCard && card !== firstCard) {
                    secondCard = card; // 記錄第二張翻開的卡
                    checkMatch(); // 檢查兩張卡是否匹配
                }
            }
        });
    });

    // 顯示所有卡片正面
    cards.forEach(card => card.classList.add('flipped')); // 顯示所有卡片的正面

    // 倒數10秒
    countdownInterval = setInterval(() => {
        countdown--;
        timerDisplay.textContent = countdown; // 更新顯示

        if (countdown <= 0) {
            clearInterval(countdownInterval); // 停止倒數
            cards.forEach(card => card.classList.remove('flipped')); // 全部翻到背面
            firstCard = null; // 重置已翻開的卡牌
            secondCard = null;
        }
    }, 1000); // 每秒更新
}

// 檢查是否匹配的函數
function checkMatch() {
    setTimeout(() => {
        if (firstCard.querySelector('.card-back img').src === secondCard.querySelector('.card-back img').src) {
            // 如果匹配則保持翻面
            firstCard = null;
            secondCard = null; // 重置已翻開的卡牌
            checkGameOver(); // 檢查遊戲是否結束
        } else {
            // 如果不匹配則翻回背面
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                firstCard = null;
                secondCard = null; // 重置已翻開的卡牌
            }, 200); // 0.2秒後翻回
        }
    }, 1000); // 1秒後檢查
}

// 檢查遊戲是否結束
function checkGameOver() {
    const allFlipped = cards.every(card => card.classList.contains('flipped')); // 檢查所有卡片是否都翻到正面
    if (allFlipped) {
        setTimeout(() => {
            alert("恭喜!!你贏了!!"); // 彈出窗口顯示贏得的消息
        }, 500); // 稍微延遲以便用戶能夠看到匹配
    }
}

// 監聽主題變更
themeSelect.addEventListener('change', function () {
    startGame(); // 變更主題時重新開始遊戲
});

// 開始遊戲按鈕
document.getElementById('startGame').addEventListener('click', startGame);

// 全部翻到正面按鈕功能
document.getElementById('flipAllFront').addEventListener('click', function () {
    cards.forEach(card => card.classList.add('flipped'));
});

// 全部翻到背面按鈕功能
document.getElementById('flipAllBack').addEventListener('click', function () {
    cards.forEach(card => card.classList.remove('flipped'));
});
