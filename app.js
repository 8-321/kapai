// 抽卡系统主类
class CardDrawSystem {
    constructor() {
        this.drawHistory = this.loadFromStorage('drawHistory', []);
        this.collections = this.loadFromStorage('collections', []);
        this.achievements = this.loadFromStorage('achievements', []);
        this.totalDraws = this.loadFromStorage('totalDraws', 0);
        this.currentCard = null;
        this.currentCardData = {}; // 当前卡牌的填写数据
        this.isDrawing = false;
        this.selectedCards = []; // 当前抽到的3张卡
        this.selectedCardIndex = -1; // 用户选中的卡牌索引
        
        this.init();
    }

    init() {
        this.updateStats();
        this.initEventListeners();
        this.checkAchievements();
    }

    // 加载本地存储数据
    loadFromStorage(key, defaultValue) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    }

    // 保存到本地存储
    saveToStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('保存失败:', e);
        }
    }


    // 根据权重随机选择卡牌类型
    getRandomTypeByWeight() {
        const random = Math.random() * 100;
        if (random < cardWeights.explore) {
            return 'explore';
        } else if (random < cardWeights.explore + cardWeights.verify) {
            return 'verify';
        } else {
            return 'review';
        }
    }

    // 从指定类型卡组中随机选择一张卡
    getRandomCard(type) {
        const cardArray = cardLibrary[type + 'Cards'];
        const randomIndex = Math.floor(Math.random() * cardArray.length);
        return { ...cardArray[randomIndex] };
    }

    // 检查是否重复
    isDuplicate(cardId) {
        return this.drawHistory.some(item => item.id === cardId);
    }

    // 抽卡主方法 - 一次抽3张卡
    drawCard() {
        if (this.isDrawing) return;
        this.isDrawing = true;

        // 隐藏欢迎消息
        const welcomeMessage = document.getElementById('welcomeMessage');
        if (welcomeMessage) {
            welcomeMessage.style.display = 'none';
        }

        // 隐藏单卡展示区
        const cardContainer = document.getElementById('cardContainer');
        cardContainer.style.display = 'none';

        // 显示3张卡选择区
        const selectionArea = document.getElementById('cardsSelectionArea');
        selectionArea.style.display = 'block';

        const drawButton = document.getElementById('drawButton');
        
        // 按钮抖动效果
        drawButton.classList.add('shaking');
        setTimeout(() => {
            drawButton.classList.remove('shaking');
        }, 500);

        // 抽取3张不同的卡
        this.selectedCards = [];
        this.selectedCardIndex = -1;
        const cardsGrid = document.getElementById('cardsGrid');
        cardsGrid.innerHTML = '';

        // 添加加载效果
        cardsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: rgba(255,255,255,0.7);">正在抽取卡牌...</div>';

        setTimeout(() => {
            // 抽取3张不同的卡
            const drawnTypes = [];
            while (this.selectedCards.length < 3) {
                const type = this.getRandomTypeByWeight();
                const card = this.getRandomCard(type);
                
                // 确保不重复
                if (!this.selectedCards.some(c => c.id === card.id)) {
                    this.selectedCards.push(card);
                    drawnTypes.push(type);
                }
            }

            // 显示3张卡供选择
            this.displayCardsSelection();
            
            this.isDrawing = false;
        }, 1000);
    }

    // 显示3张卡供选择
    displayCardsSelection() {
        const cardsGrid = document.getElementById('cardsGrid');
        cardsGrid.innerHTML = '';

        this.selectedCards.forEach((card, index) => {
            const cardItem = document.createElement('div');
            cardItem.className = 'card-select-item';
            cardItem.dataset.index = index;
            
            const type = card.type.toLowerCase().replace('卡', '');
            // 设置卡牌样式类
            cardItem.classList.add('card', type);
            
            // 延迟显示，添加动画效果
            cardItem.style.opacity = '0';
            cardItem.style.transform = 'translateY(50px) scale(0.8)';
            
            cardItem.innerHTML = this.createCardHTML(card, type);
            
            // 点击选择
            cardItem.addEventListener('click', () => {
                this.selectCard(index);
            });
            
            cardsGrid.appendChild(cardItem);
            
            // 添加飞入动画
            setTimeout(() => {
                cardItem.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                cardItem.style.opacity = '1';
                cardItem.style.transform = 'translateY(0) scale(1)';
            }, 100 + index * 150);
        });

        // 添加确认选择按钮
        const selectButton = document.createElement('button');
        selectButton.className = 'select-button';
        selectButton.id = 'confirmSelectButton';
        selectButton.textContent = '确认选择';
        selectButton.disabled = true;
        selectButton.addEventListener('click', () => {
            this.confirmSelection();
        });
        cardsGrid.parentElement.appendChild(selectButton);
    }

    // 创建卡牌HTML（用于选择区）
    createCardHTML(card, type) {
        const cardNum = card.id.match(/\d+/)?.[0] || '01';
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            starsHTML += '<span class="star" style="font-size: 14px; color: ' + (i <= card.difficulty ? '#ffd700' : 'rgba(255,255,255,0.3)') + ';">☆</span>';
        }
        
        // 根据卡牌类型获取标签或内容
        let tagsOrContentHTML = '';
        if (card.type === '验证卡') {
            // 验证卡显示数据记录表
            tagsOrContentHTML = '<div style="font-size: 11px; font-weight: bold; margin-bottom: 6px; color: rgba(255,255,255,0.95);">数据记录表</div>';
            if (card.content.fields && card.content.fields.length > 0) {
                card.content.fields.slice(0, 2).forEach(field => {
                    if (field.includes('时间')) {
                        tagsOrContentHTML += '<div style="font-size: 10px; margin-bottom: 3px; color: rgba(255,255,255,0.9);">' + field + '：__小时</div>';
                    } else if (field.includes('成果')) {
                        tagsOrContentHTML += '<div style="font-size: 10px; margin-bottom: 3px; color: rgba(255,255,255,0.9);">' + field + '：__项</div>';
                    } else if (field.includes('能量')) {
                        tagsOrContentHTML += '<div style="font-size: 10px; margin-bottom: 3px; color: rgba(255,255,255,0.9);">' + field + '：高/中/低</div>';
                    }
                });
            }
        } else if (card.type === '复盘卡' && card.content.levels) {
            // 复盘卡显示分级
            Object.keys(card.content.levels).slice(0, 3).forEach(key => {
                const level = card.content.levels[key];
                tagsOrContentHTML += '<div style="font-size: 10px; margin-bottom: 3px; color: rgba(255,255,255,0.9);">' + key + '：' + level.name + '</div>';
            });
        } else {
            // 探索卡显示标签
            const tags = this.getCardTags(card);
            tagsOrContentHTML = '<div class="card-front-tags" style="display: flex; flex-wrap: wrap; gap: 4px;">';
            tags.slice(0, 2).forEach(tag => {
                tagsOrContentHTML += '<span class="tag" style="font-size: 10px; padding: 2px 6px;">' + tag + '</span>';
            });
            tagsOrContentHTML += '</div>';
        }
        
        // 配对信息（验证卡）
        let extraHTML = '';
        if (card.type === '验证卡') {
            const pairId = card.id.replace('VE', 'EX');
            extraHTML = '<div style="font-size: 10px; margin-bottom: 6px; color: rgba(255,255,255,0.9);">配对：探索卡 ' + pairId + '</div>';
        } else if (card.type === '复盘卡' && card.title.includes('L1/L2/L3')) {
            extraHTML = '<div style="font-size: 10px; margin-bottom: 6px; color: rgba(255,255,255,0.9);">主题：L1/L2/L3</div>';
        }
        
        return `
            <div class="card-inner" style="width: 100%; height: 100%; position: relative; transform-style: preserve-3d;">
                <div class="card-front" style="width: 100%; height: 100%; position: absolute; backface-visibility: hidden;">
                    <div class="card-front-pattern"></div>
                    <div class="card-front-content" style="position: relative; z-index: 1; height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 15px;">
                        <div>
                            <div class="card-front-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <span class="card-type-label" style="font-size: 14px; font-weight: bold; color: var(--text-primary);">${card.type}</span>
                                <span class="card-number" style="font-size: 12px; color: rgba(255,255,255,0.8); font-family: monospace;">#${cardNum.padStart(2, '0')}</span>
                            </div>
                            <div class="card-front-difficulty" style="display: flex; gap: 2px; margin-bottom: 6px;">${starsHTML}</div>
                            <div class="card-front-divider" style="height: 1px; background: rgba(255,255,255,0.3); margin: 6px 0;"></div>
                            <div class="card-front-title" style="font-size: 14px; line-height: 1.3; margin-bottom: 8px; font-weight: bold; color: var(--text-primary);">${card.title}</div>
                            ${extraHTML}
                            ${tagsOrContentHTML}
                        </div>
                        <div class="card-front-period" style="font-size: 10px; color: rgba(255,255,255,0.8); margin-top: auto;">周期：${card.suggestedTime || '3-7天'}</div>
                    </div>
                </div>
            </div>
        `;
    }

    // 选择卡牌
    selectCard(index) {
        // 移除之前的选中状态
        document.querySelectorAll('.card-select-item').forEach(item => {
            item.classList.remove('selected');
        });

        // 添加选中状态
        const selectedItem = document.querySelector(`[data-index="${index}"]`);
        if (selectedItem) {
            selectedItem.classList.add('selected');
            this.selectedCardIndex = index;

            // 启用确认按钮
            const confirmButton = document.getElementById('confirmSelectButton');
            if (confirmButton) {
                confirmButton.disabled = false;
            }
        }
    }

    // 确认选择
    confirmSelection() {
        if (this.selectedCardIndex === -1) {
            alert('请先选择一张卡牌！');
            return;
        }

        const selectedCard = this.selectedCards[this.selectedCardIndex];
        
        // 显示选中的卡牌（内部会处理隐藏选择区等）
        this.showSelectedCard(selectedCard);

        // 记录到历史
        this.saveToHistory(selectedCard);

        // 更新统计
        this.totalDraws++;
        this.saveToStorage('totalDraws', this.totalDraws);
        this.updateStats();
    }

    // 显示选中的卡牌
    showSelectedCard(card) {
        // 隐藏选择区
        const selectionArea = document.getElementById('cardsSelectionArea');
        selectionArea.style.display = 'none';

        // 移除确认按钮
        const confirmButton = document.getElementById('confirmSelectButton');
        if (confirmButton && confirmButton.parentNode) {
            confirmButton.parentNode.removeChild(confirmButton);
        }

        // 显示单卡容器
        const cardContainer = document.getElementById('cardContainer');
        cardContainer.style.display = 'block';
        cardContainer.style.opacity = '1';
        cardContainer.style.visibility = 'visible';

        const cardElement = document.getElementById('currentCard');
        const type = card.type.toLowerCase().replace('卡', '');

        // 重置卡牌状态
        cardElement.classList.remove('flipped', 'explore', 'verify', 'review', 'entering', 'revealing');
        cardElement.className = 'card ' + type;
        cardElement.style.transform = 'translateY(100vh) rotateY(90deg) scale(0.5)';
        cardElement.style.opacity = '0';
        cardElement.style.display = 'block';
        cardElement.style.transition = 'none';

        // 保存当前卡牌
        this.currentCard = card;

        // 显示卡牌内容
        this.displayCard(card);

        // 添加特效
        this.clearEffects(cardContainer);
        this.createFlashEffect(cardContainer);
        this.createParticles(cardContainer);

        // 动画显示
        setTimeout(() => {
            // 爆炸效果
            cardContainer.classList.add('reveal');
            setTimeout(() => {
                cardContainer.classList.remove('reveal');
            }, 800);

            // 添加光束效果
            this.createLightBeam(cardContainer);

            cardElement.classList.add('entering', type);
            cardElement.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
            cardElement.style.transform = 'translateY(0) rotateY(0deg) scale(1)';
            cardElement.style.opacity = '1';

            // 延迟翻转
            setTimeout(() => {
                cardElement.classList.add('flipped');
                this.createFlipParticles(cardContainer, card);
            }, 500);
        }, 100);

        // 显示操作按钮
        const actionButtons = document.getElementById('actionButtons');
        actionButtons.style.display = 'flex';

        // 更新收藏按钮状态
        this.updateFavoriteButton();

        // 检查成就
        this.checkAchievements();
    }

    // 清除特效
    clearEffects(container) {
        const existingParticles = container.querySelectorAll('.particle, .flash-effect, .light-beam');
        existingParticles.forEach(el => el.remove());
    }

    // 创建粒子效果
    createParticles(container) {
        const particleCount = 30;
        const containerRect = container.getBoundingClientRect();
        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // 随机位置
            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = 100 + Math.random() * 50;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            
            // 随机颜色（根据卡牌类型）
            const colors = ['#ffffff', '#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.style.background = color;
            particle.style.boxShadow = `0 0 10px ${color}`;
            
            // 随机延迟
            particle.style.animationDelay = (Math.random() * 0.5) + 's';
            
            container.appendChild(particle);
            
            // 自动清理
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 2000);
        }
    }

    // 创建闪光效果
    createFlashEffect(container) {
        const flash = document.createElement('div');
        flash.className = 'flash-effect';
        container.appendChild(flash);
        
        setTimeout(() => {
            if (flash.parentNode) {
                flash.parentNode.removeChild(flash);
            }
        }, 300);
    }

    // 创建光束效果
    createLightBeam(container) {
        const beam = document.createElement('div');
        beam.className = 'light-beam';
        container.appendChild(beam);
        
        setTimeout(() => {
            if (beam.parentNode) {
                beam.parentNode.removeChild(beam);
            }
        }, 1000);
    }

    // 创建翻转时的粒子效果
    createFlipParticles(container, card) {
        const particleCount = 20;
        const containerRect = container.getBoundingClientRect();
        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;
        
        // 根据卡牌类型设置颜色
        let color = '#ffffff';
        if (card.type === '探索卡') color = '#4CAF50';
        else if (card.type === '验证卡') color = '#2196F3';
        else if (card.type === '复盘卡') color = '#9C27B0';

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // 随机方向
            const angle = Math.random() * Math.PI * 2;
            const distance = 80 + Math.random() * 40;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            particle.style.background = color;
            particle.style.boxShadow = `0 0 15px ${color}`;
            particle.style.width = '8px';
            particle.style.height = '8px';
            
            container.appendChild(particle);
            
            // 自动清理
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 2000);
        }
    }

    // 显示卡牌
    displayCard(card) {
        const cardElement = document.getElementById('currentCard');
        const type = card.type.toLowerCase().replace('卡', '');
        cardElement.className = 'card ' + type;
        
        // 如果有历史数据中的填写内容，合并到当前卡牌
        if (card.fillData) {
            this.currentCardData = card.fillData;
            // 将填写数据保存到存储中
            const cardDataKey = `cardData_${card.id}`;
            this.saveToStorage(cardDataKey, card.fillData);
        } else {
            // 加载保存的数据
            this.currentCardData = this.loadCardData(card.id);
        }
        
        // 设置卡牌正面
        this.displayCardFront(card);
        
        // 设置卡牌背面
        this.displayCardBack(card);
    }

    // 显示卡牌正面
    displayCardFront(card) {
        // 卡牌类型标签
        document.getElementById('cardTypeLabel').textContent = card.type;
        
        // 卡牌编号（提取数字）
        const cardNum = card.id.match(/\d+/)?.[0] || '01';
        document.getElementById('cardNumber').textContent = '#' + cardNum.padStart(2, '0');
        
        // 难度星级
        const difficultyElement = document.getElementById('cardFrontDifficulty');
        difficultyElement.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.className = 'star' + (i <= card.difficulty ? ' active' : '');
            star.textContent = i <= card.difficulty ? '☆' : '☆';
            star.style.fontSize = '16px';
            star.style.color = i <= card.difficulty ? '#ffd700' : 'rgba(255, 255, 255, 0.3)';
            difficultyElement.appendChild(star);
        }
        
        // 卡牌标题
        document.getElementById('cardFrontTitle').textContent = card.title;
        
        // 标签或内容（根据卡牌类型显示不同内容）
        const tagsElement = document.getElementById('cardFrontTags');
        tagsElement.innerHTML = '';
        
        // 验证卡正面显示数据记录表
        if (card.type === '验证卡') {
            // 显示"数据记录表"标题
            const titleDiv = document.createElement('div');
            titleDiv.style.cssText = 'font-size: 14px; font-weight: bold; margin-bottom: 8px; color: var(--text-primary);';
            titleDiv.textContent = '数据记录表';
            tagsElement.appendChild(titleDiv);
            
            // 加载保存的数据
            const savedData = this.loadCardData(card.id);
            
            // 显示数据记录字段（可编辑）
            if (card.content.fields && card.content.fields.length > 0) {
                card.content.fields.forEach(field => {
                    const fieldDiv = document.createElement('div');
                    fieldDiv.style.cssText = 'font-size: 12px; margin-bottom: 8px; color: rgba(255, 255, 255, 0.9); display: flex; align-items: center; gap: 8px;';
                    
                    const label = document.createElement('span');
                    label.textContent = field + '：';
                    label.style.minWidth = '80px';
                    
                    const fillableField = document.createElement('div');
                    fillableField.className = 'card-fillable-field';
                    
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.dataset.field = field;
                    input.dataset.cardId = card.id;
                    
                    // 设置占位符
                    if (field.includes('时间')) {
                        input.placeholder = '__小时';
                    } else if (field.includes('成果') || field.includes('产出')) {
                        input.placeholder = '__项';
                    } else if (field.includes('能量')) {
                        input.placeholder = '高/中/低';
                    } else {
                        input.placeholder = '__';
                    }
                    
                    // 加载保存的值
                    if (savedData && savedData[field]) {
                        input.value = savedData[field];
                    }
                    
                    // 监听输入变化，自动保存
                    input.addEventListener('input', (e) => {
                        this.saveCardField(card.id, field, e.target.value);
                    });
                    
                    fillableField.appendChild(input);
                    fieldDiv.appendChild(label);
                    fieldDiv.appendChild(fillableField);
                    tagsElement.appendChild(fieldDiv);
                });
            }
            
            // 添加保存按钮
            const saveBtn = document.createElement('button');
            saveBtn.className = 'save-card-btn';
            saveBtn.id = 'saveCardBtn';
            saveBtn.textContent = '💾 保存数据';
            saveBtn.style.cssText = 'margin-top: 10px; width: 100%; padding: 8px; font-size: 12px;';
            saveBtn.addEventListener('click', () => {
                this.saveCardData(card);
            });
            tagsElement.appendChild(saveBtn);
        } else if (card.type === '复盘卡' && card.content.levels) {
            // 复盘卡正面显示分级系统
            Object.keys(card.content.levels).forEach(key => {
                const level = card.content.levels[key];
                const levelDiv = document.createElement('div');
                levelDiv.style.cssText = 'font-size: 12px; margin-bottom: 4px; color: rgba(255, 255, 255, 0.9);';
                levelDiv.innerHTML = key + '：' + level.name;
                tagsElement.appendChild(levelDiv);
            });
        } else {
            // 探索卡或其他卡显示标签
            const tags = this.getCardTags(card);
            tags.forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.className = 'tag';
                tagSpan.textContent = tag;
                tagsElement.appendChild(tagSpan);
            });
        }
        
        // 额外信息（验证卡的配对信息或复盘卡的主题）
        const extraElement = document.getElementById('cardFrontExtra');
        extraElement.innerHTML = '';
        
        if (card.type === '验证卡') {
            // 验证卡显示配对信息
            const pairId = card.id.replace('VE', 'EX');
            extraElement.innerHTML = '<div style="font-size: 12px; margin-bottom: 8px; color: rgba(255, 255, 255, 0.9);">配对：探索卡 ' + pairId + '</div>';
        } else if (card.type === '复盘卡' && card.title.includes('L1/L2/L3')) {
            // 复盘卡显示主题
            extraElement.innerHTML = '<div style="font-size: 12px; margin-bottom: 8px; color: rgba(255, 255, 255, 0.9);">主题：L1/L2/L3</div>';
        }
        
        // 周期
        const period = card.suggestedTime || '3-7天';
        document.getElementById('cardFrontPeriod').textContent = `周期：${period}`;
    }

    // 获取卡牌标签
    getCardTags(card) {
        const tagMap = {
            '探索卡': ['技能入门', '快速体验'],
            '验证卡': ['数据验证', '效果评估'],
            '复盘卡': ['思维模型', '方法论']
        };
        
        // 尝试从标题或内容中提取标签
        if (card.title.includes('体验') || card.title.includes('探索')) {
            return ['技能入门'];
        } else if (card.title.includes('验证') || card.title.includes('计算')) {
            return ['数据验证'];
        } else if (card.title.includes('复盘') || card.title.includes('分析')) {
            return ['思维模型'];
        }
        
        return tagMap[card.type] || ['通用'];
    }

    // 显示卡牌背面
    displayCardBack(card) {
        const contentElement = document.getElementById('cardBackContent');
        contentElement.innerHTML = this.renderCardBackContent(card);
    }

    // 渲染卡牌背面内容
    renderCardBackContent(card) {
        let html = '';
        
        // 探索卡背面
        if (card.type === '探索卡') {
            // 探索目标
            if (card.content.description) {
                html += '<div class="section">';
                html += '<div class="section-title">🔍 探索目标</div>';
                html += '<div class="section-content">' + card.content.description + '</div>';
                html += '</div>';
            }
            
            // 时间分配建议
            if (card.content.steps) {
                html += '<div class="section">';
                html += '<div class="section-title">⏰ 时间分配建议</div>';
                html += '<div class="section-content"><ul>';
                card.content.steps.forEach(step => {
                    // 提取时间和内容
                    const match = step.match(/(\d+[h小时]*)[：:]\s*(.+)/);
                    if (match) {
                        html += '<li><strong>' + match[1] + '：</strong>' + match[2] + '</li>';
                    } else {
                        html += '<li>' + step.replace(/^第\d+步[：:]\s*/, '') + '</li>';
                    }
                });
                html += '</ul></div>';
                html += '</div>';
            }
            
            // 常见坑位
            if (card.content.tips) {
                html += '<div class="section">';
                html += '<div class="section-title">⚠️ 常见坑位</div>';
                html += '<div class="section-content"><ul>';
                card.content.tips.forEach((tip, index) => {
                    html += '<li>' + (index + 1) + '. ' + tip + '</li>';
                });
                html += '</ul></div>';
                html += '</div>';
            }
        }
        
        // 验证卡背面
        if (card.type === '验证卡') {
            // 投入产出比计算
            if (card.content.formula) {
                html += '<div class="section">';
                html += '<div class="section-title">📊 投入产出比计算</div>';
                html += '<div class="section-content">';
                html += '<div class="formula">' + card.content.formula + '</div>';
                
                if (card.content.thresholds) {
                    html += '<ul>';
                    Object.values(card.content.thresholds).forEach(threshold => {
                        html += '<li>' + threshold + '</li>';
                    });
                    html += '</ul>';
                }
                
                html += '</div>';
                html += '</div>';
            }
            
            // 继续/停止决策树
            if (card.content.decisionTree || card.content.questions) {
                const questions = card.content.decisionTree || card.content.questions || [];
                html += '<div class="section">';
                html += '<div class="section-title">🎯 继续/停止决策树</div>';
                html += '<div class="section-content decision-tree"><ul>';
                questions.forEach((question, index) => {
                    html += '<li>' + (index + 1) + '. ' + question.replace(/^[0-9]+\.[\s]*/, '') + '</li>';
                });
                if (questions.length >= 3) {
                    html += '<li style="margin-top: 10px; font-weight: bold; color: var(--text-primary);">≥2个"是"→继续</li>';
                }
                html += '</ul></div>';
                html += '</div>';
            }
        }
        
        // 复盘卡背面
        if (card.type === '复盘卡') {
            // 使用场景
            if (card.content.description || card.content.concept) {
                html += '<div class="section">';
                html += '<div class="section-title">🎲 使用场景</div>';
                html += '<div class="section-content">';
                html += (card.content.description || card.content.concept) + '</div>';
                html += '</div>';
            }
            
            // 决策树或问题
            if (card.content.decisionTree || card.content.questions) {
                const questions = card.content.decisionTree || card.content.questions || [];
                html += '<div class="section">';
                html += '<div class="section-content decision-tree"><ul>';
                questions.forEach((question, index) => {
                    html += '<li>' + (index + 1) + '. ' + question.replace(/^[0-9]+\.[\s]*/, '') + '</li>';
                });
                html += '</ul></div>';
                html += '</div>';
            }
            
            // 分级系统（如果是L1/L2/L3卡）
            if (card.content.levels) {
                html += '<div class="section">';
                html += '<div class="section-content">';
                Object.keys(card.content.levels).forEach(key => {
                    const level = card.content.levels[key];
                    html += '<div class="principle">';
                    html += '<strong>' + key + '：' + level.name + '</strong><br>';
                    html += level.rule;
                    html += '</div>';
                });
                html += '</div>';
                html += '</div>';
            }
            
            // 分配原则
            if (card.content.levels) {
                html += '<div class="section">';
                html += '<div class="section-title">✅ 分配原则</div>';
                html += '<div class="section-content">';
                html += '<ul>';
                html += '<li>同时只能有1-2个L3</li>';
                html += '<li>L2不超过3个</li>';
                html += '<li>L1随意但必须轻做</li>';
                html += '</ul>';
                html += '</div>';
                html += '</div>';
            }
        }
        
        // 重复标记（如果是从历史查看，不显示）
        if (card.isDuplicate && !card.drawTime) {
            html += '<div class="card-back-section" style="margin-top: auto; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">';
            html += '<div class="card-back-section-content" style="color: #ff9800; text-align: center;">⚠️ 您之前已抽到过此卡</div>';
            html += '</div>';
        }
        
        return html;
    }

    // 保存到历史
    saveToHistory(card) {
        // 加载当前填写的数据
        const cardData = this.loadCardData(card.id);
        
        const historyItem = {
            ...card,
            fillData: cardData || {}, // 保存填写的数据
            drawTime: new Date().toISOString(),
            drawDate: new Date().toLocaleDateString('zh-CN')
        };
        this.drawHistory.unshift(historyItem);
        
        // 限制历史记录数量
        if (this.drawHistory.length > 100) {
            this.drawHistory = this.drawHistory.slice(0, 100);
        }
        
        this.saveToStorage('drawHistory', this.drawHistory);
    }

    // 保存卡牌单个字段
    saveCardField(cardId, field, value) {
        const cardDataKey = `cardData_${cardId}`;
        let cardData = this.loadFromStorage(cardDataKey, {});
        cardData[field] = value;
        this.saveToStorage(cardDataKey, cardData);
        this.currentCardData[field] = value;
    }

    // 保存卡牌所有数据
    saveCardData(card) {
        if (!card || card.type !== '验证卡') return;
        
        const inputs = document.querySelectorAll(`input[data-card-id="${card.id}"]`);
        const cardData = {};
        
        inputs.forEach(input => {
            const field = input.dataset.field;
            const value = input.value.trim();
            if (value) {
                cardData[field] = value;
            }
        });
        
        const cardDataKey = `cardData_${card.id}`;
        this.saveToStorage(cardDataKey, cardData);
        this.currentCardData = cardData;
        
        // 更新按钮状态
        const saveBtn = document.getElementById('saveCardBtn');
        if (saveBtn) {
            const originalText = saveBtn.textContent;
            saveBtn.textContent = '✅ 已保存';
            saveBtn.classList.add('saved');
            setTimeout(() => {
                saveBtn.textContent = originalText;
                saveBtn.classList.remove('saved');
            }, 2000);
        }
        
        // 更新历史记录中的填写数据
        const historyIndex = this.drawHistory.findIndex(item => item.id === card.id);
        if (historyIndex >= 0) {
            this.drawHistory[historyIndex].fillData = cardData;
            this.saveToStorage('drawHistory', this.drawHistory);
        }
    }

    // 加载卡牌数据
    loadCardData(cardId) {
        const cardDataKey = `cardData_${cardId}`;
        return this.loadFromStorage(cardDataKey, {});
    }

    // 收藏/取消收藏
    toggleFavorite() {
        if (!this.currentCard) return;
        
        const index = this.collections.findIndex(c => c.id === this.currentCard.id);
        if (index > -1) {
            this.collections.splice(index, 1);
        } else {
            // 保存当前填写的数据
            let fillData = {};
            if (this.currentCard.type === '验证卡') {
                fillData = this.loadCardData(this.currentCard.id);
            }
            
            const favoriteItem = {
                ...this.currentCard,
                fillData: fillData, // 保存填写的数据
                favoriteTime: new Date().toISOString(),
                favoriteDate: new Date().toLocaleDateString('zh-CN')
            };
            this.collections.unshift(favoriteItem);
        }
        
        this.saveToStorage('collections', this.collections);
        this.updateFavoriteButton();
        this.updateStats();
        this.checkAchievements();
    }

    // 更新收藏按钮状态
    updateFavoriteButton() {
        const favoriteBtn = document.getElementById('favoriteBtn');
        if (!this.currentCard) return;
        
        const isFavorite = this.collections.some(c => c.id === this.currentCard.id);
        if (isFavorite) {
            favoriteBtn.classList.add('active');
            favoriteBtn.textContent = '⭐ 已收藏';
        } else {
            favoriteBtn.classList.remove('active');
            favoriteBtn.textContent = '⭐ 收藏';
        }
    }

    // 生成分享内容
    generateShareContent(card) {
        let content = `🎴 我抽到了一张【${card.type}】：${card.title}\n\n`;
        
        if (card.content.description) {
            content += `${card.content.description}\n\n`;
        }
        
        content += `💪 难度：${'⭐'.repeat(card.difficulty)}${'☆'.repeat(5 - card.difficulty)}\n`;
        
        if (card.suggestedTime) {
            content += `📅 建议周期：${card.suggestedTime}\n\n`;
        }
        
        content += `来自「探索验证卡牌系统」\n#探索卡牌 #成长游戏`;
        
        return content;
    }

    // 分享功能
    shareCard() {
        if (!this.currentCard) return;
        
        const shareContent = this.generateShareContent(this.currentCard);
        
        // 检查是否支持 Web Share API
        if (navigator.share) {
            navigator.share({
                title: `我抽到了【${this.currentCard.type}】：${this.currentCard.title}`,
                text: shareContent
            }).catch(err => {
                console.log('分享取消或失败:', err);
                this.copyToClipboard(shareContent);
            });
        } else {
            // 降级方案：复制到剪贴板
            this.copyToClipboard(shareContent);
        }
    }

    // 复制到剪贴板
    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                alert('分享内容已复制到剪贴板！');
            }).catch(err => {
                console.error('复制失败:', err);
                this.fallbackCopy(text);
            });
        } else {
            this.fallbackCopy(text);
        }
    }

    // 降级复制方法
    fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            alert('分享内容已复制到剪贴板！');
        } catch (err) {
            alert('复制失败，请手动复制：\n\n' + text);
        }
        document.body.removeChild(textArea);
    }

    // 显示历史记录
    showHistory() {
        const sidebar = document.getElementById('historySidebar');
        const overlay = document.getElementById('overlay');
        const content = document.getElementById('historyContent');
        
        if (this.drawHistory.length === 0) {
            content.innerHTML = '<p class="empty-message">暂无抽卡记录</p>';
        } else {
            content.innerHTML = this.drawHistory.map((item, index) => {
                const typeClass = item.type === '探索卡' ? 'explore' : 
                                 item.type === '验证卡' ? 'verify' : 'review';
                return `
                    <div class="history-item ${typeClass}" data-index="${index}">
                        <div class="history-item-title">${item.title}</div>
                        <div class="history-item-meta">
                            <span>${item.type}</span>
                            <span>${item.drawDate}</span>
                        </div>
                    </div>
                `;
            }).join('');
            
            // 添加点击事件
            content.querySelectorAll('.history-item').forEach(item => {
                item.addEventListener('click', () => {
                    const index = parseInt(item.dataset.index);
                    this.displayCardFromHistory(this.drawHistory[index]);
                    this.closeHistory();
                });
            });
        }
        
        sidebar.classList.add('active');
        overlay.classList.add('active');
    }

    // 从历史记录显示卡牌
    displayCardFromHistory(card) {
        const welcomeMessage = document.getElementById('welcomeMessage');
        if (welcomeMessage) {
            welcomeMessage.style.display = 'none';
        }
        
        // 隐藏选择区
        const selectionArea = document.getElementById('cardsSelectionArea');
        if (selectionArea) {
            selectionArea.style.display = 'none';
        }
        
        const cardContainer = document.getElementById('cardContainer');
        cardContainer.style.display = 'block';
        
        const cardElement = document.getElementById('currentCard');
        const type = card.type.toLowerCase().replace('卡', '');
        
        // 重置卡牌状态
        cardElement.classList.remove('flipped', 'explore', 'verify', 'review');
        cardElement.style.transform = 'scale(0.8) rotateY(-20deg)';
        cardElement.style.opacity = '0';
        cardElement.style.transition = 'none';
        
        // 如果有保存的填写数据，恢复它
        if (card.fillData) {
            this.currentCardData = card.fillData;
        }
        
        this.currentCard = card;
        this.displayCard(card);
        
        // 添加类型和展示动画
        setTimeout(() => {
            cardElement.classList.add(type);
            cardElement.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            cardElement.style.transform = 'scale(1) rotateY(0deg)';
            cardElement.style.opacity = '1';
            
            // 翻转卡牌
            setTimeout(() => {
                cardElement.classList.add('flipped');
                this.createFlipParticles(cardContainer, card);
            }, 300);
        }, 50);
        
        const actionButtons = document.getElementById('actionButtons');
        actionButtons.style.display = 'flex';
        
        this.updateFavoriteButton();
    }

    // 关闭历史记录
    closeHistory() {
        const sidebar = document.getElementById('historySidebar');
        const overlay = document.getElementById('overlay');
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }

    // 显示收藏
    showCollection() {
        const sidebar = document.getElementById('collectionSidebar');
        const overlay = document.getElementById('overlay');
        const content = document.getElementById('collectionContent');
        
        if (this.collections.length === 0) {
            content.innerHTML = '<p class="empty-message">暂无收藏</p>';
        } else {
            content.innerHTML = this.collections.map((item, index) => {
                const typeClass = item.type === '探索卡' ? 'explore' : 
                                 item.type === '验证卡' ? 'verify' : 'review';
                return `
                    <div class="collection-item ${typeClass}" data-index="${index}">
                        <div class="history-item-title">${item.title}</div>
                        <div class="history-item-meta">
                            <span>${item.type}</span>
                            <span>${item.favoriteDate || item.drawDate}</span>
                        </div>
                    </div>
                `;
            }).join('');
            
            // 添加点击事件
            content.querySelectorAll('.collection-item').forEach(item => {
                item.addEventListener('click', () => {
                    const index = parseInt(item.dataset.index);
                    this.displayCardFromHistory(this.collections[index]);
                    this.closeCollection();
                });
            });
        }
        
        sidebar.classList.add('active');
        overlay.classList.add('active');
    }

    // 关闭收藏
    closeCollection() {
        const sidebar = document.getElementById('collectionSidebar');
        const overlay = document.getElementById('overlay');
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }

    // 显示成就
    showAchievements() {
        const modal = document.getElementById('achievementModal');
        const overlay = document.getElementById('overlay');
        const content = document.getElementById('achievementContent');
        
        const achievements = this.getAchievementsList();
        content.innerHTML = achievements.map(achievement => {
            const isUnlocked = this.achievements.includes(achievement.id);
            return `
                <div class="achievement-item ${isUnlocked ? 'unlocked' : ''}">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-info">
                        <div class="achievement-name">${achievement.name}</div>
                        <div class="achievement-desc">${achievement.desc}</div>
                    </div>
                </div>
            `;
        }).join('');
        
        modal.classList.add('active');
        overlay.classList.add('active');
    }

    // 获取成就列表
    getAchievementsList() {
        return [
            {
                id: 'first_draw',
                name: '首次抽卡',
                desc: '完成第一次抽卡',
                icon: '🎴'
            },
            {
                id: 'draw_7',
                name: '探索新手',
                desc: '连续抽卡7天',
                icon: '🌱'
            },
            {
                id: 'draw_30',
                name: '探索达人',
                desc: '累计抽卡30次',
                icon: '🌟'
            },
            {
                id: 'collect_10',
                name: '好奇收集者',
                desc: '收藏10张不同卡牌',
                icon: '📚'
            },
            {
                id: 'collect_all_types',
                name: '全类型收集',
                desc: '收藏所有三种类型的卡牌',
                icon: '🏆'
            },
            {
                id: 'daily_streak_7',
                name: '坚持不懈',
                desc: '连续7天每天抽卡',
                icon: '🔥'
            }
        ];
    }

    // 检查成就
    checkAchievements() {
        const achievements = this.getAchievementsList();
        const newAchievements = [];
        
        // 首次抽卡
        if (this.totalDraws >= 1 && !this.achievements.includes('first_draw')) {
            newAchievements.push('first_draw');
        }
        
        // 累计抽卡30次
        if (this.totalDraws >= 30 && !this.achievements.includes('draw_30')) {
            newAchievements.push('draw_30');
        }
        
        // 收藏10张
        if (this.collections.length >= 10 && !this.achievements.includes('collect_10')) {
            newAchievements.push('collect_10');
        }
        
        // 全类型收集
        const hasExplore = this.collections.some(c => c.type === '探索卡');
        const hasVerify = this.collections.some(c => c.type === '验证卡');
        const hasReview = this.collections.some(c => c.type === '复盘卡');
        if (hasExplore && hasVerify && hasReview && !this.achievements.includes('collect_all_types')) {
            newAchievements.push('collect_all_types');
        }
        
        // 检查连续天数（简化版）
        if (this.dailyDraws >= 7 && !this.achievements.includes('daily_streak_7')) {
            newAchievements.push('daily_streak_7');
        }
        
        // 添加新成就
        if (newAchievements.length > 0) {
            newAchievements.forEach(id => {
                if (!this.achievements.includes(id)) {
                    this.achievements.push(id);
                }
            });
            this.saveToStorage('achievements', this.achievements);
            
            // 显示成就通知
            if (newAchievements.length > 0) {
                this.showAchievementNotification(newAchievements);
            }
        }
    }

    // 显示成就通知
    showAchievementNotification(achievementIds) {
        const achievements = this.getAchievementsList();
        achievementIds.forEach(id => {
            const achievement = achievements.find(a => a.id === id);
            if (achievement) {
                // 简单的通知（可以改进为更炫酷的动画）
                setTimeout(() => {
                    alert(`🎉 恭喜获得成就：${achievement.name}\n${achievement.desc}`);
                }, 1000);
            }
        });
    }

    // 关闭成就弹窗
    closeAchievements() {
        const modal = document.getElementById('achievementModal');
        const overlay = document.getElementById('overlay');
        modal.classList.remove('active');
        overlay.classList.remove('active');
    }

    // 更新统计信息
    updateStats() {
        document.getElementById('totalDraws').textContent = this.totalDraws;
        document.getElementById('collectionCount').textContent = this.collections.length;
    }

    // 初始化事件监听
    initEventListeners() {
        // 抽卡按钮
        document.getElementById('drawButton').addEventListener('click', () => {
            this.drawCard();
        });
        
        // 收藏按钮
        document.getElementById('favoriteBtn').addEventListener('click', () => {
            this.toggleFavorite();
        });
        
        // 分享按钮
        document.getElementById('shareBtn').addEventListener('click', () => {
            this.shareCard();
        });
        
        // 历史记录按钮
        document.getElementById('historyBtn').addEventListener('click', () => {
            this.showHistory();
        });
        
        // 收藏按钮
        document.getElementById('collectionBtn').addEventListener('click', () => {
            this.showCollection();
        });
        
        // 成就按钮
        document.getElementById('achievementBtn').addEventListener('click', () => {
            this.showAchievements();
        });
        
        // 关闭按钮
        document.getElementById('closeHistoryBtn').addEventListener('click', () => {
            this.closeHistory();
        });
        
        document.getElementById('closeCollectionBtn').addEventListener('click', () => {
            this.closeCollection();
        });
        
        document.getElementById('closeAchievementBtn').addEventListener('click', () => {
            this.closeAchievements();
        });
        
        // 遮罩层点击关闭
        document.getElementById('overlay').addEventListener('click', () => {
            this.closeHistory();
            this.closeCollection();
            this.closeAchievements();
        });
    }
}

// 初始化应用
let cardSystem;
document.addEventListener('DOMContentLoaded', () => {
    cardSystem = new CardDrawSystem();
});
