/**
 * Unbuk Interactive Invitation
 * 
 * Features:
 * - HTML5 Canvas Particle System with Mouse Repulsion
 * - Scene Management (Intro -> Video -> Outro)
 * - Countdown Timer
 */

class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.mouseX = -1000;
        this.mouseY = -1000;

        // Configuration
        this.particleCount = 150;
        this.connectionDistance = 100;
        this.repelRadius = 200;
        this.repelForce = 2;

        this.init();
        this.bindEvents();
        this.animate();
    }

    init() {
        this.resize();
        this.createParticles();
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Mobile touch support for interaction
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.mouseX = e.touches[0].clientX;
                this.mouseY = e.touches[0].clientY;
            }
        });
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.3, // Slow movement
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2 + 0.5,
                baseX: 0,
                baseY: 0
            });
        }
    }

    update() {
        this.particles.forEach(p => {
            // Basic movement
            p.x += p.vx;
            p.y += p.vy;

            // Boundary wrap around
            if (p.x < 0) p.x = this.width;
            if (p.x > this.width) p.x = 0;
            if (p.y < 0) p.y = this.height;
            if (p.y > this.height) p.y = 0;

            // Mouse Repulsion
            const dx = p.x - this.mouseX;
            const dy = p.y - this.mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.repelRadius) {
                const angle = Math.atan2(dy, dx);
                const force = (this.repelRadius - distance) / this.repelRadius;
                const moveX = Math.cos(angle) * force * this.repelForce;
                const moveY = Math.sin(angle) * force * this.repelForce;

                p.x += moveX;
                p.y += moveY;
            }
        });
    }

    draw() {
        // Clear with slight trail effect? No, clean clear for minimal aesthetic as requested
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';

        this.particles.forEach(p => {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

class SceneManager {
    constructor() {
        this.introLayer = document.getElementById('intro-layer');
        this.videoLayer = document.getElementById('video-layer');
        this.outroLayer = document.getElementById('outro-layer');
        this.video = document.getElementById('main-video');

        // Setup initial events
        this.introLayer.addEventListener('click', () => this.startExperience());
        this.video.addEventListener('ended', () => this.endVideo());

        // Optional: Allow skipping video via click
        // this.videoLayer.addEventListener('click', () => {
        //     this.video.pause();
        //     this.endVideo();
        // });
    }

    startExperience() {
        // Transition Intro -> Video
        this.introLayer.classList.remove('active');

        // Prepare video
        this.videoLayer.classList.add('active');

        // Small delay to allow fade out of text before hard cut to video? 
        // Or fade in video layer.

        // Force play (requires user interaction which we just had)
        this.video.play().then(() => {
            // Video playing
            // Enhance particle repulsion? handled in ParticleSystem if we want
        }).catch(err => {
            console.error("Video play failed", err);
            // Fallback if video fails
            this.endVideo();
        });
    }

    endVideo() {
        // Transition Video -> Outro
        this.videoLayer.classList.remove('active');

        // Pause ready for next time or just stop
        // this.video.pause(); 

        // Show Outro
        this.outroLayer.classList.add('active');

        // Init Countdown
        new Countdown();
    }
}

class Countdown {
    constructor() {
        // Set date to 2026-02-18
        this.targetDate = new Date('2026-03-05T00:00:00+09:00').getTime();

        this.els = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };

        this.update();
        setInterval(() => this.update(), 1000);
    }

    update() {
        const now = new Date().getTime();
        const distance = this.targetDate - now;

        if (distance < 0) {
            // Festival started
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        this.els.days.innerText = days < 10 ? '0' + days : days;
        this.els.hours.innerText = hours < 10 ? '0' + hours : hours;
        this.els.minutes.innerText = minutes < 10 ? '0' + minutes : minutes;
        this.els.seconds.innerText = seconds < 10 ? '0' + seconds : seconds;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const particles = new ParticleSystem('bg-canvas');
    const scenes = new SceneManager();
});
