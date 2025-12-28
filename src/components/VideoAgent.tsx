/*
  VideoAgent renders three daily Hindu deity inspired animations and records them
  into short silent WebM clips using MediaRecorder + Canvas.
*/
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  GodVideoPlan,
  buildDailyPlans,
  createDateKey,
} from "@/lib/dailySelection";

interface DailyVideo {
  id: string;
  plan: GodVideoPlan;
  status: "pending" | "generating" | "ready" | "error";
  url?: string;
  progress: number;
  error?: string;
  generatedAt?: string;
}

const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;
const FPS = 30;

function supportsVideoRendering(): boolean {
  if (
    typeof window === "undefined" ||
    typeof document === "undefined" ||
    typeof MediaRecorder === "undefined"
  ) {
    return false;
  }

  const canvas = document.createElement("canvas");
  return typeof canvas.captureStream === "function";
}

function pickSupportedMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") {
    return undefined;
  }

  const candidates = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];

  return candidates.find((type) => MediaRecorder.isTypeSupported(type));
}

async function renderVideo(
  plan: GodVideoPlan,
  onProgress: (value: number) => void,
): Promise<{ url: string; generatedAt: string }> {
  const supportedType = pickSupportedMimeType();
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Unable to access 2D canvas context");
  }

  const stream = canvas.captureStream(FPS);
  const recorder = new MediaRecorder(stream, supportedType ? { mimeType: supportedType } : undefined);
  const chunks: Blob[] = [];

  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  const recorded = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => {
      if (!chunks.length) {
        reject(new Error("Recorder produced an empty clip"));
        return;
      }
      resolve(new Blob(chunks, { type: chunks[0].type || "video/webm" }));
    };
    recorder.onerror = (event) => {
      reject((event as unknown as ErrorEvent).error ?? new Error("Recorder error"));
    };
  });

  const start = performance.now();
  const { durationMs } = plan;
  let stopped = false;

  const drawFrame = (elapsed: number, progress: number) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawGradientBackground(ctx, plan, elapsed);
    drawAura(ctx, plan, elapsed);
    drawMotif(ctx, plan, elapsed);
    drawSparkles(ctx, plan, elapsed);
    drawTextLayers(ctx, plan, progress);
  };

  const animate = (timestamp: number) => {
    if (stopped) {
      return;
    }
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / durationMs, 1);
    drawFrame(elapsed, progress);
    onProgress(progress);
    if (!stopped) {
      requestAnimationFrame(animate);
    }
  };

  recorder.start();
  requestAnimationFrame(animate);

  await new Promise<void>((resolve) => {
    setTimeout(() => {
      stopped = true;
      recorder.stop();
      resolve();
    }, durationMs);
  });

  const blob = await recorded;
  stream.getTracks().forEach((track) => track.stop());
  const url = URL.createObjectURL(blob);

  return { url, generatedAt: new Date().toISOString() };
}

function drawGradientBackground(
  ctx: CanvasRenderingContext2D,
  plan: GodVideoPlan,
  elapsed: number,
) {
  const [primary, secondary, tertiary] = plan.palette;
  const shift = 0.25 * Math.sin(plan.gradientShift * Math.PI * 2 + elapsed * 0.0004);
  const gradient = ctx.createLinearGradient(
    0,
    0,
    CANVAS_WIDTH * (0.5 + shift),
    CANVAS_HEIGHT,
  );

  gradient.addColorStop(0, primary);
  gradient.addColorStop(0.5 + shift, secondary);
  gradient.addColorStop(1, tertiary);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const overlay = ctx.createRadialGradient(
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 2,
    0,
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 2,
    CANVAS_WIDTH * 0.75,
  );
  overlay.addColorStop(0, "rgba(255,255,255,0.08)");
  overlay.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawAura(
  ctx: CanvasRenderingContext2D,
  plan: GodVideoPlan,
  elapsed: number,
) {
  const centerX = CANVAS_WIDTH / 2;
  const centerY = CANVAS_HEIGHT / 2.4;
  const pulse = 1 + 0.05 * Math.sin(elapsed * 0.002 * plan.rotationSpeed);

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.beginPath();
  ctx.fillStyle = `${plan.aura}33`;
  ctx.ellipse(0, 0, 420 * pulse, 420 * pulse * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = `${plan.aura}22`;
  ctx.ellipse(0, 0, 520 * pulse, 520 * pulse * 0.7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawMotif(
  ctx: CanvasRenderingContext2D,
  plan: GodVideoPlan,
  elapsed: number,
) {
  const centerX = CANVAS_WIDTH / 2;
  const centerY = CANVAS_HEIGHT / 2.4;
  const baseRotation = elapsed * 0.0002 * plan.rotationSpeed * Math.PI * 2;
  const layers = 3;

  ctx.save();
  ctx.translate(centerX, centerY);

  for (let layer = 0; layer < layers; layer += 1) {
    const opacity = 0.2 - layer * 0.04;
    const sizeFactor = 0.5 + layer * 0.22;
    const rotation =
      baseRotation * (layer % 2 === 0 ? 1 : -1) + layer * 0.2 * Math.PI;
    ctx.save();
    ctx.rotate(rotation);
    ctx.globalAlpha = Math.max(opacity, 0.05);

    switch (plan.motif) {
      case "lotus":
        drawLotus(ctx, sizeFactor);
        break;
      case "chakra":
        drawChakra(ctx, sizeFactor);
        break;
      case "mandala":
        drawMandala(ctx, sizeFactor, elapsed, layer);
        break;
      case "river":
        drawRiver(ctx, sizeFactor, elapsed, layer, plan.waveFrequency);
        break;
      case "mountain":
        drawMountains(ctx, sizeFactor, elapsed, layer);
        break;
      case "flame":
        drawFlames(ctx, sizeFactor, elapsed);
        break;
      case "sunburst":
        drawSunburst(ctx, sizeFactor, elapsed);
        break;
      case "conch":
        drawConch(ctx, sizeFactor, elapsed);
        break;
    }

    ctx.restore();
  }
  ctx.restore();
}

function drawLotus(ctx: CanvasRenderingContext2D, size: number) {
  const petals = 12;
  const radius = 260 * size;
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  for (let i = 0; i < petals; i += 1) {
    const angle = (i / petals) * Math.PI * 2;
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(radius * 0.25, -radius * 0.4, 0, -radius);
    ctx.quadraticCurveTo(-radius * 0.25, -radius * 0.4, 0, 0);
    ctx.fill();
    ctx.restore();
  }
}

function drawChakra(ctx: CanvasRenderingContext2D, size: number) {
  const spokes = 24;
  const outer = 320 * size;
  const inner = 190 * size;
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 4;

  ctx.beginPath();
  ctx.arc(0, 0, outer, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, inner, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < spokes; i += 1) {
    const angle = (i / spokes) * Math.PI * 2;
    const x1 = Math.cos(angle) * inner;
    const y1 = Math.sin(angle) * inner;
    const x2 = Math.cos(angle) * outer;
    const y2 = Math.sin(angle) * outer;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}

function drawMandala(
  ctx: CanvasRenderingContext2D,
  size: number,
  elapsed: number,
  layer: number,
) {
  const rings = 5;
  const radius = 140 * size;
  const oscillation = 1 + 0.03 * Math.sin(elapsed * 0.002 + layer);
  for (let ring = 0; ring < rings; ring += 1) {
    const ringRadius = radius + ring * 40 * oscillation;
    const dots = 24 + ring * 6;
    for (let point = 0; point < dots; point += 1) {
      const angle = (point / dots) * Math.PI * 2;
      const x = Math.cos(angle) * ringRadius;
      const y = Math.sin(angle) * ringRadius;
      const alpha = 0.1 + (ring / rings) * 0.08;
      ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, 6 + ring * 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawRiver(
  ctx: CanvasRenderingContext2D,
  size: number,
  elapsed: number,
  layer: number,
  frequency: number,
) {
  const amplitude = 120 * size;
  const segments = 28;
  const base = -150 + layer * 80;
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.beginPath();
  ctx.moveTo(-CANVAS_WIDTH, base + amplitude);
  for (let i = -CANVAS_WIDTH; i <= CANVAS_WIDTH; i += CANVAS_WIDTH / segments) {
    const t = i / CANVAS_WIDTH;
    const y =
      base +
      Math.sin(t * Math.PI * frequency + elapsed * 0.0015) * amplitude;
    ctx.lineTo(i, y);
  }
  ctx.lineTo(CANVAS_WIDTH, base - amplitude);
  ctx.closePath();
  ctx.fill();
}

function drawMountains(
  ctx: CanvasRenderingContext2D,
  size: number,
  elapsed: number,
  layer: number,
) {
  const peaks = 6;
  const baseY = 120 + layer * 40;
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.beginPath();
  ctx.moveTo(-CANVAS_WIDTH, baseY);
  for (let i = 0; i <= peaks; i += 1) {
    const x = (i / peaks) * CANVAS_WIDTH - CANVAS_WIDTH / 2;
    const height =
      200 * size +
      Math.sin(elapsed * 0.001 + i * 1.7 + layer) * (40 + layer * 10);
    ctx.lineTo(x, baseY - height);
  }
  ctx.lineTo(CANVAS_WIDTH, baseY);
  ctx.closePath();
  ctx.fill();
}

function drawFlames(
  ctx: CanvasRenderingContext2D,
  size: number,
  elapsed: number,
) {
  const tongues = 18;
  const radius = 140 * size;
  ctx.fillStyle = "rgba(255,255,255,0.14)";
  for (let i = 0; i < tongues; i += 1) {
    const angle = (i / tongues) * Math.PI * 2;
    const sway = Math.sin(elapsed * 0.003 + i) * 0.25;
    ctx.save();
    ctx.rotate(angle + sway);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(radius * 0.15, -radius * 0.3, 0, -radius);
    ctx.quadraticCurveTo(-radius * 0.15, -radius * 0.3, 0, 0);
    ctx.fill();
    ctx.restore();
  }
}

function drawSunburst(
  ctx: CanvasRenderingContext2D,
  size: number,
  elapsed: number,
) {
  const rays = 32;
  const radius = 320 * size;
  const pulse = 1 + 0.1 * Math.sin(elapsed * 0.002);
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.lineWidth = 2;

  for (let i = 0; i < rays; i += 1) {
    const angle = (i / rays) * Math.PI * 2;
    const x = Math.cos(angle) * radius * pulse;
    const y = Math.sin(angle) * radius * pulse;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

function drawConch(
  ctx: CanvasRenderingContext2D,
  size: number,
  elapsed: number,
) {
  const maxRadius = 260 * size;
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i <= 720; i += 4) {
    const angle = (i / 180) * Math.PI;
    const radius = (maxRadius * i) / 720;
    const wobble = 1 + 0.05 * Math.sin(elapsed * 0.001 + i * 0.08);
    const x = Math.cos(angle) * radius * wobble;
    const y = Math.sin(angle) * radius * wobble * 0.7;
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function drawSparkles(
  ctx: CanvasRenderingContext2D,
  plan: GodVideoPlan,
  elapsed: number,
) {
  const { sparkCount } = plan;
  for (let i = 0; i < sparkCount; i += 1) {
    const angle = ((i + 1) / sparkCount) * Math.PI * 2;
    const baseRadius = 260 + (i % 8) * 22;
    const orbit = baseRadius + Math.sin(elapsed * 0.002 + i) * 20;
    const x =
      CANVAS_WIDTH / 2 + Math.cos(angle + elapsed * 0.0007) * orbit;
    const y =
      CANVAS_HEIGHT / 2.4 + Math.sin(angle + elapsed * 0.0009) * orbit * 0.6;
    const scale = 1 + Math.sin(elapsed * 0.003 + i) * 0.3;
    const alpha = 0.08 + ((i % 6) / sparkCount) * 0.6;
    ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
    ctx.beginPath();
    ctx.ellipse(x, y, 6 * scale, 6 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawTextLayers(
  ctx: CanvasRenderingContext2D,
  plan: GodVideoPlan,
  progress: number,
) {
  const baseY = CANVAS_HEIGHT * 0.78;
  const rise = Math.min(progress * 80, 80);
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.textAlign = "center";
  ctx.font = "600 64px 'Merriweather', serif";
  ctx.fillText(plan.deity.name, CANVAS_WIDTH / 2, baseY - rise);

  ctx.fillStyle = "rgba(255,255,255,0.82)";
  ctx.font = "400 28px 'Inter', sans-serif";
  ctx.fillText(
    `${plan.deity.epithet} · ${plan.focusQuality}`,
    CANVAS_WIDTH / 2,
    baseY + 48 - rise,
  );

  ctx.fillStyle = "rgba(255,255,255,0.76)";
  ctx.font = "400 24px 'Inter', sans-serif";
  ctx.fillText(plan.deity.description, CANVAS_WIDTH / 2, baseY + 108 - rise, 960);

  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "400 22px 'Inter', sans-serif";
  plan.mantraLines.forEach((line, index) => {
    ctx.fillText(
      line,
      CANVAS_WIDTH / 2,
      baseY + 160 + index * 32 - rise,
      960,
    );
  });
}

export function VideoAgent() {
  const dateKey = useMemo(() => createDateKey(new Date()), []);
  const plans = useMemo(() => buildDailyPlans(dateKey), [dateKey]);
  const [generationKey, setGenerationKey] = useState(0);
  const [videos, setVideos] = useState<DailyVideo[]>(() =>
    plans.map((plan) => ({
      id: plan.id,
      plan,
      status: "pending",
      url: undefined,
      progress: 0,
    })),
  );
  const startedRef = useRef(false);
  const urlsRef = useRef<string[]>([]);
  const supported = useMemo(() => supportsVideoRendering(), []);

  useEffect(() => {
    setVideos(
      plans.map((plan) => ({
        id: plan.id,
        plan,
        status: "pending",
        url: undefined,
        progress: 0,
      })),
    );
  }, [plans]);

  useEffect(() => {
    const urls = videos
      .map((video) => video.url)
      .filter((url): url is string => Boolean(url));
    const stale = urlsRef.current.filter((url) => !urls.includes(url));
    stale.forEach((url) => URL.revokeObjectURL(url));
    urlsRef.current = urls;
  }, [videos]);

  useEffect(
    () => () => {
      urlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      urlsRef.current = [];
    },
    [],
  );

  useEffect(() => {
    if (!supported || startedRef.current) {
      return;
    }
    startedRef.current = true;

    (async () => {
      for (const plan of plans) {
        setVideos((previous) =>
          previous.map((entry) =>
            entry.id === plan.id
              ? { ...entry, status: "generating", progress: 0 }
              : entry,
          ),
        );
        try {
          const { url, generatedAt } = await renderVideo(plan, (progress) => {
            setVideos((prev) =>
              prev.map((entry) =>
                entry.id === plan.id
                  ? { ...entry, progress }
                  : entry,
              ),
            );
          });

          setVideos((prev) =>
            prev.map((entry) =>
              entry.id === plan.id
                ? {
                    ...entry,
                    status: "ready",
                    url,
                    progress: 1,
                    generatedAt,
                  }
                : entry,
            ),
          );
        } catch (error) {
          setVideos((prev) =>
            prev.map((entry) =>
              entry.id === plan.id
                ? {
                    ...entry,
                    status: "error",
                    error:
                      error instanceof Error
                        ? error.message
                        : "Unknown rendering error",
                  }
                : entry,
            ),
          );
        }
      }
    })();
  }, [plans, supported, generationKey]);

  const resetForToday = useCallback(() => {
    startedRef.current = false;
    setGenerationKey((value) => value + 1);
    setVideos(
      plans.map((plan) => ({
        id: plan.id,
        plan,
        status: "pending",
        progress: 0,
        url: undefined,
      })),
    );
  }, [plans]);

  if (!supported) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white backdrop-blur">
        <h2 className="text-3xl font-semibold">Video rendering unavailable</h2>
        <p className="mt-4 text-base text-white/70">
          Your browser does not support the MediaRecorder API required for automatic video
          generation. Please open this experience in a modern Chromium-based browser to
          assemble today&apos;s deity videos.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      <header className="space-y-4 text-center text-white">
        <p className="text-sm uppercase tracking-[0.35em] text-white/60">
          Daily Trimutri Studio
        </p>
        <h1 className="text-4xl font-semibold sm:text-5xl">
          Sacred Motion for {dateKey}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-white/80">
          Each dawn we weave three meditative god-stories drawn from Hindu iconography.
          Animations are rendered directly in your browser so that every viewing births
          fresh light, color, and mantra.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {videos.map((video) => (
          <article
            key={video.id}
            className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-2xl shadow-black/20 backdrop-blur"
          >
            <header className="space-y-1">
              <h2 className="text-2xl font-semibold">{video.plan.deity.name}</h2>
              <p className="text-sm uppercase tracking-[0.25em] text-white/60">
                {video.plan.deity.epithet}
              </p>
            </header>

            <div className="relative overflow-hidden rounded-2xl bg-black/60">
              {video.status === "ready" && video.url ? (
                <video
                  src={video.url}
                  controls
                  playsInline
                  className="h-auto w-full rounded-2xl"
                  preload="metadata"
                />
              ) : (
                <div className="flex h-48 flex-col items-center justify-center gap-3">
                  <div className="h-20 w-20 animate-spin rounded-full border-4 border-white/20 border-t-white/70" />
                  <p className="text-sm text-white/70">
                    {video.status === "error"
                      ? "Rendering failed"
                      : video.status === "generating"
                        ? "Composing sacred visuals..."
                        : "Queued for rendering"}
                  </p>
                  {video.status === "generating" && (
                    <div className="h-1 w-32 overflow-hidden rounded-full bg-white/20">
                      <div
                        className="h-full rounded-full bg-white"
                        style={{ width: `${Math.max(video.progress * 100, 8)}%` }}
                      />
                    </div>
                  )}
                  {video.status === "error" && (
                    <button
                      type="button"
                      onClick={() => {
                        startedRef.current = false;
                        setGenerationKey((value) => value + 1);
                        setVideos((prev) =>
                          prev.map((entry) =>
                            entry.id === video.id
                              ? {
                                  ...entry,
                                  status: "pending",
                                  error: undefined,
                                  progress: 0,
                                  url: undefined,
                                }
                              : entry,
                          ),
                        );
                      }}
                      className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 transition hover:bg-white/20"
                    >
                      Retry
                    </button>
                  )}
                </div>
              )}
            </div>

            <section className="space-y-2 text-sm text-white/75">
              <p className="leading-relaxed">{video.plan.deity.description}</p>
              <p className="text-xs uppercase tracking-[0.25em] text-white/50">
                Focus · {video.plan.focusQuality}
              </p>
              <ul className="space-y-1">
                {video.plan.mantraLines.map((line) => (
                  <li key={line} className="font-medium text-white/80">{line}</li>
                ))}
              </ul>
              <p className="text-xs text-white/50">
                Palette: {video.plan.palette.join(" · ")}
              </p>
              {video.generatedAt && (
                <p className="text-xs text-white/50">
                  Rendered at {new Date(video.generatedAt).toLocaleTimeString()}
                </p>
              )}
            </section>
          </article>
        ))}
      </div>

      <footer className="flex flex-col items-center gap-4 text-sm text-white/70">
        <p>
          Videos are rendered locally and regenerate with each sunrise. Refresh tomorrow
          for a new triad of divinities.
        </p>
        <button
          type="button"
          onClick={resetForToday}
          className="rounded-full border border-white/20 px-5 py-2 text-xs uppercase tracking-[0.35em] text-white/80 transition hover:bg-white/10"
        >
          Regenerate Today
        </button>
      </footer>
    </div>
  );
}
