// 學期切換功能
document.addEventListener('DOMContentLoaded', function() {
    const semesterButtons = document.querySelectorAll('.semester-btn');
    const semesterContents = document.querySelectorAll('.semester-content');
    
    // 學期數據
    const semesterData = {
        1: { credits: 13, courses: 5 },
        2: { credits: 12, courses: 5 },
        3: { credits: 13, courses: 6 },
        4: { credits: 10, courses: 4 }
    };

    // 初始化頁面
    function initializePage() {
        // 設置初始總學分
        updateTotalCredits();
        
        // 添加課程卡片的交錯動畫
        addStaggeredAnimation();
        
        // 添加滾動效果
        addScrollEffects();
    }

    // 學期切換功能
    function switchSemester(targetSemester) {
        // 移除所有按鈕的 active 狀態
        semesterButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 隱藏所有學期內容
        semesterContents.forEach(content => {
            content.classList.remove('active');
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px)';
        });
        
        // 添加按鈕 active 狀態
        const activeButton = document.querySelector(`[data-semester="${targetSemester}"]`);
        activeButton.classList.add('active');
        
        // 延遲顯示目標學期內容，創造平滑過渡效果
        setTimeout(() => {
            const targetContent = document.getElementById(`semester-${targetSemester}`);
            targetContent.classList.add('active');
            targetContent.style.opacity = '1';
            targetContent.style.transform = 'translateY(0)';
            
            // 重新觸發課程卡片動畫
            animateCourseCards(targetContent);
            
            // 重新觸發進度條動畫
            animateProgressBar(targetContent);
            
        }, 200);
    }

    // 課程卡片交錯動畫
    function animateCourseCards(container) {
        const courseCards = container.querySelectorAll('.course-card');
        courseCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // 進度條動畫
    function animateProgressBar(container) {
        const progressFill = container.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = '0%';
            setTimeout(() => {
                progressFill.style.transition = 'width 1s ease-out';
                progressFill.style.width = '100%';
            }, 300);
        }
    }

    // 更新總學分顯示
    function updateTotalCredits() {
        const totalCredits = Object.values(semesterData).reduce((sum, semester) => sum + semester.credits, 0);
        const creditsElement = document.getElementById('totalCredits');
        
        // 數字滾動動畫
        let current = 0;
        const increment = totalCredits / 30;
        const timer = setInterval(() => {
            current += increment;
            if (current >= totalCredits) {
                current = totalCredits;
                clearInterval(timer);
            }
            creditsElement.textContent = Math.floor(current);
        }, 30);
    }

    // 添加頁面載入時的交錯動畫
    function addStaggeredAnimation() {
        const initialCards = document.querySelectorAll('#semester-1 .course-card');
        initialCards.forEach((card, index) => {
            card.style.animationDelay = `${0.8 + (index * 0.1)}s`;
            card.classList.add('initial-animation');
        });
    }

    // 滾動效果
    function addScrollEffects() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // 觀察所有課程卡片
        document.querySelectorAll('.course-card').forEach(card => {
            observer.observe(card);
        });
    }

    // 鍵盤導航支持
    function addKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            if (e.key >= '1' && e.key <= '4') {
                const semesterNum = parseInt(e.key);
                switchSemester(semesterNum);
            }
        });
    }

    // 觸摸手勢支持（移動設備）
    function addTouchSupport() {
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', function(e) {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // 檢查是否為水平滑動
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                const currentActive = document.querySelector('.semester-btn.active');
                const currentSemester = parseInt(currentActive.dataset.semester);
                
                if (diffX > 0 && currentSemester < 4) {
                    // 向左滑動，切換到下一學期
                    switchSemester(currentSemester + 1);
                } else if (diffX < 0 && currentSemester > 1) {
                    // 向右滑動，切換到上一學期
                    switchSemester(currentSemester - 1);
                }
            }
            
            startX = 0;
            startY = 0;
        });
    }

    // 添加課程卡片點擊效果
    function addCardInteractions() {
        document.querySelectorAll('.course-card').forEach(card => {
            card.addEventListener('click', function() {
                // 添加點擊波紋效果
                const ripple = document.createElement('div');
                ripple.className = 'ripple-effect';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // 主題切換功能（可選）
    function addThemeToggle() {
        // 檢測系統主題偏好
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // 監聽主題變化
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                // 可以在這裡添加主題切換的額外邏輯
                console.log('主題已切換到:', e.matches ? '暗色' : '亮色');
            });
        }
    }

    // 績效最佳化：防抖動
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 事件監聽器
    semesterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const semester = this.dataset.semester;
            switchSemester(semester);
        });
        
        // 添加鍵盤支持
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const semester = this.dataset.semester;
                switchSemester(semester);
            }
        });
    });

    // 窗口調整大小時重新計算動畫
    window.addEventListener('resize', debounce(() => {
        // 重新計算動畫時機
        addStaggeredAnimation();
    }, 250));

    // 頁面可見性變化時暫停/恢復動畫
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // 頁面隱藏時暫停動畫
            document.body.style.animationPlayState = 'paused';
        } else {
            // 頁面顯示時恢復動畫
            document.body.style.animationPlayState = 'running';
        }
    });

    // 初始化所有功能
    initializePage();
    addKeyboardNavigation();
    addTouchSupport();
    addCardInteractions();
    addThemeToggle();

    console.log('台科大電機工程雙主修修業計劃系統已載入完成！');
    console.log('使用說明：');
    console.log('- 點擊學期按鈕切換不同學期');
    console.log('- 使用鍵盤數字鍵 1-4 快速切換學期');
    console.log('- 在移動設備上可以左右滑動切換學期');
    console.log('- 支援響應式設計和無障礙功能');
});

// 添加 CSS 動畫類別
const style = document.createElement('style');
style.textContent = `
    .initial-animation {
        animation: courseCardSlideIn 0.6s ease-out both;
    }
    
    @keyframes courseCardSlideIn {
        from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin-left: -10px;
        margin-top: -10px;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .in-view {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    /* 平滑過渡 */
    .semester-content {
        transition: all 0.3s ease;
    }
    
    /* 無障礙支援 */
    .semester-btn:focus {
        outline: 3px solid #667eea;
        outline-offset: 2px;
    }
    
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;

document.head.appendChild(style); 