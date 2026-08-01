"use client";

import { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    depth: number;
    r: number;
    color: [number, number, number];
}

const PALETTE: [number, number, number][] = [
    [16, 191, 174],
    [99, 91, 241],
    [216, 90, 48],
    [212, 83, 126],
];

export function ParticleNetworkBackground({ className = "" }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let particles: Particle[] = [];
        let animationFrame = 0;
        const mouse = { x: -9999, y: -9999 };
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        let themeAlphaScale = 1;
        let useMonochrome = false;
        function updateThemeScale() {
            const isLight = !document.documentElement.classList.contains("dark");
            themeAlphaScale = isLight ? 0.7 : 1;
            useMonochrome = isLight;
        }
        updateThemeScale();
        const themeObserver = new MutationObserver(updateThemeScale);
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        function resize() {
            const parent = canvas!.parentElement;
            width = parent ? parent.clientWidth : window.innerWidth;
            height = parent ? parent.clientHeight : window.innerHeight;
            const dpr = window.devicePixelRatio || 1;
            canvas!.width = width * dpr;
            canvas!.height = height * dpr;
            canvas!.style.width = `${width}px`;
            canvas!.style.height = `${height}px`;
            ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

            const divisor = width < 640 ? 6500 : width < 1024 ? 4200 : 2800;
            const maxCount = width < 640 ? 90 : 320;
            const count = Math.min(maxCount, Math.round((width * height) / divisor));

            particles = Array.from({ length: count }, () => {
                const depth = Math.random();
                const angle = Math.random() * Math.PI * 2;
                const speed = 0.9 + depth * 2.2;
                return {
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    depth,
                    r: 1.8 + depth * 2.6,
                    color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
                };
            });
        }

        function handlePointerMove(e: PointerEvent) {
            const rect = canvas!.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        }

        function handlePointerLeave() {
            mouse.x = -9999;
            mouse.y = -9999;
        }

        function step() {
            ctx!.clearRect(0, 0, width, height);

            for (const p of particles) {
                if (!prefersReducedMotion) {
                    p.x += p.vx;
                    p.y += p.vy;

                    if (p.x < 0) { p.x = 0; p.vx *= -1; }
                    if (p.x > width) { p.x = width; p.vx *= -1; }
                    if (p.y < 0) { p.y = 0; p.vy *= -1; }
                    if (p.y > height) { p.y = height; p.vy *= -1; }

                    const dxm = p.x - mouse.x;
                    const dym = p.y - mouse.y;
                    const dm = Math.hypot(dxm, dym);
                    if (dm < 140 && dm > 0.01) {
                        const f = (140 - dm) / 140;
                        p.x += (dxm / dm) * f * 7 * (0.5 + p.depth);
                        p.y += (dym / dm) * f * 7 * (0.5 + p.depth);
                    }
                }

                const [r, g, b] = useMonochrome ? [20, 24, 30] : p.color;
                const alpha = (0.85 + p.depth * 0.15) * themeAlphaScale;

                ctx!.beginPath();
                ctx!.arc(p.x, p.y, p.r * 1.8, 0, Math.PI * 2);
                ctx!.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.25})`;
                ctx!.fill();

                ctx!.beginPath();
                ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx!.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                ctx!.fill();
            }

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i];
                    const b = particles[j];
                    const d = Math.hypot(a.x - b.x, a.y - b.y);
                    const maxDist = 80 + Math.min(a.depth, b.depth) * 30;
                    if (d < maxDist) {
                        const mr = useMonochrome ? 20 : Math.round((a.color[0] + b.color[0]) / 2);
                        const mg = useMonochrome ? 24 : Math.round((a.color[1] + b.color[1]) / 2);
                        const mb = useMonochrome ? 30 : Math.round((a.color[2] + b.color[2]) / 2);
                        const opacity = (1 - d / maxDist) * 0.5 * ((a.depth + b.depth) / 2) * themeAlphaScale;
                        ctx!.beginPath();
                        ctx!.moveTo(a.x, a.y);
                        ctx!.lineTo(b.x, b.y);
                        ctx!.strokeStyle = `rgba(${mr}, ${mg}, ${mb}, ${opacity})`;
                        ctx!.lineWidth = 1;
                        ctx!.stroke();
                    }
                }
            }

            if (mouse.x > -9999) {
                for (const p of particles) {
                    const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
                    if (d < 200) {
                        const [r, g, b] = useMonochrome ? [20, 24, 30] : p.color;
                        const opacity = (1 - d / 200) * 0.9 * themeAlphaScale;
                        ctx!.beginPath();
                        ctx!.moveTo(p.x, p.y);
                        ctx!.lineTo(mouse.x, mouse.y);
                        ctx!.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                        ctx!.lineWidth = 1.4;
                        ctx!.stroke();
                    }
                }
            }

            animationFrame = requestAnimationFrame(step);
        }

        resize();
        step();

        window.addEventListener("resize", resize);
        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerleave", handlePointerLeave);

        return () => {
            cancelAnimationFrame(animationFrame);
            themeObserver.disconnect();
            window.removeEventListener("resize", resize);
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerleave", handlePointerLeave);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
        />
    );
}