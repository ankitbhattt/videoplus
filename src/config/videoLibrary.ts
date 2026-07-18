import { getSnapflixVideoUrl } from './snapflixVideos';

export interface HomeVideoItem {
  name: string;
  video: string;
  image: string;
}

const POSTERS: Record<string, string> = {
  'GTA 6 Trailer': 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&auto=format&fit=crop',
  'OnePiece Edit': 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop',
  'Cyberpunk Edit': 'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=800&auto=format&fit=crop',
  'OnePiece Quotes': 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800&auto=format&fit=crop',
  'Death Note Edit': 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop',
  'Demon Slayer Fight': 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&auto=format&fit=crop',
  'Jojo Pucci Edit': 'https://images.unsplash.com/photo-1611834905996-b30d97dcf651?w=800&auto=format&fit=crop',
  'Tunnel to Summer': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop',
  'OnePiece Funny': 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop',
  'Naruto X Hinata': 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop',
  'Sung Jin Woo': 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&auto=format&fit=crop',
  'Naruto vs Sasuke': 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&auto=format&fit=crop',
  'Gear 5 Awakening': 'https://images.unsplash.com/photo-1498889444388-e67ea62c464b?w=800&auto=format&fit=crop',
  'Top Anime Edit': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop',
  'Usopp Moment': 'https://images.unsplash.com/photo-1532009324734-20a7a5813719?w=800&auto=format&fit=crop',
  'OnePiece Gear 5': 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop',
};

const S3_FILE_MAP: Record<string, string> = {
  'GTA 6 Trailer': '157 - Gta 6 Trailer.mp4',
  'OnePiece Edit': '127 - Onepiece Edit.mp4',
  'Cyberpunk Edit': '134 - Cyberpunk Edit.mp4',
  'OnePiece Quotes': '153 - The Quotes From Onepiece.mp4',
  'Death Note Edit': '148 - Death Note Edit.mp4',
  'Demon Slayer Fight': '122 - Demon Slayer Fight Scene.mp4',
  'Jojo Pucci Edit': '126 - Jojo Pucci Edit.mp4',
  'Tunnel to Summer': '123. - The Tunnel To Summer.mp4',
  'OnePiece Funny': '165 - Onepiece Funny Momment.mp4',
  'Naruto X Hinata': '161 - Naruto X Hinata.mp4',
  'Sung Jin Woo': '169 - Sung Jin Woo Badass.mp4',
  'Naruto vs Sasuke': '191 - Naruto X Sasuke.mp4',
  'Gear 5 Awakening': '199 - Gear 5 Awaken Moment.mp4',
  'Top Anime Edit': '132 - Top Anime Edit.mp4',
  'Usopp Moment': '188 - The Usopp Moment.mp4',
  'OnePiece Gear 5': '199 - Gear 5 Awaken Moment.mp4',
};

const buildVideo = (name: string): HomeVideoItem => ({
  name,
  video: getSnapflixVideoUrl(S3_FILE_MAP[name]),
  image: POSTERS[name],
});

export const CAROUSEL_VIDEOS = [
  buildVideo('GTA 6 Trailer'),
  buildVideo('OnePiece Edit'),
  buildVideo('Cyberpunk Edit'),
  buildVideo('OnePiece Quotes'),
  buildVideo('Death Note Edit'),
];

export const HOME_CATEGORY_SECTIONS = [
  {
    title: 'TOP TRENDING VIDEOS',
    games: [
      buildVideo('Demon Slayer Fight'),
      buildVideo('Jojo Pucci Edit'),
      buildVideo('Tunnel to Summer'),
      buildVideo('OnePiece Edit'),
    ],
  },
  {
    title: 'ADVENTURE VIDEOS',
    games: [
      buildVideo('Cyberpunk Edit'),
      buildVideo('OnePiece Quotes'),
      buildVideo('Death Note Edit'),
      buildVideo('OnePiece Funny'),
    ],
  },
  {
    title: 'ACTION VIDEOS',
    games: [
      buildVideo('GTA 6 Trailer'),
      buildVideo('Naruto X Hinata'),
      buildVideo('Sung Jin Woo'),
      buildVideo('Naruto vs Sasuke'),
    ],
  },
  {
    title: 'BRAIN TEASE VIDEOS',
    games: [
      buildVideo('Gear 5 Awakening'),
      buildVideo('Top Anime Edit'),
      buildVideo('Usopp Moment'),
      buildVideo('OnePiece Gear 5'),
    ],
  },
  {
    title: 'FIGHTING VIDEOS',
    games: [
      buildVideo('Demon Slayer Fight'),
      buildVideo('Jojo Pucci Edit'),
      buildVideo('Cyberpunk Edit'),
      buildVideo('Death Note Edit'),
    ],
  },
];

export const TRENDING_HOME_VIDEOS = [
  buildVideo('GTA 6 Trailer'),
  buildVideo('OnePiece Edit'),
  buildVideo('Cyberpunk Edit'),
  buildVideo('Death Note Edit'),
];

export const ALL_HOME_VIDEOS: HomeVideoItem[] = Array.from(
  new Map(
    [
      ...CAROUSEL_VIDEOS,
      ...HOME_CATEGORY_SECTIONS.flatMap((section) => section.games),
      ...TRENDING_HOME_VIDEOS,
    ].map((video) => [video.name, video])
  ).values()
);

export const primeVideoFrame = (videoEl: HTMLVideoElement) => {
  if (videoEl.currentTime === 0) {
    videoEl.currentTime = 0.01;
  }
};
