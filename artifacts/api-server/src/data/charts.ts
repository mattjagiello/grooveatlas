export interface ChartTrack {
  trackId: string;
  title: string;
  artist: string;
  albumTitle: string | null;
  rank: number;
  source: string;
}

const CURATED: Record<string, ChartTrack[]> = {
  jazz: [
    { trackId: "j1", title: "Take Five", artist: "Dave Brubeck Quartet", albumTitle: "Time Out", rank: 1, source: "curated" },
    { trackId: "j2", title: "So What", artist: "Miles Davis", albumTitle: "Kind of Blue", rank: 2, source: "curated" },
    { trackId: "j3", title: "A Love Supreme", artist: "John Coltrane", albumTitle: "A Love Supreme", rank: 3, source: "curated" },
    { trackId: "j4", title: "Birdland", artist: "Weather Report", albumTitle: "Heavy Weather", rank: 4, source: "curated" },
    { trackId: "j5", title: "Sing, Sing, Sing", artist: "Benny Goodman", albumTitle: "Carnegie Hall Jazz Concert", rank: 5, source: "curated" },
  ],
  blues: [
    { trackId: "b1", title: "The Thrill Is Gone", artist: "B.B. King", albumTitle: "Completely Well", rank: 1, source: "curated" },
    { trackId: "b2", title: "Sweet Home Chicago", artist: "Robert Johnson", albumTitle: "King of the Delta Blues Singers", rank: 2, source: "curated" },
    { trackId: "b3", title: "Pride and Joy", artist: "Stevie Ray Vaughan", albumTitle: "Texas Flood", rank: 3, source: "curated" },
    { trackId: "b4", title: "Hoochie Coochie Man", artist: "Muddy Waters", albumTitle: "The Best of Muddy Waters", rank: 4, source: "curated" },
    { trackId: "b5", title: "Whole Lotta Shakin' Goin' On", artist: "Jerry Lee Lewis", albumTitle: "Jerry Lee Lewis", rank: 5, source: "curated" },
  ],
  rock: [
    { trackId: "r1", title: "Smells Like Teen Spirit", artist: "Nirvana", albumTitle: "Nevermind", rank: 1, source: "curated" },
    { trackId: "r2", title: "Stairway to Heaven", artist: "Led Zeppelin", albumTitle: "Led Zeppelin IV", rank: 2, source: "curated" },
    { trackId: "r3", title: "Come Together", artist: "The Beatles", albumTitle: "Abbey Road", rank: 3, source: "curated" },
    { trackId: "r4", title: "Born to Run", artist: "Bruce Springsteen", albumTitle: "Born to Run", rank: 4, source: "curated" },
    { trackId: "r5", title: "My Generation", artist: "The Who", albumTitle: "My Generation", rank: 5, source: "curated" },
  ],
  funk: [
    { trackId: "f1", title: "Superstition", artist: "Stevie Wonder", albumTitle: "Talking Book", rank: 1, source: "curated" },
    { trackId: "f2", title: "Give It Up or Turnit a Loose", artist: "James Brown", albumTitle: "Sex Machine", rank: 2, source: "curated" },
    { trackId: "f3", title: "Flash Light", artist: "Parliament", albumTitle: "Funkentelechy Vs. the Placebo Syndrome", rank: 3, source: "curated" },
    { trackId: "f4", title: "Cold Sweat", artist: "James Brown", albumTitle: "Cold Sweat", rank: 4, source: "curated" },
    { trackId: "f5", title: "What Is Hip?", artist: "Tower of Power", albumTitle: "Tower of Power", rank: 5, source: "curated" },
  ],
  soul: [
    { trackId: "s1", title: "Respect", artist: "Aretha Franklin", albumTitle: "I Never Loved a Man the Way I Love You", rank: 1, source: "curated" },
    { trackId: "s2", title: "What's Going On", artist: "Marvin Gaye", albumTitle: "What's Going On", rank: 2, source: "curated" },
    { trackId: "s3", title: "Green Onions", artist: "Booker T. & the MGs", albumTitle: "Green Onions", rank: 3, source: "curated" },
    { trackId: "s4", title: "Try a Little Tenderness", artist: "Otis Redding", albumTitle: "Otis Blue", rank: 4, source: "curated" },
    { trackId: "s5", title: "I Can't Help Myself", artist: "Four Tops", albumTitle: "Four Tops", rank: 5, source: "curated" },
  ],
  hiphop: [
    { trackId: "h1", title: "N.Y. State of Mind", artist: "Nas", albumTitle: "Illmatic", rank: 1, source: "curated" },
    { trackId: "h2", title: "C.R.E.A.M.", artist: "Wu-Tang Clan", albumTitle: "Enter the Wu-Tang (36 Chambers)", rank: 2, source: "curated" },
    { trackId: "h3", title: "Juicy", artist: "The Notorious B.I.G.", albumTitle: "Ready to Die", rank: 3, source: "curated" },
    { trackId: "h4", title: "Shook Ones Pt. II", artist: "Mobb Deep", albumTitle: "The Infamous", rank: 4, source: "curated" },
    { trackId: "h5", title: "Mass Appeal", artist: "Gang Starr", albumTitle: "Hard to Earn", rank: 5, source: "curated" },
  ],
  metal: [
    { trackId: "m1", title: "Master of Puppets", artist: "Metallica", albumTitle: "Master of Puppets", rank: 1, source: "curated" },
    { trackId: "m2", title: "Iron Man", artist: "Black Sabbath", albumTitle: "Paranoid", rank: 2, source: "curated" },
    { trackId: "m3", title: "Tom Sawyer", artist: "Rush", albumTitle: "Moving Pictures", rank: 3, source: "curated" },
    { trackId: "m4", title: "Crazy Train", artist: "Ozzy Osbourne", albumTitle: "Blizzard of Ozz", rank: 4, source: "curated" },
    { trackId: "m5", title: "Lateralus", artist: "Tool", albumTitle: "Lateralus", rank: 5, source: "curated" },
  ],
  reggae: [
    { trackId: "rg1", title: "No Woman, No Cry", artist: "Bob Marley & The Wailers", albumTitle: "Natty Dread", rank: 1, source: "curated" },
    { trackId: "rg2", title: "Redemption Song", artist: "Bob Marley & The Wailers", albumTitle: "Uprising", rank: 2, source: "curated" },
    { trackId: "rg3", title: "The Harder They Come", artist: "Jimmy Cliff", albumTitle: "The Harder They Come", rank: 3, source: "curated" },
    { trackId: "rg4", title: "Roxanne", artist: "The Police", albumTitle: "Outlandos d'Amour", rank: 4, source: "curated" },
    { trackId: "rg5", title: "Red Red Wine", artist: "UB40", albumTitle: "Labour of Love", rank: 5, source: "curated" },
  ],
  afrobeat: [
    { trackId: "ab1", title: "Water No Get Enemy", artist: "Fela Kuti", albumTitle: "Expensive Shit", rank: 1, source: "curated" },
    { trackId: "ab2", title: "Lady", artist: "Fela Kuti", albumTitle: "Lady", rank: 2, source: "curated" },
    { trackId: "ab3", title: "Zombie", artist: "Fela Kuti", albumTitle: "Zombie", rank: 3, source: "curated" },
    { trackId: "ab4", title: "Gentleman", artist: "Fela Kuti", albumTitle: "Gentleman", rank: 4, source: "curated" },
    { trackId: "ab5", title: "Expensive Shit", artist: "Fela Kuti", albumTitle: "Expensive Shit", rank: 5, source: "curated" },
  ],
  latin: [
    { trackId: "l1", title: "Oye Como Va", artist: "Santana", albumTitle: "Abraxas", rank: 1, source: "curated" },
    { trackId: "l2", title: "Mambo No. 5", artist: "Pérez Prado", albumTitle: "Mambo Mania", rank: 2, source: "curated" },
    { trackId: "l3", title: "Quizás, Quizás, Quizás", artist: "Trio Matamoros", albumTitle: "Original Recordings", rank: 3, source: "curated" },
    { trackId: "l4", title: "Chan Chan", artist: "Buena Vista Social Club", albumTitle: "Buena Vista Social Club", rank: 4, source: "curated" },
    { trackId: "l5", title: "El Cuarto de Tula", artist: "Buena Vista Social Club", albumTitle: "Buena Vista Social Club", rank: 5, source: "curated" },
  ],
};

export function getCharts(genreId: string, limit = 5): ChartTrack[] {
  return (CURATED[genreId] ?? []).slice(0, limit);
}
