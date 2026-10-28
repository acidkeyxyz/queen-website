import { spawnSync } from 'node:child_process';

const SRC = 'src/assets/media/mazda-hatchback-3d.mov';
const OUT = 'public/media/mazda3-hatchback-3d';
const FILTER = 'crop=in_w-14:in_h:14:0';

export const buildArgs = (src, out) => ({
  webm: ['-i', src, '-vf', `${FILTER},fps=30`, '-an', '-c:v', 'libvpx-vp9', '-crf', '34', '-b:v', '0', '-row-mt', '1', `${out}.webm`],
  mp4: ['-i', src, '-vf', `${FILTER},fps=30`, '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${out}.mp4`],
  poster: ['-ss', '6', '-i', src, '-vf', FILTER, '-frames:v', '1', '-q:v', '3', `${out}-poster.jpg`],
});

const main = () => {
  for (const [name, args] of Object.entries(buildArgs(SRC, OUT))) {
    const run = spawnSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' });
    if (run.status !== 0) throw new Error(`ffmpeg ${name} failed`);
  }
};

if (process.argv[1] && import.meta.url === new URL(process.argv[1], 'file://').href) main();
