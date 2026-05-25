// /tools page data — best tools for creative use cases beyond pure dev work.
// Each pick is opinionated, includes a 1-sentence take + free/paid label.
// Snapshot: May 2026. Mix of open-source + freemium SaaS — both flagged.

export type ToolLicense = 'open-source' | 'freemium' | 'free' | 'paid';

export interface CreativeTool {
  name: string;
  url: string;
  license: ToolLicense;
  os: ('mac' | 'win' | 'linux' | 'web' | 'ios' | 'android')[];
  take: string;          // 1-2 sentence opinionated take
  best_for: string;      // who this is best for
  github?: string;       // owner/repo if open-source
}

export interface UseCaseSection {
  slug: string;
  title: string;          // "Best for video editing"
  intro: string;          // 1-2 sentence framing
  picks: CreativeTool[];
}

export const TOOLS_BY_USE_CASE: UseCaseSection[] = [
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'video-editing',
    title: 'Best for video editing',
    intro: 'From quick social cuts to full feature work. We rank by how fast you can ship the first export, not feature checklists.',
    picks: [
      {
        name: 'DaVinci Resolve',
        url: 'https://www.blackmagicdesign.com/products/davinciresolve',
        license: 'free',
        os: ['mac', 'win', 'linux'],
        take: 'The professional NLE that happens to be free. Industry-standard color grading, Fusion VFX, Fairlight audio — all in one. The only "free" tool that ships Hollywood films.',
        best_for: 'Serious creators who want one tool for life.',
      },
      {
        name: 'Kdenlive',
        url: 'https://kdenlive.org',
        license: 'open-source',
        github: 'KDE/kdenlive',
        os: ['mac', 'win', 'linux'],
        take: 'The most mature open-source NLE. Multi-track, proxy editing, color correction. Linux-first but works everywhere.',
        best_for: 'Linux users + open-source purists.',
      },
      {
        name: 'OpenShot',
        url: 'https://www.openshot.org',
        license: 'open-source',
        github: 'OpenShot/openshot-qt',
        os: ['mac', 'win', 'linux'],
        take: 'Drag-and-drop simple. Slower than Kdenlive for advanced work but the gentlest learning curve in OSS video.',
        best_for: 'Beginners + classroom use.',
      },
      {
        name: 'CapCut',
        url: 'https://www.capcut.com',
        license: 'freemium',
        os: ['mac', 'win', 'web', 'ios', 'android'],
        take: 'Best in class for short-form social video. AI captions, auto-cuts, templates designed for TikTok/Reels/Shorts. Free tier is genuinely usable.',
        best_for: 'Social media creators shipping daily content.',
      },
      {
        name: 'Descript',
        url: 'https://www.descript.com',
        license: 'freemium',
        os: ['mac', 'win', 'web'],
        take: 'Edit video by editing the transcript. Removes "ums" with one click. Game-changer for podcast video + YouTube creators.',
        best_for: 'Podcasters + YouTubers prioritizing speed.',
      },
      {
        name: 'Remotion',
        url: 'https://www.remotion.dev',
        license: 'open-source',
        github: 'remotion-dev/remotion',
        os: ['mac', 'win', 'linux'],
        take: 'Make videos in React. Programmatic video generation at scale — personalized intros, data visualizations, automated cuts. The only tool here that fits in a CI pipeline.',
        best_for: 'Devs automating video output.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'photo-editing',
    title: 'Best for photo editing',
    intro: 'Raster editors for photos, retouching, and digital painting. Picks favor free + open-source where the gap to Adobe is closeable.',
    picks: [
      {
        name: 'Photopea',
        url: 'https://www.photopea.com',
        license: 'free',
        os: ['web'],
        take: 'Free Photoshop in your browser. Reads .psd, .ai, .sketch, .xd. No download, no signup. Closest 1:1 PS replacement that exists.',
        best_for: 'Anyone who opens Photoshop occasionally but won\'t pay Adobe.',
      },
      {
        name: 'GIMP',
        url: 'https://www.gimp.org',
        license: 'open-source',
        github: 'GNOME/gimp',
        os: ['mac', 'win', 'linux'],
        take: '25 years old, fully featured, still the canonical OSS image editor. UI is dated; GIMP 3.0 (2025) helped. Power users love it.',
        best_for: 'Open-source purists who learned Photoshop and switched.',
      },
      {
        name: 'Krita',
        url: 'https://krita.org',
        license: 'open-source',
        github: 'KDE/krita',
        os: ['mac', 'win', 'linux'],
        take: 'Built by digital artists for digital artists. Better brush engine than Photoshop. Free, no nags, professional-grade.',
        best_for: 'Illustrators + concept artists who want to draw, not retouch.',
      },
      {
        name: 'darktable',
        url: 'https://www.darktable.org',
        license: 'open-source',
        github: 'darktable-org/darktable',
        os: ['mac', 'win', 'linux'],
        take: 'Open-source Lightroom replacement. Non-destructive RAW workflow, library management, color grading. The OSS choice for photographers.',
        best_for: 'Photographers managing thousands of RAW files.',
      },
      {
        name: 'RawTherapee',
        url: 'https://www.rawtherapee.com',
        license: 'open-source',
        github: 'Beep6581/RawTherapee',
        os: ['mac', 'win', 'linux'],
        take: 'Best-in-class RAW processor. Even pros export from RawTherapee then finish in Photoshop. Free.',
        best_for: 'Maximum RAW image quality without paying Adobe.',
      },
      {
        name: 'Affinity Photo',
        url: 'https://affinity.serif.com/photo/',
        license: 'paid',
        os: ['mac', 'win', 'ios'],
        take: 'One-time purchase (~$70), no subscription. As powerful as Photoshop for 95% of users. The "pay once" alternative.',
        best_for: 'Pros who refuse Adobe\'s subscription model.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-image-generation',
    title: 'Best for AI image generation',
    intro: 'May 2026 lineup. SDXL is good enough for free, Flux beats it where detail matters, hosted services beat self-host on speed.',
    picks: [
      {
        name: 'ComfyUI',
        url: 'https://github.com/Comfy-Org/ComfyUI',
        license: 'open-source',
        github: 'Comfy-Org/ComfyUI',
        os: ['mac', 'win', 'linux'],
        take: 'Node-based Stable Diffusion + Flux workflow editor. Industry standard for serious AI image work. Steep learning curve, infinite ceiling.',
        best_for: 'Power users running complex multi-stage pipelines.',
      },
      {
        name: 'Automatic1111 (Stable Diffusion WebUI)',
        url: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui',
        license: 'open-source',
        github: 'AUTOMATIC1111/stable-diffusion-webui',
        os: ['mac', 'win', 'linux'],
        take: 'The most popular SD UI. Easier than ComfyUI, less powerful. Still the right starter for "I want to run SD locally tonight".',
        best_for: 'First-time self-hosters.',
      },
      {
        name: 'Fooocus',
        url: 'https://github.com/lllyasviel/Fooocus',
        license: 'open-source',
        github: 'lllyasviel/Fooocus',
        os: ['mac', 'win', 'linux'],
        take: 'One-click image generation built on SDXL. Pre-tuned defaults that look great out of the box. Closest OSS got to "just type a prompt and it works".',
        best_for: 'Anyone who wants Midjourney quality without a subscription.',
      },
      {
        name: 'Flux',
        url: 'https://blackforestlabs.ai',
        license: 'open-source',
        github: 'black-forest-labs/flux',
        os: ['mac', 'win', 'linux'],
        take: 'Best open-source image model in 2026. Beats SDXL on prompt adherence + photorealism. Open weights, commercial use allowed.',
        best_for: 'Builders integrating image gen into a product.',
      },
      {
        name: 'Midjourney',
        url: 'https://www.midjourney.com',
        license: 'paid',
        os: ['web'],
        take: 'Still the highest aesthetic ceiling. v7 generates images you can\'t replicate with OSS yet. $10/mo entry tier.',
        best_for: 'Designers and art-direction-focused work.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'audio-podcasting',
    title: 'Best for audio + podcasting',
    intro: 'Recording, editing, multi-track mixing. Audio engineering has the best OSS-to-paid ratio in this list.',
    picks: [
      {
        name: 'Audacity',
        url: 'https://www.audacityteam.org',
        license: 'open-source',
        github: 'audacity/audacity',
        os: ['mac', 'win', 'linux'],
        take: '20-year veteran. Multi-track, noise reduction, effects. Free forever. UI is dated, but the engine is solid.',
        best_for: 'Anyone editing a podcast or voiceover.',
      },
      {
        name: 'Reaper',
        url: 'https://www.reaper.fm',
        license: 'paid',
        os: ['mac', 'win', 'linux'],
        take: 'Full DAW for $60. Pro-grade alternative to Logic / Pro Tools. Endless 60-day trial — basically shareware.',
        best_for: 'Musicians + audio engineers on a budget.',
      },
      {
        name: 'Ardour',
        url: 'https://ardour.org',
        license: 'open-source',
        github: 'Ardour/ardour',
        os: ['mac', 'win', 'linux'],
        take: 'Open-source DAW with serious teeth. Linux audio engineers swear by it. Strong on mixing + mastering.',
        best_for: 'Linux musicians + pure-OSS workflows.',
      },
      {
        name: 'Riverside.fm',
        url: 'https://riverside.fm',
        license: 'freemium',
        os: ['web'],
        take: 'Records each guest locally, syncs in cloud. Solves the #1 podcast problem (bad guest audio). $15/mo+ for serious use.',
        best_for: 'Remote interview podcasts.',
      },
      {
        name: 'Cleanvoice',
        url: 'https://cleanvoice.ai',
        license: 'paid',
        os: ['web'],
        take: 'AI removes "ums", filler words, mouth noise from a podcast. Saves 2-3 hours per episode of editing.',
        best_for: 'Podcasters editing their own audio weekly.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: '3d-animation',
    title: 'Best for 3D + animation',
    intro: 'From motion graphics to game-engine cinematics. Blender now dominates this category — it really is that good.',
    picks: [
      {
        name: 'Blender',
        url: 'https://www.blender.org',
        license: 'open-source',
        github: 'blender/blender',
        os: ['mac', 'win', 'linux'],
        take: 'Free, professional, used in production films (Spider-Verse). 3D modeling, animation, sculpting, simulation, VFX. There is no longer a reason to pay for Maya unless your studio mandates it.',
        best_for: 'Anyone doing 3D in 2026.',
      },
      {
        name: 'Three.js',
        url: 'https://threejs.org',
        license: 'open-source',
        github: 'mrdoob/three.js',
        os: ['web'],
        take: 'WebGL library for 3D in the browser. Powers most "3D on a website" you\'ve seen — Bruno Simon\'s portfolio, every Vercel hero animation.',
        best_for: 'Web devs adding 3D to product sites.',
      },
      {
        name: 'React Three Fiber',
        url: 'https://docs.pmnd.rs/react-three-fiber',
        license: 'open-source',
        github: 'pmndrs/react-three-fiber',
        os: ['web'],
        take: 'React reconciler for Three.js. Lets you describe 3D scenes in JSX. The "modern" way to build 3D web apps.',
        best_for: 'React devs who don\'t want imperative Three.js code.',
      },
      {
        name: 'Rive',
        url: 'https://rive.app',
        license: 'freemium',
        os: ['web', 'mac', 'win'],
        take: 'Interactive vector animations that run on web + iOS + Android + Flutter from a single file. Replaces Lottie + state machines combined.',
        best_for: 'Designers building animated UI elements.',
      },
      {
        name: 'Theatre.js',
        url: 'https://www.theatrejs.com',
        license: 'open-source',
        github: 'theatre-js/theatre',
        os: ['web'],
        take: 'After Effects–style animation timeline for the web. Animate React, Three.js, HTML — anything — with a visual editor.',
        best_for: 'Devs animating React + Three.js scenes.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'design-prototyping',
    title: 'Best for design + prototyping',
    intro: 'UI design, vector graphics, prototyping. Figma owns the category — but the OSS alternatives are catching up fast.',
    picks: [
      {
        name: 'Penpot',
        url: 'https://penpot.app',
        license: 'open-source',
        github: 'penpot/penpot',
        os: ['web'],
        take: 'The actual open-source Figma. Self-hostable, multiplayer, supports CSS export. Closest OSS got to a Figma replacement.',
        best_for: 'Teams that need design tooling on-premise or in EU jurisdictions.',
      },
      {
        name: 'Inkscape',
        url: 'https://inkscape.org',
        license: 'open-source',
        github: 'inkscape/inkscape',
        os: ['mac', 'win', 'linux'],
        take: 'Open-source Illustrator. Vector graphics, logo design, technical illustration. Slower UX than Illustrator but produces the same SVGs.',
        best_for: 'Vector work without paying Adobe.',
      },
      {
        name: 'Excalidraw',
        url: 'https://excalidraw.com',
        license: 'open-source',
        github: 'excalidraw/excalidraw',
        os: ['web'],
        take: 'Hand-drawn-looking diagrams + flowcharts. Free, no signup, multiplayer. Replaces 80% of whiteboard-style tools.',
        best_for: 'Architecture diagrams + quick visuals in docs.',
      },
      {
        name: 'tldraw',
        url: 'https://www.tldraw.com',
        license: 'open-source',
        github: 'tldraw/tldraw',
        os: ['web'],
        take: 'Infinite canvas whiteboarding. More polished than Excalidraw, full SDK to embed in your app. The 2026 darling of the design+code crossover.',
        best_for: 'Apps embedding a whiteboard feature.',
      },
      {
        name: 'Figma',
        url: 'https://www.figma.com',
        license: 'freemium',
        os: ['web', 'mac', 'win'],
        take: 'Still the industry standard. Generous free tier covers solo + small teams. Why we list it: realistic comparison.',
        best_for: 'Anyone collaborating with other designers — Figma is where they are.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'screen-recording',
    title: 'Best for screen recording',
    intro: 'Async screen sharing replaces 50% of meetings. Loom owns the category — but two free alternatives are genuinely great now.',
    picks: [
      {
        name: 'Cap',
        url: 'https://cap.so',
        license: 'open-source',
        github: 'CapSoftware/Cap',
        os: ['mac', 'win'],
        take: 'Open-source Loom clone. Records, uploads, gives you a share link. Self-host option if you don\'t want SaaS storage.',
        best_for: 'Loom users who want their data and control.',
      },
      {
        name: 'OBS Studio',
        url: 'https://obsproject.com',
        license: 'open-source',
        github: 'obsproject/obs-studio',
        os: ['mac', 'win', 'linux'],
        take: 'Streaming-grade recording with scenes, sources, transitions. Massive feature set, steep curve. Free.',
        best_for: 'Streamers + tutorial creators who need multi-source recording.',
      },
      {
        name: 'Screen Studio',
        url: 'https://screen.studio',
        license: 'paid',
        os: ['mac'],
        take: 'The "looks like a Loom but feels like a feature film" recorder. Auto-zoom, smooth cursor, beautiful camera bubbles. Mac-only.',
        best_for: 'Founders shipping demo videos that need to feel premium.',
      },
      {
        name: 'Loom',
        url: 'https://www.loom.com',
        license: 'freemium',
        os: ['web', 'mac', 'win'],
        take: 'The default. Free tier got worse in 2024 (5 min limit). Still wins on team workflows + integrations.',
        best_for: 'Teams already on a sharing-heavy workflow with Loom.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'note-taking',
    title: 'Best for note-taking + knowledge',
    intro: 'For builders, researchers, and second-brain enthusiasts. Plain text + markdown still beats Notion for long-term ownership.',
    picks: [
      {
        name: 'Obsidian',
        url: 'https://obsidian.md',
        license: 'freemium',
        os: ['mac', 'win', 'linux', 'ios', 'android'],
        take: 'Markdown files on your disk + graph view. Free for personal use. Most powerful note tool that doesn\'t lock you in.',
        best_for: 'Researchers + writers who want to own their data forever.',
      },
      {
        name: 'AppFlowy',
        url: 'https://www.appflowy.io',
        license: 'open-source',
        github: 'AppFlowy-IO/AppFlowy',
        os: ['mac', 'win', 'linux', 'ios', 'android', 'web'],
        take: 'Open-source Notion. Self-hostable, end-to-end encrypted, has databases + kanban + docs. The closest OSS got to Notion-clone.',
        best_for: 'Teams who want Notion without the lock-in.',
      },
      {
        name: 'Logseq',
        url: 'https://logseq.com',
        license: 'open-source',
        github: 'logseq/logseq',
        os: ['mac', 'win', 'linux'],
        take: 'Outliner-style note app like Roam Research. Backlinks, daily journals, block references. Files stay on disk as markdown.',
        best_for: 'Builders practicing zettelkasten / linked thinking.',
      },
      {
        name: 'Notion',
        url: 'https://www.notion.so',
        license: 'freemium',
        os: ['web', 'mac', 'win', 'ios', 'android'],
        take: 'Industry standard collaboration + databases. Free for personal. Premium for teams. Listed because pretending it doesn\'t exist is silly.',
        best_for: 'Teams already in Notion who want the unified workspace.',
      },
    ],
  },
];

export function getUseCaseBySlug(slug: string): UseCaseSection | undefined {
  return TOOLS_BY_USE_CASE.find((s) => s.slug === slug);
}
