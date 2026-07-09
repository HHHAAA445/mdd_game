(function() {
    // ========== 音效系统 ==========
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;
    let soundEnabled = true;

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new AudioCtx();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playSound(type) {
        if (!soundEnabled) return;
        try {
            initAudio();
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            switch(type) {
                case 'shoot':
                    osc.frequency.setValueAtTime(800, now);
                    osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);
                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                    osc.start(now);
                    osc.stop(now + 0.1);
                    break;
                case 'hit':
                    osc.frequency.setValueAtTime(600, now);
                    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.06);
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                    osc.start(now);
                    osc.stop(now + 0.08);
                    break;
                case 'miss':
                    osc.frequency.setValueAtTime(300, now);
                    osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                    osc.start(now);
                    osc.stop(now + 0.12);
                    break;
                case 'gameover':
                    osc.frequency.setValueAtTime(400, now);
                    osc.frequency.exponentialRampToValueAtTime(80, now + 0.5);
                    gain.gain.setValueAtTime(0.25, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
                    osc.start(now);
                    osc.stop(now + 0.6);
                    break;
                case 'combo':
                    osc.frequency.setValueAtTime(500, now);
                    osc.frequency.exponentialRampToValueAtTime(1000, now + 0.1);
                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                    osc.start(now);
                    osc.stop(now + 0.12);
                    break;
                default:
                    break;
            }
        } catch(e) {}
    }

    // ========== 检测设备 ==========
    function isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    const isMobile = isTouchDevice();

    // ========== 画布 ==========
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const W = 800, H = 500;
    canvas.width = W;
    canvas.height = H;

    // ========== 防线位置 ==========
    const DEFENSE_LINE_X = 80;

    // ========== UI 元素 ==========
    const scoreDisplay = document.getElementById('scoreDisplay');
    const arrowsDisplay = document.getElementById('arrowsDisplay');
    const comboDisplay = document.getElementById('comboDisplay');
    const bestDisplay = document.getElementById('bestDisplay');
    const statusBar = document.getElementById('statusBar');
    const windDisplay = document.getElementById('windDisplay');
    const finalScore = document.getElementById('finalScore');
    const finalBest = document.getElementById('finalBest');
    const finalCombo = document.getElementById('finalCombo');
    const finalKills = document.getElementById('finalKills');
    const gameOverReason = document.getElementById('gameOverReason');
    const gameOverTitle = document.getElementById('gameOverTitle');
    const cheatWarning = document.getElementById('cheatWarning');
    const cheatBadge = document.getElementById('cheatBadge');

    // ========== 弹窗 ==========
    const helpModal = document.getElementById('helpModal');
    const closeHelp = document.getElementById('closeHelp');
    const closeHelpBtn = document.getElementById('closeHelpBtn');
    const helpBtn = document.getElementById('helpBtn');
    const gameOverModal = document.getElementById('gameOverModal');
    const restartBtn = document.getElementById('restartBtn');
    const restartFromGameOverBtn = document.getElementById('restartFromGameOverBtn');

    // ========== 设置面板 ==========
    const settingsModal = document.getElementById('settingsModal');
    const settingsBtn = document.getElementById('settingsBtn');
    const closeSettings = document.getElementById('closeSettings');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');

    // ========== 设置状态 ==========
    let settings = {
        infiniteArrows: false,
        godMode: false,
        oneHitKill: false,
        showLine: true,
        sound: true,
    };

    let cheatActive = false;

    function updateCheatStatus() {
        cheatActive = settings.infiniteArrows || settings.godMode || settings.oneHitKill;
        cheatBadge.style.display = cheatActive ? 'inline' : 'none';
        // 如果作弊开启，显示在状态栏
        if (cheatActive) {
            statusBar.textContent = '⚡ 金手指模式已开启（不计成绩）';
        }
    }

    // ========== 设置面板控制 ==========
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
    closeSettingsBtn.addEventListener('click', hideSettings);
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) hideSettings();
    });

    // ========== 设置切换函数 ==========
    function toggleSetting(settingName, btnElement, labelOn, labelOff) {
        settings[settingName] = !settings[settingName];
        btnElement.textContent = settings[settingName] ? labelOn : labelOff;
        btnElement.className = `toggle-btn ${settings[settingName] ? 'on' : 'off'}`;
        updateCheatStatus();
        // 保存设置
        saveSettings();
    }

    // 无限箭矢
    const infiniteArrowsBtn = document.getElementById('infiniteArrowsBtn');
    infiniteArrowsBtn.addEventListener('click', function() {
        toggleSetting('infiniteArrows', this, '🏹 开启', '关闭');
    });

    // 无敌模式
    const godModeBtn = document.getElementById('godModeBtn');
    godModeBtn.addEventListener('click', function() {
        toggleSetting('godMode', this, '🛡️ 开启', '关闭');
    });

    // 一击必杀
    const oneHitKillBtn = document.getElementById('oneHitKillBtn');
    oneHitKillBtn.addEventListener('click', function() {
        toggleSetting('oneHitKill', this, '💀 开启', '关闭');
    });

    // 显示防线
    const showLineBtn = document.getElementById('showLineBtn');
    showLineBtn.addEventListener('click', function() {
        settings.showLine = !settings.showLine;
        this.textContent = settings.showLine ? '✅ 显示' : '❌ 隐藏';
        this.className = `toggle-btn ${settings.showLine ? 'on' : 'off'}`;
        saveSettings();
    });

    // 音效
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    soundToggleBtn.addEventListener('click', function() {
        soundEnabled = !soundEnabled;
        settings.sound = soundEnabled;
        this.textContent = soundEnabled ? '🔊 开启' : '🔇 关闭';
        this.className = `toggle-btn ${soundEnabled ? 'on' : 'off'}`;
        if (soundEnabled) playSound('build');
        saveSettings();
    });

    // ========== 保存/加载设置 ==========
    function saveSettings() {
        try {
            localStorage.setItem('archer_settings', JSON.stringify(settings));
        } catch(e) {}
    }

    function loadSettings() {
        try {
            const saved = localStorage.getItem('archer_settings');
            if (saved) {
                const parsed = JSON.parse(saved);
                settings = { ...settings, ...parsed };
                // 同步UI
                infiniteArrowsBtn.textContent = settings.infiniteArrows ? '🏹 开启' : '关闭';
                infiniteArrowsBtn.className = `toggle-btn ${settings.infiniteArrows ? 'on' : 'off'}`;
                godModeBtn.textContent = settings.godMode ? '🛡️ 开启' : '关闭';
                godModeBtn.className = `toggle-btn ${settings.godMode ? 'on' : 'off'}`;
                oneHitKillBtn.textContent = settings.oneHitKill ? '💀 开启' : '关闭';
                oneHitKillBtn.className = `toggle-btn ${settings.oneHitKill ? 'on' : 'off'}`;
                showLineBtn.textContent = settings.showLine ? '✅ 显示' : '❌ 隐藏';
                showLineBtn.className = `toggle-btn ${settings.showLine ? 'on' : 'off'}`;
                soundEnabled = settings.sound;
                soundToggleBtn.textContent = soundEnabled ? '🔊 开启' : '🔇 关闭';
                soundToggleBtn.className = `toggle-btn ${soundEnabled ? 'on' : 'off'}`;
                updateCheatStatus();
            }
        } catch(e) {}
    }

    // ========== 弹窗控制 ==========
    function showHelp() {
        helpModal.classList.add('show');
        helpModal.style.display = 'flex';
    }
    function hideHelp() {
        helpModal.classList.remove('show');
        helpModal.style.display = 'none';
    }
    helpBtn.addEventListener('click', showHelp);
    closeHelp.addEventListener('click', hideHelp);
    closeHelpBtn.addEventListener('click', hideHelp);
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) hideHelp();
    });

    function showGameOver(reason) {
        gameOverModal.classList.add('show');
        gameOverModal.style.display = 'flex';
        gameOverReason.textContent = reason || '敌人突破了防线！';
        if (cheatActive) {
            gameOverTitle.textContent = '⚡ 游戏结束（金手指模式）';
            cheatWarning.style.display = 'flex';
        } else {
            gameOverTitle.textContent = '💔 游戏结束';
            cheatWarning.style.display = 'none';
        }
        playSound('gameover');
    }
    function hideGameOver() {
        gameOverModal.classList.remove('show');
        gameOverModal.style.display = 'none';
    }

    // ========== 游戏状态 ==========
    let game = {
        score: 0,
        arrows: 20,
        combo: 0,
        maxCombo: 0,
        kills: 0,
        best: parseInt(localStorage.getItem('archer_best')) || 0,
        isOver: false,
        isRunning: true,
    };

    // ========== 弓箭手 ==========
    const archer = {
        x: 120,
        y: H - 60,
        size: 30,
    };

    // ========== 鼠标/触屏位置 ==========
    let target = { x: W/2, y: H/2 };

    // ========== 箭矢 ==========
    let arrows = [];

    // ========== 敌人 ==========
    let enemies = [];
    let enemySpawnTimer = 0;
    let enemySpawnInterval = 60;

    // ========== 风力 ==========
    let wind = 0;
    let windTimer = 0;

    // ========== 粒子特效 ==========
    let particles = [];

    // ========== 辅助函数 ==========
    function distance(x1, y1, x2, y2) {
        return Math.hypot(x2 - x1, y2 - y1);
    }

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function randomInt(min, max) {
        return Math.floor(random(min, max + 1));
    }

    // ========== 粒子系统 ==========
    function createParticles(x, y, color, count, speed) {
        for (let i = 0; i < count; i++) {
            const angle = random(0, Math.PI * 2);
            const spd = random(1, speed || 4);
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd - 1,
                life: random(20, 50),
                maxLife: 50,
                size: random(2, 6),
                color: color || '#ffd700',
            });
        }
    }

    function updateParticles() {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05;
            p.life--;
            if (p.life <= 0) {
                particles.splice(i, 1);
            }
        }
    }

    function drawParticles() {
        for (let p of particles) {
            const alpha = p.life / p.maxLife;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    // ========== 生成敌人 ==========
    function spawnEnemy() {
        const typeRoll = Math.random();
        let type, size, speed, hp, color, scoreValue;

        if (game.score > 100 && typeRoll < 0.1) {
            type = 'boss';
            size = 35;
            speed = 0.8 + Math.random() * 0.3;
            hp = 3;
            color = '#9B59B6';
            scoreValue = 50;
        } else if (typeRoll < 0.35 && game.score > 30) {
            type = 'fast';
            size = 14;
            speed = 2.5 + Math.random() * 1.2;
            hp = 1;
            color = '#3498DB';
            scoreValue = 20;
        } else {
            type = 'normal';
            size = 20;
            speed = 1.0 + Math.random() * 0.8;
            hp = 1;
            color = '#E67E22';
            scoreValue = 10;
        }

        const y = random(40, H - 40);
        const x = W + 20;

        enemies.push({
            x: x,
            y: y,
            size: size,
            speed: speed,
            hp: hp,
            maxHp: hp,
            color: color,
            type: type,
            scoreValue: scoreValue,
            wobble: random(0, Math.PI * 2),
            wobbleSpeed: random(0.02, 0.06),
            wobbleAmount: random(10, 30),
            alive: true,
        });
    }

    // ========== 射击 ==========
    function shoot() {
        if (game.isOver) return;
        
        // 检查箭矢（无限箭矢模式）
        if (!settings.infiniteArrows && game.arrows <= 0) {
            statusBar.textContent = '❌ 箭矢用完了！';
            return;
        }

        initAudio();
        if (!settings.infiniteArrows) {
            game.arrows--;
        }
        playSound('shoot');

        const startX = archer.x + 20;
        const startY = archer.y - 10;

        const dx = target.x - startX;
        const dy = target.y - startY;
        const dist = distance(startX, startY, target.x, target.y);
        const power = Math.min(dist / 10, 12) + 3;

        const windEffect = wind * 0.3;

        arrows.push({
            x: startX,
            y: startY,
            vx: Math.cos(Math.atan2(dy, dx)) * power + windEffect,
            vy: Math.sin(Math.atan2(dy, dx)) * power - 2,
            gravity: 0.15,
            life: 120,
            alive: true,
            trail: [],
        });

        updateUI();
        const arrowCount = settings.infiniteArrows ? '∞' : game.arrows;
        statusBar.textContent = `🏹 射出一箭！剩余 ${arrowCount} 支`;
    }

    // ========== 更新箭矢 ==========
    function updateArrows() {
        for (let i = arrows.length - 1; i >= 0; i--) {
            const a = arrows[i];
            if (!a.alive) continue;

            a.trail.push({ x: a.x, y: a.y });
            if (a.trail.length > 15) a.trail.shift();

            a.vx += wind * 0.02;
            a.vy += a.gravity;
            a.x += a.vx;
            a.y += a.vy;
            a.life--;

            let hit = false;
            for (let j = enemies.length - 1; j >= 0; j--) {
                const e = enemies[j];
                if (!e.alive) continue;
                const dist = distance(a.x, a.y, e.x, e.y);
                if (dist < e.size + 6) {
                    // 一击必杀模式
                    const damage = settings.oneHitKill ? e.maxHp : 1;
                    e.hp -= damage;
                    
                    if (e.hp <= 0) {
                        e.alive = false;
                        game.kills++;
                        const comboBonus = Math.floor(game.combo / 5) + 1;
                        const points = e.scoreValue * comboBonus;
                        game.score += points;
                        game.combo++;
                        if (game.combo > game.maxCombo) {
                            game.maxCombo = game.combo;
                        }
                        createParticles(e.x, e.y, e.color, 20, 5);
                        playSound('hit');
                        if (game.combo > 2) {
                            playSound('combo');
                            statusBar.textContent = `🔥 ${game.combo}连击！+${points}分`;
                        } else {
                            statusBar.textContent = `🎯 命中！+${points}分${game.combo > 1 ? ` (${game.combo}连击)` : ''}`;
                        }
                        if (game.combo > 5) {
                            createParticles(e.x, e.y, '#ffd700', 10, 3);
                        }
                        if (e.type === 'boss') {
                            createParticles(e.x, e.y, '#ff6b6b', 30, 8);
                        }
                    } else {
                        playSound('hit');
                        createParticles(e.x, e.y, '#ffffff', 8, 2);
                        statusBar.textContent = `💥 ${e.type === 'boss' ? 'BOSS' : '敌人'} 受伤！剩余 ${e.hp} 血`;
                    }
                    hit = true;
                    a.alive = false;
                    break;
                }
            }

            if (a.x < -20 || a.x > W + 20 || a.y < -20 || a.y > H + 20) {
                a.alive = false;
                if (!hit) {
                    game.combo = 0;
                    playSound('miss');
                    statusBar.textContent = '💨 射失了... 连击中断';
                }
            }

            if (!a.alive) {
                arrows.splice(i, 1);
                updateUI();
            }
        }
    }

    // ========== 更新敌人 ==========
    function updateEnemies() {
        for (let i = enemies.length - 1; i >= 0; i--) {
            const e = enemies[i];
            if (!e.alive) continue;

            e.wobble += e.wobbleSpeed;
            e.x -= e.speed;
            e.y += Math.sin(e.wobble) * 0.3;

            // 检查是否越过防线
            if (e.x < DEFENSE_LINE_X) {
                if (!settings.godMode) {
                    // 游戏结束 - 敌人突破防线
                    e.alive = false;
                    game.isOver = true;
                    game.isRunning = false;
                    
                    // 更新最高分（如果不作弊）
                    if (!cheatActive && game.score > game.best) {
                        game.best = game.score;
                        localStorage.setItem('archer_best', game.best.toString());
                    }
                    
                    finalScore.textContent = game.score;
                    finalBest.textContent = game.best;
                    finalCombo.textContent = game.maxCombo;
                    finalKills.textContent = game.kills;
                    showGameOver('💀 敌人突破了防线！');
                    updateUI();
                    return;
                } else {
                    // 无敌模式：敌人消失但不结束
                    e.alive = false;
                    statusBar.textContent = '🛡️ 无敌模式：敌人被消除';
                    createParticles(e.x, e.y, '#ffd700', 10, 3);
                }
            }
        }
        enemies = enemies.filter(e => e.alive);
    }

    // ========== 更新风力 ==========
    function updateWind() {
        windTimer++;
        if (windTimer > 300) {
            windTimer = 0;
            wind = random(-3, 3);
            const dir = wind > 0 ? '→ 右' : wind < 0 ? '← 左' : '⏸️ 无风';
            windDisplay.textContent = `${wind.toFixed(1)} ${dir}`;
            if (Math.abs(wind) > 1.5) {
                statusBar.textContent = `🌬️ 强风！朝 ${wind > 0 ? '右' : '左'} 偏`;
            }
        }
    }

    // ========== 生成敌人逻辑 ==========
    function updateSpawning() {
        if (game.isOver) return;
        enemySpawnTimer++;
        const baseInterval = Math.max(20, enemySpawnInterval - Math.floor(game.score / 20));
        if (enemySpawnTimer >= baseInterval) {
            enemySpawnTimer = 0;
            const count = Math.random() < 0.2 && game.score > 50 ? 2 : 1;
            for (let i = 0; i < count; i++) {
                spawnEnemy();
            }
            if (enemies.length > 0 && enemies[enemies.length - 1].type === 'boss') {
                statusBar.textContent = '👑 BOSS 出现！集中火力！';
            }
        }
    }

    // ========== 绘制函数 ==========
    function drawBackground() {
        const gradient = ctx.createLinearGradient(0, 0, 0, H);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.6, '#B0E0E6');
        gradient.addColorStop(1, '#90B77D');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = '#7CCD7C';
        ctx.fillRect(0, H - 30, W, 30);

        ctx.fillStyle = 'rgba(100, 160, 100, 0.3)';
        ctx.beginPath();
        ctx.moveTo(0, H - 40);
        for (let x = 0; x <= W; x += 10) {
            const y = H - 40 - Math.sin(x * 0.008) * 30 - Math.sin(x * 0.015 + 2) * 20;
            ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H);
        ctx.fill();

        // ===== 防线（红色虚线） =====
        if (settings.showLine) {
            ctx.save();
            ctx.setLineDash([10, 12]);
            ctx.strokeStyle = '#ff2222';
            ctx.lineWidth = 3;
            ctx.shadowColor = 'rgba(255,0,0,0.5)';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.moveTo(DEFENSE_LINE_X, 10);
            ctx.lineTo(DEFENSE_LINE_X, H - 10);
            ctx.stroke();
            ctx.restore();

            // 防线文字
            ctx.fillStyle = 'rgba(255,50,50,0.7)';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText('⚠️ 防线', DEFENSE_LINE_X, 8);
        }

        // 风力指示
        if (Math.abs(wind) > 0.3) {
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            const windX = wind > 0 ? W - 60 : 60;
            const dir = wind > 0 ? 1 : -1;
            for (let i = 0; i < 5; i++) {
                const x = windX + i * 15 * dir;
                const y = 20 + Math.sin(i * 0.5) * 5;
                ctx.fillStyle = `rgba(255,255,255,${0.1 + i * 0.05})`;
                ctx.beginPath();
                ctx.moveTo(x - 8 * dir, y);
                ctx.lineTo(x + 8 * dir, y - 5);
                ctx.lineTo(x + 8 * dir, y + 5);
                ctx.fill();
            }
        }
    }

    function drawArcher() {
        const x = archer.x, y = archer.y;

        ctx.fillStyle = '#2C3E50';
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#F5CBA7';
        ctx.beginPath();
        ctx.arc(x + 12, y - 8, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#5D4037';
        ctx.beginPath();
        ctx.arc(x + 14, y - 16, 12, Math.PI, 0);
        ctx.fill();

        ctx.fillStyle = '#27AE60';
        ctx.beginPath();
        ctx.ellipse(x + 12, y - 20, 16, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1A7A3A';
        ctx.fillRect(x + 6, y - 28, 12, 8);

        ctx.strokeStyle = '#8D6E63';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x + 8, y - 4, 22, -0.8, 0.8);
        ctx.stroke();
        ctx.strokeStyle = '#D7CCC8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x + 8 + 22 * Math.cos(-0.8), y - 4 + 22 * Math.sin(-0.8));
        ctx.lineTo(x + 8 + 22 * Math.cos(0.8), y - 4 + 22 * Math.sin(0.8));
        ctx.stroke();

        ctx.strokeStyle = '#5D4037';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 28, y - 4);
        ctx.lineTo(x + 45, y - 8);
        ctx.stroke();
        ctx.fillStyle = '#E74C3C';
        ctx.beginPath();
        ctx.moveTo(x + 47, y - 9);
        ctx.lineTo(x + 43, y - 5);
        ctx.lineTo(x + 43, y - 12);
        ctx.fill();

        const eyeAngle = Math.atan2(target.y - y, target.x - x);
        ctx.fillStyle = '#2C3E50';
        ctx.beginPath();
        ctx.arc(x + 16 + Math.cos(eyeAngle) * 5, y - 10 + Math.sin(eyeAngle) * 3, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x + 16 + Math.cos(eyeAngle) * 7, y - 11 + Math.sin(eyeAngle) * 3, 1.5, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawTarget() {
        const cx = target.x, cy = target.y;
        ctx.strokeStyle = 'rgba(255, 50, 50, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, 12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - 16, cy);
        ctx.lineTo(cx + 16, cy);
        ctx.moveTo(cx, cy - 16);
        ctx.lineTo(cx, cy + 16);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(255, 50, 50, 0.3)';
        ctx.beginPath();
        ctx.arc(cx, cy, 18, 0, Math.PI * 2);
        ctx.stroke();
    }

    function drawArrows() {
        for (let a of arrows) {
            for (let i = 0; i < a.trail.length; i++) {
                const t = a.trail[i];
                const alpha = i / a.trail.length * 0.3;
                ctx.fillStyle = `rgba(139, 69, 19, ${alpha})`;
                ctx.beginPath();
                ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
                ctx.fill();
            }

            const angle = Math.atan2(a.vy, a.vx);
            ctx.save();
            ctx.translate(a.x, a.y);
            ctx.rotate(angle);
            ctx.strokeStyle = '#5D4037';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(-12, 0);
            ctx.lineTo(10, 0);
            ctx.stroke();
            ctx.fillStyle = '#E74C3C';
            ctx.beginPath();
            ctx.moveTo(12, 0);
            ctx.lineTo(6, -4);
            ctx.lineTo(6, 4);
            ctx.fill();
            ctx.fillStyle = '#D7CCC8';
            ctx.beginPath();
            ctx.moveTo(-12, 0);
            ctx.lineTo(-16, -4);
            ctx.lineTo(-16, 4);
            ctx.fill();
            ctx.restore();
        }
    }

    function drawEnemies() {
        for (let e of enemies) {
            if (!e.alive) continue;
            const x = e.x, y = e.y, s = e.size;

            ctx.shadowColor = e.color;
            ctx.shadowBlur = 15;

            ctx.fillStyle = e.color;
            ctx.beginPath();
            ctx.arc(x, y, s, 0, Math.PI * 2);
            ctx.fill();

            ctx.shadowBlur = 0;

            if (e.type === 'boss') {
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3;
                ctx.setLineDash([4, 6]);
                ctx.beginPath();
                ctx.arc(x, y, s + 6, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.fillStyle = '#FFD700';
                ctx.font = '18px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('👑', x, y - s - 8);
            }

            if (e.type === 'fast') {
                ctx.fillStyle = 'rgba(255,255,255,0.3)';
                ctx.beginPath();
                ctx.arc(x, y, s + 4, 0, Math.PI * 2);
                ctx.fill();
            }

            if (e.maxHp > 1) {
                const barW = 30;
                const barH = 4;
                const barX = x - barW / 2;
                const barY = y - s - 8;
                ctx.fillStyle = 'rgba(0,0,0,0.5)';
                ctx.fillRect(barX, barY, barW, barH);
                ctx.fillStyle = e.hp / e.maxHp > 0.5 ? '#2ecc71' : '#e74c3c';
                ctx.fillRect(barX, barY, barW * (e.hp / e.maxHp), barH);
            }

            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(x - 4, y - 3, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + 4, y - 3, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#2C3E50';
            ctx.beginPath();
            ctx.arc(x - 5, y - 2, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + 3, y - 2, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#2C3E50';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(x, y + 3, 6, 0.1, Math.PI - 0.1);
            ctx.stroke();
        }
    }

    function drawUI() {
        if (game.combo > 1) {
            ctx.fillStyle = '#FF6B6B';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.shadowColor = 'rgba(255, 0, 0, 0.3)';
            ctx.shadowBlur = 20;
            ctx.fillText(`🔥 ${game.combo}x Combo!`, W / 2, 12);
            ctx.shadowBlur = 0;
        }

        // 金手指模式标识
        if (cheatActive) {
            ctx.fillStyle = 'rgba(255,0,0,0.15)';
            ctx.fillRect(0, 0, W, H);
            ctx.fillStyle = 'rgba(255,50,50,0.6)';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            ctx.fillText('⚡ 金手指模式', W - 12, H - 8);
        }

        // 箭矢数量（无限模式特殊显示）
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(W - 120, 8, 110, 30);
        ctx.fillStyle = settings.infiniteArrows ? '#ffd700' : '#7fc3ff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        const arrowDisplay = settings.infiniteArrows ? '∞' : game.arrows;
        ctx.fillText(`🏹 × ${arrowDisplay}`, W - 16, 24);
    }

    // ========== 主循环 ==========
    function update() {
        if (game.isOver) return;

        updateWind();
        updateSpawning();
        updateEnemies();
        updateArrows();
        updateParticles();

        updateUI();
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        drawBackground();
        drawEnemies();
        drawArrows();
        drawParticles();
        drawArcher();
        drawTarget();
        drawUI();
    }

    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    // ========== 游戏结束 ==========
    function endGame(reason) {
        if (game.isOver) return;
        game.isOver = true;
        game.isRunning = false;

        // 只有非作弊模式才记录最高分
        if (!cheatActive && game.score > game.best) {
            game.best = game.score;
            localStorage.setItem('archer_best', game.best.toString());
        }

        finalScore.textContent = game.score;
        finalBest.textContent = game.best;
        finalCombo.textContent = game.maxCombo;
        finalKills.textContent = game.kills;
        showGameOver(reason || '游戏结束');
        updateUI();
    }

    // ========== 重置游戏 ==========
    function resetGame() {
        game.score = 0;
        game.arrows = 20;
        game.combo = 0;
        game.maxCombo = 0;
        game.kills = 0;
        game.best = parseInt(localStorage.getItem('archer_best')) || 0;
        game.isOver = false;
        game.isRunning = true;

        enemies = [];
        arrows = [];
        particles = [];
        enemySpawnTimer = 0;
        wind = 0;
        windTimer = 0;

        hideGameOver();
        updateUI();
        updateCheatStatus();
        statusBar.textContent = '🎯 新的一局！瞄准射击！';
    }

    // ========== UI更新 ==========
    function updateUI() {
        scoreDisplay.textContent = game.score;
        const arrowDisplay = settings.infiniteArrows ? '∞' : game.arrows;
        arrowsDisplay.textContent = arrowDisplay;
        comboDisplay.textContent = game.combo > 1 ? game.combo : 0;
        bestDisplay.textContent = game.best;
    }

    // ========== 事件绑定 ==========
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        target.x = (e.clientX - rect.left) * scaleX;
        target.y = (e.clientY - rect.top) * scaleY;
        target.x = Math.max(20, Math.min(W - 20, target.x));
        target.y = Math.max(20, Math.min(H - 20, target.y));
    });

    canvas.addEventListener('mousedown', (e) => {
        e.preventDefault();
        if (e.button === 0) {
            shoot();
        }
    });

    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        target.x = (touch.clientX - rect.left) * scaleX;
        target.y = (touch.clientY - rect.top) * scaleY;
        target.x = Math.max(20, Math.min(W - 20, target.x));
        target.y = Math.max(20, Math.min(H - 20, target.y));
        shoot();
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        target.x = (touch.clientX - rect.left) * scaleX;
        target.y = (touch.clientY - rect.top) * scaleY;
        target.x = Math.max(20, Math.min(W - 20, target.x));
        target.y = Math.max(20, Math.min(H - 20, target.y));
    }, { passive: false });

    document.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Space') {
            e.preventDefault();
            shoot();
        }
        if (e.key === 'r' || e.key === 'R') {
            resetGame();
        }
    });

    restartBtn.addEventListener('click', resetGame);
    restartFromGameOverBtn.addEventListener('click', resetGame);

    // ========== 启动 ==========
    loadSettings();
    updateUI();
    updateCheatStatus();
    statusBar.textContent = isMobile ? '👆 点击屏幕瞄准射击' : '🎯 鼠标移动瞄准 · 左键射击';

    setTimeout(() => {
        if (!localStorage.getItem('archer_help_shown')) {
            showHelp();
            localStorage.setItem('archer_help_shown', 'true');
        }
    }, 500);

    gameLoop();
})();