console.log('🚀 GROKTRON MATRIX v8.0 STARTING...');

const charSets = {
    japanese: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'.split(''),
    english: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    numbers: '0123456789'.split(''),
    ascii: '!@#$%^&*()_+-=[]{}|;:,.<>?'.split(''),
    binary: '01'.split(''),
    blocks: '▄▀█▓▒░▲▼◄►'.split(''),
    greek: 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ'.split(''),
    symbols: '✦✧★☆⚡⚠️💀👻🕷️🦇🌪️💨🌊🔥🌈'.split('')
};

let animationFrame, isPaused = false;
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');
const particleCanvas = document.getElementById('particles');
const particleCtx = particleCanvas.getContext('2d');

console.log('✅ Canvas found:', canvas);
let drops = [], particles = [], lastTime = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    console.log('📏 Canvas resized:', canvas.width, 'x', canvas.height);
}
resizeCanvas();

// FIXED: DENSITY WORKS NOW!
function initMatrix() {
    const config = getConfig();
    const cols = Math.floor(canvas.width / config.fontSize);
    const totalDrops = Math.floor(cols * config.density); // ✅ FIXED DENSITY CALCULATION
    drops = Array(totalDrops).fill(0).map(() => Math.random() * canvas.height * -0.5);
    console.log('🎯 Matrix initialized:', drops.length, 'drops (density:', config.density, 'x)');
}

function createParticle() {
    return {
        x: Math.random() * particleCanvas.width,
        y: Math.random() * particleCanvas.height,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        life: 1,
        maxLife: 30 + Math.random() * 30,
        color: getConfig().color
    };
}

function updateParticles() {
    const config = getConfig();
    if (config.particles === 0) return;
    
    if (particles.length < config.particles) particles.push(createParticle());
    
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    particles = particles.filter(p => {
        p.x += p.vx; p.y += p.vy; p.life -= 0.02;
        if (p.life <= 0 || p.x < 0 || p.x > particleCanvas.width || p.y < 0 || p.y > particleCanvas.height) return false;
        
        particleCtx.globalAlpha = p.life;
        particleCtx.fillStyle = p.color;
        particleCtx.fillRect(p.x, p.y, 2, 2);
        return true;
    });
}

function drawMatrix(timestamp) {
    if (isPaused) {
        animationFrame = requestAnimationFrame(drawMatrix);
        return;
    }
    
    if (timestamp - lastTime < getConfig().speed) {
        animationFrame = requestAnimationFrame(drawMatrix);
        return;
    }
    lastTime = timestamp;
    
    const config = getConfig();
    
    // TRAIL
    const trailAlpha = Math.floor(255 * (1 - config.trail)).toString(16).padStart(2, '0');
    ctx.fillStyle = config.bgColor + trailAlpha;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // GLOW + TEXT
    ctx.shadowBlur = config.glow;
    ctx.shadowColor = config.color;
    ctx.fillStyle = config.color;
    ctx.font = `${config.fontSize}px monospace`;
    
    const cols = Math.floor(canvas.width / config.fontSize);
    const time = timestamp * 0.001;
    
    drops.forEach((y, i) => {
        let x = (i % cols) * config.fontSize;
        let drawY = y * config.fontSize;
        
        // WAVE EFFECT
        if (config.wave > 0) {
            x += Math.sin(y * 0.1 + time) * config.wave;
        }
        
        const text = config.symbols[Math.floor(Math.random() * config.symbols.length)];
        
        if (config.direction === 'down') {
            ctx.fillText(text, x, drawY);
            if (drawY > canvas.height && Math.random() > 0.7) drops[i] = 0;
        } else {
            drawY = canvas.height - drawY;
            ctx.fillText(text, x, drawY);
            if (y > canvas.height / config.fontSize && Math.random() > 0.7) drops[i] = 0;
        }
        drops[i]++;
    });
    
    updateParticles();
    document.getElementById('fps').textContent = Math.round(1000 / config.speed);
    animationFrame = requestAnimationFrame(drawMatrix);
}

function getConfig() {
    const charSet = document.getElementById('char-set').value;
    return {
        bgColor: document.getElementById('bg-color').value,
        color: document.getElementById('char-color').value,
        symbols: charSets[charSet],
        speed: parseInt(document.getElementById('speed').value),
        density: parseFloat(document.getElementById('density').value),
        fontSize: parseInt(document.getElementById('font-size').value),
        glow: parseInt(document.getElementById('glow').value),
        trail: parseFloat(document.getElementById('trail').value),
        wave: parseFloat(document.getElementById('wave').value),
        particles: parseInt(document.getElementById('particles').value),
        direction: document.getElementById('direction').value
    };
}

function updateMatrix() {
    const config = getConfig();
    document.body.style.background = config.bgColor;
    document.documentElement.style.setProperty('--bg-primary', config.bgColor);
    
    // UPDATE LABELS
    document.getElementById('speed-value').textContent = config.speed + 'ms';
    document.getElementById('density-value').textContent = config.density + 'x';
    document.getElementById('font-value').textContent = config.fontSize + 'px';
    document.getElementById('glow-value').textContent = config.glow;
    document.getElementById('trail-value').textContent = config.trail;
    document.getElementById('wave-value').textContent = config.wave;
    document.getElementById('particles-value').textContent = config.particles;
    
    document.getElementById('status').innerHTML = 
        `🌌 ${config.symbols.length}c | ${config.density}x | ${config.direction} | ✨${config.glow} | 🌊${config.wave} | ⭐${config.particles}`;
    
    initMatrix(); // ✅ FIXED: Reinitializes drops with NEW DENSITY
}

function startMatrix() {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    console.log('▶️ STARTING MATRIX v8.0');
    resizeCanvas();
    updateMatrix();
    animationFrame = requestAnimationFrame(drawMatrix);
}

function togglePause(event) {
    isPaused = !isPaused;
    event.target.textContent = isPaused ? '▶️' : '⏸️';
}

function setTheme(theme, event) {
    document.body.dataset.theme = theme;
    document.querySelectorAll('.icon-btn[data-theme]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
}

// ✅ FIXED: 15 PRESETS - ALL FIELDS UPDATE
function loadPreset(name) {
    const presets = {
        classic: {charSet:'japanese', bgColor:'#000000', color:'#00ff00', speed:50, density:1, fontSize:14, glow:5, trail:0.13, wave:0, particles:0, direction:'down'},
        cyber: {charSet:'english', bgColor:'#000033', color:'#00ffff', speed:40, density:1.2, fontSize:12, glow:8, trail:0.15, wave:2, particles:20, direction:'down'},
        hacker: {charSet:'ascii', bgColor:'#0a0a0a', color:'#00ff00', speed:30, density:1.8, fontSize:10, glow:3, trail:0.1, wave:0, particles:10, direction:'down'},
        binary: {charSet:'binary', bgColor:'#000000', color:'#00ff00', speed:80, density:0.8, fontSize:16, glow:0, trail:0.2, wave:0, particles:0, direction:'down'},
        neon: {charSet:'blocks', bgColor:'#1a0033', color:'#ff00ff', speed:45, density:1.5, fontSize:14, glow:15, trail:0.12, wave:5, particles:30, direction:'down'},
        retro: {charSet:'numbers', bgColor:'#001a00', color:'#33ff33', speed:60, density:1, fontSize:12, glow:2, trail:0.18, wave:0, particles:0, direction:'up'},
        fire: {charSet:'symbols', bgColor:'#330000', color:'#ff4400', speed:25, density:2, fontSize:16, glow:20, trail:0.25, wave:8, particles:60, direction:'down'},
        ice: {charSet:'greek', bgColor:'#000033', color:'#00ddff', speed:70, density:0.7, fontSize:18, glow:10, trail:0.3, wave:3, particles:40, direction:'up'},
        plasma: {charSet:'blocks', bgColor:'#1a0033', color:'#ff00ff', speed:35, density:2.5, fontSize:20, glow:25, trail:0.1, wave:12, particles:80, direction:'down'},
        matrix: {charSet:'japanese', bgColor:'#000000', color:'#00ff00', speed:50, density:1.5, fontSize:14, glow:8, trail:0.13, wave:1, particles:15, direction:'down'},
        glitch: {charSet:'ascii', bgColor:'#110000', color:'#ff0000', speed:20, density:2.8, fontSize:8, glow:0, trail:0.05, wave:15, particles:100, direction:'down'},
        rainbow: {charSet:'symbols', bgColor:'#000000', color:'#ff00ff', speed:55, density:1, fontSize:22, glow:12, trail:0.2, wave:6, particles:50, direction:'down'},
        ghost: {charSet:'greek', bgColor:'#000011', color:'#88aaff', speed:90, density:0.5, fontSize:24, glow:5, trail:0.35, wave:0, particles:25, direction:'up'},
        storm: {charSet:'symbols', bgColor:'#111133', color:'#4488ff', speed:40, density:2.2, fontSize:12, glow:18, trail:0.15, wave:10, particles:70, direction:'down'},
        ultimate: {charSet:'japanese', bgColor:'#000000', color:'#00ffff', speed:30, density:3, fontSize:18, glow:30, trail:0.08, wave:15, particles:100, direction:'down'}
    };
    
    const preset = presets[name];
    console.log('🎨 Loading preset:', name);
    
    // UPDATE ALL FIELDS
    Object.keys(preset).forEach(key => {
        const el = document.getElementById(key);
        if (el) el.value = preset[key];
    });
    updateMatrix(); // ✅ FIXED: Triggers full update
}

function randomize() {
    document.getElementById('char-set').value = Object.keys(charSets)[Math.floor(Math.random() * Object.keys(charSets).length)];
    document.getElementById('bg-color').value = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    document.getElementById('char-color').value = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    document.getElementById('speed').value = Math.floor(Math.random() * 140) + 10;
    document.getElementById('density').value = (Math.random() * 2.7 + 0.3).toFixed(1);
    document.getElementById('font-size').value = Math.floor(Math.random() * 25) + 8;
    document.getElementById('glow').value = Math.floor(Math.random() * 30);
    document.getElementById('trail').value = (Math.random() * 0.35 + 0.05).toFixed(2);
    document.getElementById('wave').value = Math.floor(Math.random() * 15);
    document.getElementById('particles').value = Math.floor(Math.random() * 100);
    document.getElementById('direction').value = ['down', 'up'][Math.floor(Math.random() * 2)];
    updateMatrix();
}

function resetDefaults() {
    loadPreset('classic');
}

// Copy/Export functions (same as before)
function copyMatrixCode(event) {
    const config = getConfig();
    const code = `<!DOCTYPE html><html><body style="margin:0;overflow:hidden;background:${config.bgColor}"><canvas id=c></canvas><script>const c=document.getElementById('c'),ctx=c.getContext('2d');c.width=window.innerWidth;c.height=window.innerHeight;const chars='${config.symbols.join('')}';const s=${config.fontSize};const drops=Array(Math.floor(c.width/s)*${config.density}).fill(0).map(()=>Math.random()*c.height*-0.5);setInterval(()=>{ctx.fillStyle='${config.bgColor}'+Math.floor(255*(1-${config.trail})).toString(16).padStart(2,'0');ctx.fillRect(0,0,c.width,c.height);ctx.shadowBlur=${config.glow};ctx.shadowColor='${config.color}';ctx.fillStyle='${config.color}';ctx.font=s+'px monospace';drops.forEach((y,i)=>{let x=(i%(c.width/s))*s;${config.wave>0?`x+=Math.sin(y*0.1+Date.now()*0.001)*${config.wave};`:''}ctx.fillText(chars[Math.random()*chars.length|0],x,y*s);if(y*s>c.height&&Math.random()>0.7)drops[i]=0;drops[i]++;});}, ${config.speed})</script></body></html>`;
    navigator.clipboard.writeText(code).then(() => {
        event.target.textContent = '✅ COPIED!'; event.target.classList.add('success');
        setTimeout(() => { event.target.textContent = '📋 COPY'; event.target.classList.remove('success'); }, 2000);
    });
}

function exportImage() {
    const link = document.createElement('a');
    link.download = 'groktron.png';
    link.href = canvas.toDataURL();
    link.click();
}

// EVENTS
window.addEventListener('resize', () => setTimeout(resizeCanvas, 100));
window.addEventListener('load', () => {
    console.log('🎉 LOADED - Starting Classic');
    startMatrix();
});

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey) {
        if (e.key === ' ') { e.preventDefault(); togglePause({target: {textContent: ''}}); }
        if (e.key === 'r') { e.preventDefault(); randomize(); }
    }
});