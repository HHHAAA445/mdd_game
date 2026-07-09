(function() {
    // ---------- 音效系统 ----------
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;
    let soundEnabled = true;

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new AudioCtx();
        }
    }

    function playSound(type) {
        if (!soundEnabled) return;
        try {
            initAudio();
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            switch(type) {
                case 'shoot':
                    osc.frequency.setValueAtTime(1200, now);
                    osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);
                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
                    osc.start(now);
                    osc.stop(now + 0.06);
                    break;
                case 'build':
                    osc.frequency.setValueAtTime(400, now);
                    osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                    osc.start(now);
                    osc.stop(now + 0.12);
                    break;
                case 'upgrade':
                    osc.frequency.setValueAtTime(500, now);
                    osc.frequency.exponentialRampToValueAtTime(1000, now + 0.15);
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
                    osc.start(now);
                    osc.stop(now + 0.18);
                    const osc2 = audioCtx.createOscillator();
                    const gain2 = audioCtx.createGain();
                    osc2.connect(gain2);
                    gain2.connect(audioCtx.destination);
                    osc2.frequency.setValueAtTime(700, now + 0.08);
                    osc2.frequency.exponentialRampToValueAtTime(1200, now + 0.2);
                    gain2.gain.setValueAtTime(0.15, now + 0.08);
                    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
                    osc2.start(now + 0.08);
                    osc2.stop(now + 0.22);
                    break;
                case 'kill':
                    osc.frequency.setValueAtTime(300, now);
                    osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                    osc.start(now);
                    osc.stop(now + 0.1);
                    break;
                case 'gameover':
                    osc.frequency.setValueAtTime(500, now);
                    osc.frequency.exponentialRampToValueAtTime(100, now + 0.5);
                    gain.gain.setValueAtTime(0.3, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
                    osc.start(now);
                    osc.stop(now + 0.6);
                    break;
                case 'boss':
                    osc.frequency.setValueAtTime(150, now);
                    osc.frequency.exponentialRampToValueAtTime(80, now + 0.4);
                    gain.gain.setValueAtTime(0.35, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                    osc.start(now);
                    osc.stop(now + 0.5);
                    const osc3 = audioCtx.createOscillator();
                    const gain3 = audioCtx.createGain();
                    osc3.connect(gain3);
                    gain3.connect(audioCtx.destination);
                    osc3.frequency.setValueAtTime(120, now + 0.15);
                    osc3.frequency.exponentialRampToValueAtTime(60, now + 0.5);
                    gain3.gain.setValueAtTime(0.25, now + 0.15);
                    gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
                    osc3.start(now + 0.15);
                    osc3.stop(now + 0.55);
                    break;
                default:
                    break;
            }
        } catch(e) {}
    }

    // ---------- 设置系统 ----------
    const SETTINGS_DEFAULTS = {
        difficulty: 12,
        speedMultiplier: 2,
        startGold: 150,
        rewardMultiplier: 1,
        towerDamage: 20,
        towerRange: 120,
        towerFireRate: 30,
        sound: true
    };

    let currentSettings = { ...SETTINGS_DEFAULTS };

    // 加载保存的设置
    function loadSettings() {
        try {
            const saved = localStorage.getItem('td_settings');
            if (saved) {
                const parsed = JSON.parse(saved);
                currentSettings = { ...SETTINGS_DEFAULTS, ...parsed };
            }
        } catch(e) {}
        // 同步UI
        document.getElementById('difficultySlider').value = currentSettings.difficulty;
        document.getElementById('difficultyValue').textContent = currentSettings.difficulty + 'x';
        document.getElementById('speedSlider').value = currentSettings.speedMultiplier;
        document.getElementById('speedValue').textContent = currentSettings.speedMultiplier.toFixed(1) + 'x';
        document.getElementById('startGoldSlider').value = currentSettings.startGold;
        document.getElementById('startGoldValue').textContent = currentSettings.startGold;
        document.getElementById('rewardSlider').value = currentSettings.rewardMultiplier;
        document.getElementById('rewardValue').textContent = currentSettings.rewardMultiplier.toFixed(1) + 'x';
        document.getElementById('towerDamageSlider').value = currentSettings.towerDamage;
        document.getElementById('towerDamageValue').textContent = currentSettings.towerDamage;
        document.getElementById('towerRangeSlider').value = currentSettings.towerRange;
        document.getElementById('towerRangeValue').textContent = currentSettings.towerRange;
        document.getElementById('towerFireRateSlider').value = currentSettings.towerFireRate;
        document.getElementById('towerFireRateValue').textContent = currentSettings.towerFireRate;
        soundEnabled = currentSettings.sound;
        updateSoundButton();
    }

    function saveSettings() {
        try {
            localStorage.setItem('td_settings', JSON.stringify(currentSettings));
        } catch(e) {}
    }

    function updateSoundButton() {
        const btn = document.getElementById('soundToggleBtn');
        if (soundEnabled) {
            btn.textContent = '🔊 开启';
            btn.className = 'toggle-btn';
        } else {
            btn.textContent = '🔇 关闭';
            btn.className = 'toggle-btn off';
        }
    }

    // ---------- 设置面板 ----------
    const settingsModal = document.getElementById('settingsModal');
    const settingsBtn = document.getElementById('settingsBtn');
    const closeSettings = document.getElementById('closeSettings');

    function showSettings() {
        settingsModal.classList.add('show');
        settingsModal.style.display = 'flex';
    }

    function hideSettings() {
        settingsModal.classList.remove('show');
        settingsModal.style.display = 'none';
    }

    settingsBtn.addEventListener('click', showSettings);
    closeSettings.addEventListener('click', hideSettings);
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) hideSettings();
    });

    // 设置滑块实时更新
    document.getElementById('difficultySlider').addEventListener('input', function() {
        document.getElementById('difficultyValue').textContent = this.value + 'x';
    });
    document.getElementById('speedSlider').addEventListener('input', function() {
        document.getElementById('speedValue').textContent = parseFloat(this.value).toFixed(1) + 'x';
    });
    document.getElementById('startGoldSlider').addEventListener('input', function() {
        document.getElementById('startGoldValue').textContent = this.value;
    });
    document.getElementById('rewardSlider').addEventListener('input', function() {
        document.getElementById('rewardValue').textContent = parseFloat(this.value).toFixed(1) + 'x';
    });
    document.getElementById('towerDamageSlider').addEventListener('input', function() {
        document.getElementById('towerDamageValue').textContent = this.value;
    });
    document.getElementById('towerRangeSlider').addEventListener('input', function() {
        document.getElementById('towerRangeValue').textContent = this.value;
    });
    document.getElementById('towerFireRateSlider').addEventListener('input', function() {
        document.getElementById('towerFireRateValue').textContent = this.value;
    });

    // 音效切换
    document.getElementById('soundToggleBtn').addEventListener('click', function() {
        soundEnabled = !soundEnabled;
        currentSettings.sound = soundEnabled;
        updateSoundButton();
        if (soundEnabled) playSound('build');
    });

    // 应用设置
    document.getElementById('applySettingsBtn').addEventListener('click', function() {
        currentSettings.difficulty = parseFloat(document.getElementById('difficultySlider').value);
        currentSettings.speedMultiplier = parseFloat(document.getElementById('speedSlider').value);
        currentSettings.startGold = parseInt(document.getElementById('startGoldSlider').value);
        currentSettings.rewardMultiplier = parseFloat(document.getElementById('rewardSlider').value);
        currentSettings.towerDamage = parseInt(document.getElementById('towerDamageSlider').value);
        currentSettings.towerRange = parseInt(document.getElementById('towerRangeSlider').value);
        currentSettings.towerFireRate = parseInt(document.getElementById('towerFireRateSlider').value);
        saveSettings();
        
        // 更新塔类型定义
        TOWER_TYPES.arrow.damage = Math.floor(currentSettings.towerDamage * 0.75);
        TOWER_TYPES.arrow.range = Math.floor(currentSettings.towerRange * 1.08);
        TOWER_TYPES.arrow.fireRate = Math.floor(currentSettings.towerFireRate * 0.5);
        TOWER_TYPES.cannon.damage = Math.floor(currentSettings.towerDamage * 2);
        TOWER_TYPES.cannon.range = Math.floor(currentSettings.towerRange * 0.92);
        TOWER_TYPES.cannon.fireRate = Math.floor(currentSettings.towerFireRate * 1.67);
        TOWER_TYPES.magic.damage = Math.floor(currentSettings.towerDamage * 1.75);
        TOWER_TYPES.magic.range = Math.floor(currentSettings.towerRange * 1.33);
        TOWER_TYPES.magic.fireRate = Math.floor(currentSettings.towerFireRate * 1.17);
        
        towerInfoDiv.textContent = '✅ 设置已应用！重新开始游戏生效';
        hideSettings();
        playSound('upgrade');
    });

    // 恢复默认
    document.getElementById('resetSettingsBtn').addEventListener('click', function() {
        Object.assign(currentSettings, SETTINGS_DEFAULTS);
        document.getElementById('difficultySlider').value = SETTINGS_DEFAULTS.difficulty;
        document.getElementById('difficultyValue').textContent = SETTINGS_DEFAULTS.difficulty + 'x';
        document.getElementById('speedSlider').value = SETTINGS_DEFAULTS.speedMultiplier;
        document.getElementById('speedValue').textContent = SETTINGS_DEFAULTS.speedMultiplier.toFixed(1) + 'x';
        document.getElementById('startGoldSlider').value = SETTINGS_DEFAULTS.startGold;
        document.getElementById('startGoldValue').textContent = SETTINGS_DEFAULTS.startGold;
        document.getElementById('rewardSlider').value = SETTINGS_DEFAULTS.rewardMultiplier;
        document.getElementById('rewardValue').textContent = SETTINGS_DEFAULTS.rewardMultiplier.toFixed(1) + 'x';
        document.getElementById('towerDamageSlider').value = SETTINGS_DEFAULTS.towerDamage;
        document.getElementById('towerDamageValue').textContent = SETTINGS_DEFAULTS.towerDamage;
        document.getElementById('towerRangeSlider').value = SETTINGS_DEFAULTS.towerRange;
        document.getElementById('towerRangeValue').textContent = SETTINGS_DEFAULTS.towerRange;
        document.getElementById('towerFireRateSlider').value = SETTINGS_DEFAULTS.towerFireRate;
        document.getElementById('towerFireRateValue').textContent = SETTINGS_DEFAULTS.towerFireRate;
        soundEnabled = SETTINGS_DEFAULTS.sound;
        updateSoundButton();
        saveSettings();
        towerInfoDiv.textContent = '↩️ 已恢复默认设置';
        playSound('build');
    });

    // ---------- 检测设备类型 ----------
    function isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    const isMobile = isTouchDevice();

    // ---------- 难度系数 ----------
    let DIFFICULTY_MULTIPLIER = currentSettings.difficulty;
    let SPEED_MULTIPLIER = currentSettings.speedMultiplier;
    let REWARD_MULTIPLIER = currentSettings.rewardMultiplier;

    // ---------- 画布 ----------
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // ---------- UI 元素 ----------
    const livesSpan = document.getElementById('livesDisplay');
    const goldSpan = document.getElementById('goldDisplay');
    const waveSpan = document.getElementById('waveDisplay');
    const enemiesKilledSpan = document.getElementById('enemiesKilledDisplay');
    const towerInfoDiv = document.getElementById('towerInfo');
    const selectedTowerDisplay = document.getElementById('selectedTowerDisplay');
    const hintText = document.getElementById('hintText');

    if (isMobile) {
        hintText.textContent = '| 点击建造 · 长按操作';
    }

    // ---------- 弹窗控制 ----------
    const helpModal = document.getElementById('helpModal');
    const closeHelpBtn = document.getElementById('closeHelp');
    const closeHelpBtn2 = document.getElementById('closeHelpBtn');
    const helpBtn = document.getElementById('helpBtn');

    function showHelp() {
        helpModal.classList.add('show');
        helpModal.style.display = 'flex';
    }
    function hideHelp() {
        helpModal.classList.remove('show');
        helpModal.style.display = 'none';
    }

    helpBtn.addEventListener('click', showHelp);
    closeHelpBtn.addEventListener('click', hideHelp);
    closeHelpBtn2.addEventListener('click', hideHelp);
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) hideHelp();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && helpModal.classList.contains('show')) hideHelp();
    });

    // ---------- 塔信息弹窗 ----------
    const infoModal = document.getElementById('towerInfoModal');
    const closeInfo = document.getElementById('closeInfo');
    const closeInfoBtn = document.getElementById('closeInfoBtn');

    function showTowerInfo(tower) {
        const type = TOWER_TYPES[tower.type];
        const speedText = tower.fireRate < 20 ? '极快' : tower.fireRate < 35 ? '快' : tower.fireRate < 50 ? '中等' : '慢';
        document.getElementById('infoTitle').textContent = `${tower.icon} ${type.name}`;
        document.getElementById('infoLevel').textContent = tower.level;
        document.getElementById('infoType').textContent = type.name;
        document.getElementById('infoDamage').textContent = tower.damage;
        document.getElementById('infoRange').textContent = tower.range;
        document.getElementById('infoSpeed').textContent = speedText;
        document.getElementById('infoHealth').textContent = `${tower.health}/${tower.maxHealth}`;
        document.getElementById('infoCost').textContent = `${tower.cost}💰`;
        const upgradeCost = Math.floor(30 * (1 + tower.level * 0.5));
        document.getElementById('infoUpgradeCost').textContent = `${upgradeCost}💰`;
        infoModal.classList.add('show');
        infoModal.style.display = 'flex';
    }

    function hideTowerInfo() {
        infoModal.classList.remove('show');
        infoModal.style.display = 'none';
    }

    closeInfo.addEventListener('click', hideTowerInfo);
    closeInfoBtn.addEventListener('click', hideTowerInfo);
    infoModal.addEventListener('click', (e) => {
        if (e.target === infoModal) hideTowerInfo();
    });

    // ---------- 塔类型定义 ----------
    let TOWER_TYPES = {
        arrow: {
            name: '弓箭塔',
            icon: '🏹',
            cost: 60,
            range: Math.floor(currentSettings.towerRange * 1.08),
            damage: Math.floor(currentSettings.towerDamage * 0.75),
            fireRate: Math.floor(currentSettings.towerFireRate * 0.5),
            color: '#4CAF50',
            desc: '攻速快·伤害低'
        },
        cannon: {
            name: '炮塔',
            icon: '💣',
            cost: 80,
            range: Math.floor(currentSettings.towerRange * 0.92),
            damage: Math.floor(currentSettings.towerDamage * 2),
            fireRate: Math.floor(currentSettings.towerFireRate * 1.67),
            color: '#FF6B35',
            desc: '范围伤害·攻速慢',
            splash: 50
        },
        magic: {
            name: '魔法塔',
            icon: '🔮',
            cost: 100,
            range: Math.floor(currentSettings.towerRange * 1.33),
            damage: Math.floor(currentSettings.towerDamage * 1.75),
            fireRate: Math.floor(currentSettings.towerFireRate * 1.17),
            color: '#9B59B6',
            desc: '高伤害·射程远'
        }
    };

    let selectedTowerType = 'arrow';

    // ---------- 塔类型切换菜单 ----------
    const towerMenu = document.getElementById('towerMenu');
    const switchTowerBtn = document.getElementById('switchTowerBtn');
    let towerMenuVisible = false;

    function updateSelectedDisplay() {
        const type = TOWER_TYPES[selectedTowerType];
        selectedTowerDisplay.textContent = `${type.icon} ${type.name}`;
    }

    switchTowerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        towerMenuVisible = !towerMenuVisible;
        towerMenu.style.display = towerMenuVisible ? 'block' : 'none';
        if (towerMenuVisible) {
            const rect = switchTowerBtn.getBoundingClientRect();
            towerMenu.style.left = rect.left + 'px';
            towerMenu.style.top = (rect.bottom + 5) + 'px';
        }
    });

    document.querySelectorAll('.tower-option').forEach(el => {
        el.addEventListener('click', () => {
            const type = el.dataset.type;
            if (type && TOWER_TYPES[type]) {
                selectedTowerType = type;
                updateSelectedDisplay();
                towerMenuVisible = false;
                towerMenu.style.display = 'none';
                document.querySelectorAll('.tower-option').forEach(o => o.classList.remove('active'));
                el.classList.add('active');
            }
        });
    });

    document.addEventListener('click', () => {
        towerMenuVisible = false;
        towerMenu.style.display = 'none';
    });

    updateSelectedDisplay();

    // ---------- 右键/长按菜单 ----------
    const contextMenu = document.getElementById('contextMenu');
    let contextTarget = null;
    let longPressTimer = null;
    let isLongPress = false;

    function showContextMenu(x, y, tower) {
        contextTarget = tower;
        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';
        contextMenu.style.display = 'block';
    }

    function hideContextMenu() {
        contextMenu.style.display = 'none';
        contextTarget = null;
        isLongPress = false;
    }

    document.getElementById('menuInfo').addEventListener('click', () => {
        if (contextTarget) {
            showTowerInfo(contextTarget);
            hideContextMenu();
        }
    });

    document.getElementById('menuUpgrade').addEventListener('click', () => {
        if (contextTarget) {
            upgradeTower(contextTarget.col, contextTarget.row);
            hideContextMenu();
        }
    });

    document.getElementById('menuSell').addEventListener('click', () => {
        if (contextTarget) {
            sellTower(contextTarget.col, contextTarget.row);
            hideContextMenu();
        }
    });

    document.getElementById('menuCancel').addEventListener('click', hideContextMenu);
    document.addEventListener('click', hideContextMenu);

    // ---------- 游戏常量 ----------
    const COLS = 12;
    const ROWS = 9;
    const CELL_SIZE = 60;

    const waypoints = [
        { x: 0, y: 0 }, { x: 3, y: 0 }, { x: 3, y: 3 },
        { x: 8, y: 3 }, { x: 8, y: 6 }, { x: 5, y: 6 },
        { x: 5, y: 8 }, { x: 11, y: 8 }
    ];

    function getPixelFromGrid(col, row) {
        return { x: col * CELL_SIZE + CELL_SIZE/2, y: row * CELL_SIZE + CELL_SIZE/2 };
    }
    const pathPoints = waypoints.map(wp => getPixelFromGrid(wp.x, wp.y));

    // ---------- 游戏状态 ----------
    let towers = [];
    let enemies = [];
    let bullets = [];
    let gold = currentSettings.startGold;
    let lives = 3;
    let wave = 0;
    let gameOver = false;
    let enemySpawnCounter = 0;
    let enemiesThisWave = 0;
    let enemiesSpawned = 0;
    let waveInProgress = false;
    let totalKills = 0;
    let bossSpawned = false;
    let hoveredCell = null;

    // ---------- 敌人动态属性 ----------
    function getEnemyBaseHealth(waveNum) {
        return 30 + waveNum * 12 * DIFFICULTY_MULTIPLIER + Math.floor(totalKills / 15) * 5 * DIFFICULTY_MULTIPLIER;
    }
    function getEnemyBaseSpeed(waveNum) {
        return 1.2 + Math.min(waveNum * 0.12 * SPEED_MULTIPLIER, 2.2 * SPEED_MULTIPLIER) + Math.floor(totalKills / 30) * 0.04 * SPEED_MULTIPLIER;
    }
    function getEnemyReward(waveNum) {
        return (20 + waveNum * 6 + Math.floor(totalKills / 20) * 3) * DIFFICULTY_MULTIPLIER * REWARD_MULTIPLIER;
    }
    function getEnemiesCount(waveNum) {
        return 5 + waveNum * 3 * DIFFICULTY_MULTIPLIER + Math.floor(totalKills / 25) * DIFFICULTY_MULTIPLIER;
    }

    function getBossHealth(waveNum) {
        return (300 + waveNum * 80) * DIFFICULTY_MULTIPLIER;
    }
    function getBossSpeed(waveNum) {
        return 0.8 + Math.min(waveNum * 0.04 * SPEED_MULTIPLIER, 0.8 * SPEED_MULTIPLIER);
    }
    function getBossReward(waveNum) {
        return (100 + waveNum * 20) * DIFFICULTY_MULTIPLIER * REWARD_MULTIPLIER;
    }

    // ---------- 辅助函数 ----------
    function gridToPixel(col, row) {
        return { x: col * CELL_SIZE + CELL_SIZE/2, y: row * CELL_SIZE + CELL_SIZE/2 };
    }
    function pixelToGrid(px, py) {
        const col = Math.floor(px / CELL_SIZE);
        const row = Math.floor(py / CELL_SIZE);
        if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return null;
        return { col, row };
    }
    function isPathCell(col, row) {
        for (let i = 0; i < waypoints.length - 1; i++) {
            const p1 = waypoints[i];
            const p2 = waypoints[i+1];
            const minX = Math.min(p1.x, p2.x);
            const maxX = Math.max(p1.x, p2.x);
            const minY = Math.min(p1.y, p2.y);
            const maxY = Math.max(p1.y, p2.y);
            if (p1.x === p2.x && col === p1.x && row >= minY && row <= maxY) return true;
            if (p1.y === p2.y && row === p1.y && col >= minX && col <= maxX) return true;
        }
        return false;
    }
    function canPlaceTower(col, row) {
        if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return false;
        if (isPathCell(col, row)) return false;
        for (let t of towers) {
            if (t.col === col && t.row === row) return false;
        }
        return true;
    }
    function getTowerAt(col, row) {
        return towers.find(t => t.col === col && t.row === row);
    }
    function distance(x1, y1, x2, y2) {
        return Math.hypot(x2 - x1, y2 - y1);
    }

    // ---------- 波次管理 ----------
    function startWave() {
        if (gameOver || waveInProgress) return;
        wave++;
        enemiesThisWave = getEnemiesCount(wave);
        enemiesSpawned = 0;
        enemySpawnCounter = 0;
        waveInProgress = true;
        bossSpawned = false;
        
        if (wave % 5 === 0) {
            enemiesThisWave++;
            towerInfoDiv.textContent = `👑 BOSS波！第 ${wave} 波开始！`;
            playSound('boss');
        } else {
            towerInfoDiv.textContent = `⚔️ 第 ${wave} 波开始！敌人数量: ${enemiesThisWave}`;
        }
        updateUI();
    }

    function spawnEnemy() {
        const start = pathPoints[0];
        const isBoss = (wave % 5 === 0) && !bossSpawned && enemiesSpawned === enemiesThisWave - 1;
        
        let health, speed, reward, size, isBossEnemy = false;
        
        if (isBoss) {
            health = getBossHealth(wave);
            speed = getBossSpeed(wave);
            reward = getBossReward(wave);
            size = 35;
            isBossEnemy = true;
            bossSpawned = true;
            towerInfoDiv.textContent = `👑 BOSS出现！血量: ${health}`;
            playSound('boss');
        } else {
            health = getEnemyBaseHealth(wave);
            speed = getEnemyBaseSpeed(wave);
            reward = getEnemyReward(wave);
            size = 16 + Math.random() * 4;
        }
        
        const level = isBossEnemy ? Math.floor(wave / 3) + 2 : Math.floor(wave / 3) + 1;
        
        enemies.push({
            x: start.x, y: start.y,
            health: health,
            maxHealth: health,
            speed: speed,
            reward: reward,
            pathIndex: 0,
            alive: true,
            reachedEnd: false,
            level: level,
            size: size,
            isBoss: isBossEnemy,
            attackCooldown: 0,
            attackDamage: isBossEnemy ? 8 + wave : 2 + Math.floor(wave / 3),
            attackRange: 50,
            targetTower: null
        });
    }

    // ---------- 更新逻辑 ----------
    function updateEnemies() {
        for (let i = enemies.length - 1; i >= 0; i--) {
            const e = enemies[i];
            if (!e.alive) continue;
            
            const targetIdx = e.pathIndex;
            if (targetIdx >= pathPoints.length) {
                e.alive = false;
                e.reachedEnd = true;
                lives--;
                if (lives < 0) lives = 0;
                updateUI();
                if (lives <= 0) { gameOver = true; waveInProgress = false; playSound('gameover'); }
                continue;
            }
            
            e.attackCooldown = Math.max(0, e.attackCooldown - 1);
            
            let nearestTower = null;
            let nearestDist = Infinity;
            for (let t of towers) {
                const tPos = gridToPixel(t.col, t.row);
                const dist = distance(e.x, e.y, tPos.x, tPos.y);
                if (dist < e.attackRange && dist < nearestDist && t.health > 0) {
                    nearestDist = dist;
                    nearestTower = t;
                }
            }
            
            if (nearestTower && e.attackCooldown <= 0) {
                nearestTower.health -= e.attackDamage;
                e.attackCooldown = 30;
                if (nearestTower.health <= 0) {
                    const idx = towers.indexOf(nearestTower);
                    if (idx > -1) {
                        towers.splice(idx, 1);
                        towerInfoDiv.textContent = `💥 塔被摧毁！`;
                    }
                }
                continue;
            }
            
            const target = pathPoints[targetIdx];
            const dx = target.x - e.x;
            const dy = target.y - e.y;
            const dist = Math.hypot(dx, dy);
            
            if (dist < 1) { 
                e.pathIndex++; 
                continue; 
            }
            
            const step = Math.min(e.speed, dist);
            e.x += (dx / dist) * step;
            e.y += (dy / dist) * step;
        }
        enemies = enemies.filter(e => e.alive && !e.reachedEnd);
    }

    function updateTowers() {
        for (let t of towers) {
            if (t.health <= 0) continue;
            if (t.cooldown > 0) { t.cooldown--; continue; }
            
            const towerPos = gridToPixel(t.col, t.row);
            let targetEnemy = null;
            let targetDist = Infinity;
            
            for (let e of enemies) {
                if (!e.alive) continue;
                const dist = distance(towerPos.x, towerPos.y, e.x, e.y);
                if (dist <= t.range && dist < targetDist) {
                    if (e.isBoss) {
                        targetEnemy = e;
                        targetDist = dist;
                        break;
                    }
                    targetEnemy = e;
                    targetDist = dist;
                }
            }
            
            if (targetEnemy) {
                let damage = t.damage;
                let isSplash = false;
                
                if (t.type === 'cannon') {
                    isSplash = true;
                    for (let e of enemies) {
                        if (!e.alive) continue;
                        const dist = distance(targetEnemy.x, targetEnemy.y, e.x, e.y);
                        if (dist <= 50) {
                            e.health -= damage * 0.6;
                            if (e.health <= 0) {
                                e.alive = false;
                                const reward = Math.floor(e.reward * REWARD_MULTIPLIER);
                                gold += reward;
                                totalKills++;
                                playSound('kill');
                                updateUI();
                            }
                        }
                    }
                    targetEnemy.health -= damage * 0.4;
                } else {
                    targetEnemy.health -= damage;
                }
                
                t.cooldown = t.fireRate;
                playSound('shoot');
                
                bullets.push({
                    startX: towerPos.x,
                    startY: towerPos.y,
                    endX: targetEnemy.x,
                    endY: targetEnemy.y,
                    progress: 0,
                    speed: 0.15 + (t.type === 'arrow' ? 0.05 : 0),
                    active: true,
                    color: t.type === 'arrow' ? '#4CAF50' : t.type === 'cannon' ? '#FF6B35' : '#9B59B6',
                    isSplash: isSplash
                });
                
                if (targetEnemy.health <= 0) {
                    targetEnemy.alive = false;
                    const reward = Math.floor(targetEnemy.reward * REWARD_MULTIPLIER);
                    gold += reward;
                    totalKills++;
                    playSound('kill');
                    if (targetEnemy.isBoss) {
                        towerInfoDiv.textContent = `👑 BOSS击杀！奖励 ${reward}💰`;
                        playSound('upgrade');
                    }
                    updateUI();
                }
            }
        }
    }

    function updateBullets() {
        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            if (!b.active) continue;
            b.progress += b.speed;
            if (b.progress >= 1) {
                b.active = false;
            }
        }
        bullets = bullets.filter(b => b.active);
    }

    // ---------- 塔升级系统 ----------
    function upgradeTower(col, row) {
        const tower = getTowerAt(col, row);
        if (!tower) {
            towerInfoDiv.textContent = '❌ 此处没有塔可以升级';
            return false;
        }
        
        const upgradeCost = Math.floor(30 * (1 + tower.level * 0.5));
        if (gold < upgradeCost) {
            towerInfoDiv.textContent = `❌ 金币不足！升级需要 ${upgradeCost}💰`;
            goldSpan.style.color = '#ff9f9f';
            setTimeout(() => goldSpan.style.color = '', 300);
            return false;
        }
        
        gold -= upgradeCost;
        tower.level++;
        tower.damage = Math.floor(tower.baseDamage * (1 + tower.level * 0.3));
        tower.range = Math.floor(tower.baseRange * (1 + tower.level * 0.08));
        tower.fireRate = Math.max(8, Math.floor(tower.baseFireRate * (1 - tower.level * 0.06)));
        
        playSound('upgrade');
        updateUI();
        towerInfoDiv.textContent = `⬆️ ${tower.icon}升级成功！Lv.${tower.level} 伤害:${tower.damage}`;
        return true;
    }

    function sellTower(col, row) {
        const tower = getTowerAt(col, row);
        if (!tower) {
            towerInfoDiv.textContent = '❌ 此处没有塔可以拆除';
            return false;
        }
        
        const refund = Math.floor(tower.cost * 0.5);
        gold += refund;
        const idx = towers.indexOf(tower);
        if (idx > -1) {
            towers.splice(idx, 1);
            towerInfoDiv.textContent = `💰 拆除塔，返还 ${refund}💰`;
            updateUI();
            return true;
        }
        return false;
    }

    // ---------- 绘制 ----------
    function draw() {
        ctx.clearRect(0, 0, 720, 540);
        
        // 网格
        ctx.strokeStyle = '#3f718a';
        ctx.lineWidth = 1;
        for (let i = 0; i <= COLS; i++) {
            ctx.beginPath();
            ctx.moveTo(i * CELL_SIZE, 0);
            ctx.lineTo(i * CELL_SIZE, 540);
            ctx.stroke();
        }
        for (let i = 0; i <= ROWS; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * CELL_SIZE);
            ctx.lineTo(720, i * CELL_SIZE);
            ctx.stroke();
        }
        
        // 悬停高亮
        if (hoveredCell && !gameOver) {
            const { col, row } = hoveredCell;
            if (!isPathCell(col, row) && canPlaceTower(col, row)) {
                ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
                ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
                ctx.lineWidth = 3;
                ctx.strokeRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            } else if (isPathCell(col, row)) {
                ctx.fillStyle = 'rgba(255, 0, 0, 0.15)';
                ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
        
        // 路径
        ctx.shadowColor = '#aad4ff';
        ctx.shadowBlur = 8;
        for (let i = 0; i < waypoints.length - 1; i++) {
            const from = gridToPixel(waypoints[i].x, waypoints[i].y);
            const to = gridToPixel(waypoints[i+1].x, waypoints[i+1].y);
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.strokeStyle = '#f5d742';
            ctx.lineWidth = 10;
            ctx.shadowBlur = 14;
            ctx.stroke();
            ctx.strokeStyle = '#ffec9e';
            ctx.lineWidth = 4;
            ctx.shadowBlur = 20;
            ctx.stroke();
        }
        ctx.shadowBlur = 0;
        
        const startP = gridToPixel(waypoints[0].x, waypoints[0].y);
        const endP = gridToPixel(waypoints[waypoints.length-1].x, waypoints[waypoints.length-1].y);
        ctx.fillStyle = '#46d646';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(startP.x, startP.y, 12, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#ff4d6d';
        ctx.beginPath();
        ctx.arc(endP.x, endP.y, 12, 0, Math.PI*2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // 绘制塔 (无星星)
        for (let t of towers) {
            const pos = gridToPixel(t.col, t.row);
            const healthPercent = t.health / t.maxHealth;
            
            ctx.shadowBlur = 16;
            ctx.shadowColor = '#7fc3ff';
            ctx.fillStyle = t.color;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 22, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = t.color + '99';
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 16, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(t.icon, pos.x, pos.y - 2);
            
            // 等级数字
            ctx.fillStyle = '#ffd700';
            ctx.font = 'bold 11px Arial';
            ctx.fillText(`Lv${t.level}`, pos.x, pos.y - 34);
            
            const barWidth = 30;
            const barX = pos.x - barWidth/2;
            const barY = pos.y + 28;
            ctx.fillStyle = '#222';
            ctx.fillRect(barX, barY, barWidth, 4);
            ctx.fillStyle = healthPercent > 0.6 ? '#41c941' : healthPercent > 0.3 ? '#f5b042' : '#ff4444';
            ctx.fillRect(barX, barY, barWidth * healthPercent, 4);
            
            ctx.shadowBlur = 0;
            ctx.strokeStyle = 'rgba(170, 208, 255, 0.15)';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 8]);
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, t.range, 0, Math.PI*2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        
        // 子弹
        for (let b of bullets) {
            if (!b.active) continue;
            const progress = b.progress;
            const x = b.startX + (b.endX - b.startX) * progress;
            const y = b.startY + (b.endY - b.startY) * progress;
            ctx.shadowBlur = 20;
            ctx.shadowColor = b.color;
            ctx.fillStyle = b.color;
            ctx.beginPath();
            ctx.arc(x, y, b.isSplash ? 8 : 5, 0, Math.PI*2);
            ctx.fill();
            if (b.isSplash) {
                ctx.fillStyle = b.color + '44';
                ctx.beginPath();
                ctx.arc(x, y, 16, 0, Math.PI*2);
                ctx.fill();
            }
            ctx.shadowBlur = 0;
        }
        
        // 敌人
        for (let e of enemies) {
            if (!e.alive) continue;
            const healthPercent = e.health / e.maxHealth;
            ctx.shadowBlur = e.isBoss ? 30 : 18;
            ctx.shadowColor = e.isBoss ? '#ff4400' : '#ff8866';
            
            const hue = e.isBoss ? 0 : (e.level * 30 + 340) % 360;
            ctx.fillStyle = e.isBoss ? '#ff2200' : `hsl(${hue}, 80%, 50%)`;
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.size || 18, 0, Math.PI*2);
            ctx.fill();
            
            if (e.isBoss) {
                ctx.fillStyle = '#ffd700';
                ctx.font = '20px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('👑', e.x, e.y - 5);
                ctx.strokeStyle = '#ff4400';
                ctx.lineWidth = 3;
                ctx.setLineDash([8, 8]);
                ctx.beginPath();
                ctx.arc(e.x, e.y, e.size + 8, 0, Math.PI*2);
                ctx.stroke();
                ctx.setLineDash([]);
            } else {
                ctx.fillStyle = `hsl(${hue}, 90%, 65%)`;
                ctx.beginPath();
                ctx.arc(e.x-3, e.y-4, (e.size || 18) * 0.5, 0, Math.PI*2);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.font = '9px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(`Lv${e.level}`, e.x, e.y - 2);
            }
            
            ctx.shadowBlur = 0;
            const barWidth = e.isBoss ? 50 : 30;
            const barX = e.x - barWidth/2;
            const barY = e.y - (e.size || 18) - 14;
            ctx.fillStyle = '#222';
            ctx.fillRect(barX, barY, barWidth, 6);
            ctx.fillStyle = healthPercent > 0.6 ? '#41c941' : healthPercent > 0.3 ? '#f5b042' : '#ff4444';
            ctx.fillRect(barX, barY, barWidth * healthPercent, 6);
        }
        
        if (gameOver) {
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = '#1a1e2a';
            ctx.fillRect(0, 0, 720, 540);
            ctx.globalAlpha = 1;
            ctx.fillStyle = '#f0e9d0';
            ctx.font = 'bold 46px "Segoe UI"';
            ctx.shadowBlur = 30;
            ctx.shadowColor = '#000';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('💔 游戏结束', 360, 230);
            ctx.font = '24px "Segoe UI"';
            ctx.fillText(`击杀数: ${totalKills} | 到达波次: ${wave}`, 360, 300);
            ctx.shadowBlur = 0;
        } else if (!waveInProgress && !gameOver) {
            ctx.globalAlpha = 0.6;
            ctx.fillStyle = '#cbe5f5';
            ctx.font = '18px "Segoe UI"';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(isMobile ? '点击建造 · 长按操作塔' : '点击建造 · 右键操作塔', 360, 510);
            ctx.globalAlpha = 1;
        }
    }

    function updateUI() {
        livesSpan.textContent = lives;
        goldSpan.textContent = gold;
        waveSpan.textContent = wave;
        enemiesKilledSpan.textContent = totalKills;
    }

    // ---------- 游戏循环 ----------
    function gameLoop() {
        if (!gameOver) {
            if (waveInProgress) {
                if (enemiesSpawned < enemiesThisWave) {
                    enemySpawnCounter++;
                    const spawnRate = Math.max(3, Math.floor(20 - wave * 0.8 * 3));
                    if (enemySpawnCounter >= spawnRate) {
                        spawnEnemy();
                        enemiesSpawned++;
                        enemySpawnCounter = 0;
                    }
                } else if (enemies.length === 0) {
                    waveInProgress = false;
                    const bonus = (30 + wave * 5) * DIFFICULTY_MULTIPLIER * REWARD_MULTIPLIER;
                    gold += Math.floor(bonus);
                    towerInfoDiv.textContent = `🎉 第 ${wave} 波完成！奖励 ${Math.floor(bonus)}💰`;
                    updateUI();
                }
            }
            updateTowers();
            updateEnemies();
            updateBullets();
            if (lives <= 0) {
                gameOver = true;
                waveInProgress = false;
                towerInfoDiv.textContent = '💔 游戏结束！点击"重来"重新开始';
                playSound('gameover');
            }
            updateUI();
        }
        draw();
        requestAnimationFrame(gameLoop);
    }

    // ---------- 重置游戏 ----------
    function resetGame() {
        towers = [];
        enemies = [];
        bullets = [];
        gold = currentSettings.startGold;
        lives = 3;
        wave = 0;
        gameOver = false;
        waveInProgress = false;
        enemiesSpawned = 0;
        enemiesThisWave = 0;
        enemySpawnCounter = 0;
        totalKills = 0;
        bossSpawned = false;
        DIFFICULTY_MULTIPLIER = currentSettings.difficulty;
        SPEED_MULTIPLIER = currentSettings.speedMultiplier;
        REWARD_MULTIPLIER = currentSettings.rewardMultiplier;
        towerInfoDiv.textContent = '🔄 游戏已重置，点击"下一波"开始';
        updateUI();
        hideContextMenu();
        hideTowerInfo();
    }

    // ---------- 事件绑定 ----------
    // 鼠标悬停
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;
        const grid = pixelToGrid(mouseX, mouseY);
        hoveredCell = grid;
        
        if (grid) {
            const { col, row } = grid;
            const tower = getTowerAt(col, row);
            if (tower) {
                const cost = Math.floor(30 * (1 + tower.level * 0.5));
                towerInfoDiv.textContent = `${tower.icon} Lv.${tower.level} | HP:${tower.health}/${tower.maxHealth} | 伤害:${tower.damage} | 射程:${tower.range} | 升级:${cost}💰 | ${isMobile ? '长按' : '右键'}操作`;
            } else if (!isPathCell(col, row)) {
                const type = TOWER_TYPES[selectedTowerType];
                towerInfoDiv.textContent = `📍 空地 (${col},${row}) 点击建造 ${type.name} (${type.cost}💰)`;
            } else {
                towerInfoDiv.textContent = `🛤️ 路径区域`;
            }
        }
    });

    canvas.addEventListener('mouseleave', () => {
        hoveredCell = null;
    });

    // ---------- 点击/触屏事件 ----------
    function handleCanvasInteraction(e) {
        e.preventDefault();
        if (gameOver) return;
        initAudio();
        
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        let clientX, clientY;
        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        const mouseX = (clientX - rect.left) * scaleX;
        const mouseY = (clientY - rect.top) * scaleY;
        const grid = pixelToGrid(mouseX, mouseY);
        if (!grid) return;
        const { col, row } = grid;
        
        const tower = getTowerAt(col, row);
        if (tower) {
            if (isMobile) {
                showTowerInfo(tower);
            }
            return;
        }
        
        const towerType = TOWER_TYPES[selectedTowerType];
        if (!towerType) return;
        
        if (canPlaceTower(col, row) && gold >= towerType.cost) {
            const newTower = {
                col, row,
                type: selectedTowerType,
                icon: towerType.icon,
                color: towerType.color,
                cost: towerType.cost,
                level: 1,
                cooldown: 0,
                health: 100,
                maxHealth: 100,
                baseDamage: towerType.damage,
                baseRange: towerType.range,
                baseFireRate: towerType.fireRate,
                damage: towerType.damage,
                range: towerType.range,
                fireRate: towerType.fireRate,
                splash: towerType.splash || 0
            };
            towers.push(newTower);
            gold -= towerType.cost;
            playSound('build');
            updateUI();
            towerInfoDiv.textContent = `${towerType.icon} ${towerType.name} 已建造 (Lv.1)`;
        } else if (gold < towerType.cost) {
            towerInfoDiv.textContent = `❌ 金币不足！需要 ${towerType.cost}💰`;
            goldSpan.style.color = '#ff9f9f';
            setTimeout(() => goldSpan.style.color = '', 300);
        } else {
            towerInfoDiv.textContent = '❌ 此处不能建造 (路径或已有塔)';
        }
    }

    if (!isMobile) {
        canvas.addEventListener('click', handleCanvasInteraction);
    } else {
        canvas.addEventListener('touchstart', handleCanvasInteraction, { passive: false });
    }

    // ---------- PC右键菜单 ----------
    canvas.addEventListener('contextmenu', (e) => {
        if (isMobile) return;
        e.preventDefault();
        if (gameOver) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;
        const grid = pixelToGrid(mouseX, mouseY);
        if (!grid) return;
        const { col, row } = grid;
        const tower = getTowerAt(col, row);
        if (tower) {
            showContextMenu(e.clientX, e.clientY, tower);
        }
    });

    // ---------- 手机长按 ----------
    if (isMobile) {
        let touchStartTime = 0;
        let touchStartPos = null;
        let longPressTriggered = false;

        canvas.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            touchStartTime = Date.now();
            touchStartPos = { x: touch.clientX, y: touch.clientY };
            longPressTriggered = false;
            
            longPressTimer = setTimeout(() => {
                if (!longPressTriggered && touchStartPos) {
                    longPressTriggered = true;
                    const rect = canvas.getBoundingClientRect();
                    const scaleX = canvas.width / rect.width;
                    const scaleY = canvas.height / rect.height;
                    const mouseX = (touchStartPos.x - rect.left) * scaleX;
                    const mouseY = (touchStartPos.y - rect.top) * scaleY;
                    const grid = pixelToGrid(mouseX, mouseY);
                    if (grid) {
                        const { col, row } = grid;
                        const tower = getTowerAt(col, row);
                        if (tower) {
                            showContextMenu(touchStartPos.x, touchStartPos.y, tower);
                            if (navigator.vibrate) navigator.vibrate(10);
                        }
                    }
                }
            }, 600);
        }, { passive: true });

        canvas.addEventListener('touchmove', () => {
            clearTimeout(longPressTimer);
        }, { passive: true });

        canvas.addEventListener('touchend', () => {
            clearTimeout(longPressTimer);
        }, { passive: true });
    }

    // ---------- 按钮事件 ----------
    document.getElementById('nextWaveBtn').addEventListener('click', () => {
        if (!gameOver && !waveInProgress) {
            initAudio();
            startWave();
        }
    });

    document.getElementById('restartBtn').addEventListener('click', resetGame);

    // ---------- 启动 ----------
    loadSettings();
    updateUI();
    towerInfoDiv.textContent = '🎮 选择塔类型 | 点击建造 | ' + (isMobile ? '长按操作塔' : '右键操作塔');
    
    setTimeout(() => {
        if (!localStorage.getItem('td_help_shown')) {
            showHelp();
            localStorage.setItem('td_help_shown', 'true');
        }
    }, 500);

    gameLoop();
})();