export type Era = {
  id: string;
  name: string;
  subtitle: string;
  years: string;
  description: string;
  color: string;
  characteristics: string[];
  keyDrummerIds: string[];
  iconicSongIds: string[];
};

export type Genre = {
  id: string;
  name: string;
  origin: string;
  lat: number;
  lng: number;
  era: string;
  description: string;
  color: string;
  characteristics: string[];
  keyDrummerIds: string[];
  iconicSongIds: string[];
};

export type Drummer = {
  id: string;
  name: string;
  born: number;
  died?: number;
  primaryEra: string;
  eras: string[];
  genres: string[];
  bands: string[];
  bio: string;
  signatureStyle: string;
  bpmRange: [number, number];
  influence: string;
  iconicSongIds: string[];
};

export type Song = {
  id: string;
  title: string;
  artist: string;
  drummerId: string;
  year: number;
  eraId: string;
  genreIds: string[];
  tempo: number;
  feel: string;
  complexity: 1 | 2 | 3 | 4 | 5;
  description: string;
  whyStudy: string;
  songsterrSlug?: string;
};

export const ERAS: Era[] = [
  {
    id: '1940s',
    name: '1940s',
    subtitle: 'Swing & Bebop',
    years: '1940–1949',
    description:
      'The big band era gave way to bebop, fundamentally reshaping drumming. Drummers moved timekeeping from the bass drum to the ride cymbal, freeing the rest of the kit for explosive accents. Bebop demanded lightning technique and deep musical conversation.',
    color: '#8B4513',
    characteristics: [
      'Ride cymbal as timekeeper',
      'Brush technique mastery',
      'Swinging triplet feel',
      'Hi-hat on beats 2 and 4',
      'Conversational interaction',
    ],
    keyDrummerIds: ['buddy-rich', 'gene-krupa', 'max-roach'],
    iconicSongIds: ['sing-sing-sing', 'ko-ko'],
  },
  {
    id: '1950s',
    name: '1950s',
    subtitle: 'Birth of Rock & Roll',
    years: '1950–1959',
    description:
      'Rock and roll erupted from rhythm & blues and country, creating a driving backbeat that changed the world. Drumming became simpler, louder, and more physical. The snare on beats 2 and 4 became the pulse of a new generation.',
    color: '#CD853F',
    characteristics: [
      'Driving backbeat',
      'Shuffle groove',
      'Rhythm & blues influence',
      'Straight 4/4 power',
      'Simple but locked-in feel',
    ],
    keyDrummerIds: ['earl-palmer', 'dj-fontana', 'gene-krupa'],
    iconicSongIds: ['hound-dog', 'whole-lotta-shakin'],
  },
  {
    id: '1960s',
    name: '1960s',
    subtitle: 'British Invasion & Soul',
    years: '1960–1969',
    description:
      'The Beatles and British Invasion brought explosive rock drumming to millions. Simultaneously, Motown and Stax soul created immaculate, pocket-driven grooves with metronomic precision and tasteful fills that served the song above all else.',
    color: '#B8860B',
    characteristics: [
      'Fills as dramatic punctuation',
      'Tight Motown pocket',
      'Syncopated soul patterns',
      'Explosive rock fills',
      'Serving the song',
    ],
    keyDrummerIds: ['ringo-starr', 'keith-moon', 'al-jackson-jr'],
    iconicSongIds: ['come-together', 'my-generation', 'green-onions'],
  },
  {
    id: '1970s',
    name: '1970s',
    subtitle: 'Funk, Prog Rock & Heavy Metal',
    years: '1970–1979',
    description:
      'Drumming exploded in every direction in the 1970s. Funk created hypnotic, syncopated grooves with ghost notes and the "one" as the holy grail. Progressive rock pushed complexity to its limits. Heavy metal brought raw, earth-shaking power.',
    color: '#8B6914',
    characteristics: [
      'Funk syncopation and ghost notes',
      'Progressive time signatures',
      'Heavy metal power and speed',
      'Extended drum solos',
      'Groove over technique',
    ],
    keyDrummerIds: ['john-bonham', 'neil-peart', 'clyde-stubblefield', 'billy-cobham'],
    iconicSongIds: ['moby-dick', 'tom-sawyer', 'cold-sweat', 'rosanna'],
  },
  {
    id: '1980s',
    name: '1980s',
    subtitle: 'New Wave, Metal & Hip-Hop',
    years: '1980–1989',
    description:
      'Electronic drum machines entered mainstream music as the Roland TR-808 and TR-909 redefined rhythm. Studio drummers achieved new levels of precision. Speed metal pushed human limits. The gated reverb snare became an icon of the era.',
    color: '#7B68EE',
    characteristics: [
      'Gated reverb snare sound',
      'Electronic drum machine influence',
      'Speed metal precision',
      'Polished studio technique',
      'Machine-influenced feel',
    ],
    keyDrummerIds: ['stewart-copeland', 'jeff-porcaro', 'dave-weckl', 'sheila-e'],
    iconicSongIds: ['roxanne', 'rosanna', 'lets-go-crazy'],
  },
  {
    id: '1990s',
    name: '1990s',
    subtitle: 'Grunge, Hip-Hop & Electronic',
    years: '1990–1999',
    description:
      'Grunge stripped drumming back to primal emotion — loud, raw, and unpolished. Hip-hop producers sampled classic Clyde Stubblefield and Funky Drummer breaks. Electronic music created new rhythmic possibilities outside traditional drumming.',
    color: '#556B2F',
    characteristics: [
      'Raw power and dynamics',
      'Sampled breaks in hip-hop',
      'Extreme dynamic contrast',
      'Back-to-basics rock feel',
      'Emotional expressiveness',
    ],
    keyDrummerIds: ['dave-grohl', 'questlove', 'carter-beauford', 'matt-cameron'],
    iconicSongIds: ['smells-like-teen-spirit', 'what-is-hip'],
  },
  {
    id: '2000s',
    name: '2000s',
    subtitle: 'Digital Age & Post-Rock',
    years: '2000–2009',
    description:
      'Digital recording and Pro Tools transformed how drums were captured. Drummers faced new demands for quantized precision alongside authentic feel. Post-rock and metal explored polyrhythm and extended technique at extreme tempos.',
    color: '#4682B4',
    characteristics: [
      'Studio precision and click tracks',
      'Polyrhythmic patterns',
      'Extreme metal tempos',
      'Hybrid electronic/acoustic setups',
      'YouTube education culture begins',
    ],
    keyDrummerIds: ['travis-barker', 'brann-dailor', 'antonio-sanchez'],
    iconicSongIds: ['all-the-small-things', 'lateralus'],
  },
  {
    id: '2010s',
    name: '2010s',
    subtitle: 'Streaming & Genre Fusion',
    years: '2010–2019',
    description:
      'Streaming democratized music discovery and drumming followed. Trap hi-hat patterns from hip-hop infiltrated pop and R&B. Hybrid electronic/acoustic kits blurred the line between live and programmed. Social media created the viral drum moment.',
    color: '#2E8B57',
    characteristics: [
      'Trap hi-hat subdivisions',
      'Hybrid electronic kits',
      'Genre-blending rhythms',
      'Social media viral moments',
      'Minimalism in pop production',
    ],
    keyDrummerIds: ['nate-smith', 'cindy-blackman', 'antonio-sanchez'],
    iconicSongIds: ['uptown-funk', 'birdland'],
  },
];

export const GENRES: Genre[] = [
  {
    id: 'jazz',
    name: 'Jazz',
    origin: 'New Orleans, USA',
    lat: 29.95,
    lng: -90.07,
    era: '1900s–Present',
    description:
      'Jazz drumming revolutionized rhythm by moving the timekeeping pulse from the bass drum to the ride cymbal, enabling unprecedented musical conversation between players. The swing feel — that loose, triplet-based groove — became the heartbeat of American music.',
    color: '#FFD700',
    characteristics: ['Ride cymbal timekeeping', 'Swing triplet feel', 'Call and response', 'Brush technique'],
    keyDrummerIds: ['buddy-rich', 'gene-krupa', 'max-roach', 'tony-williams', 'elvin-jones'],
    iconicSongIds: ['sing-sing-sing', 'ko-ko', 'birdland'],
  },
  {
    id: 'blues',
    name: 'Blues',
    origin: 'Mississippi Delta, USA',
    lat: 33.0,
    lng: -90.5,
    era: '1920s–Present',
    description:
      'Blues drumming is built on feeling over technique — the shuffle groove, the push-and-pull of the pocket, and the space that makes listeners ache. Every note breathes.',
    color: '#191970',
    characteristics: ['Shuffle groove', 'Deep pocket', 'Space and feel', 'Straight-ahead 12/8'],
    keyDrummerIds: ['earl-palmer'],
    iconicSongIds: ['whole-lotta-shakin'],
  },
  {
    id: 'rock',
    name: 'Rock',
    origin: 'London & New York, USA',
    lat: 51.5,
    lng: -0.1,
    era: '1950s–Present',
    description:
      'Rock drumming took the backbeat from R&B and amplified it to wall-shaking levels. From Ringo\'s melodic fills to John Bonham\'s thunderous Bonham shuffle to Keith Moon\'s explosive chaos, rock gave drums a starring role in popular music.',
    color: '#DC143C',
    characteristics: ['Strong backbeat', 'Power fills', 'Dynamic extremes', 'Driving eighth notes'],
    keyDrummerIds: ['ringo-starr', 'keith-moon', 'john-bonham', 'neil-peart', 'dave-grohl', 'carter-beauford'],
    iconicSongIds: ['come-together', 'my-generation', 'moby-dick', 'smells-like-teen-spirit'],
  },
  {
    id: 'funk',
    name: 'Funk',
    origin: 'Georgia & Tennessee, USA',
    lat: 32.8,
    lng: -83.6,
    era: '1960s–Present',
    description:
      'Funk drumming is built on "the one" — beat one of the bar is the gravitational center of the universe. Ghost notes, syncopated hi-hat patterns, and the interplay between kick and snare create the irresistible groove that makes funk impossible to resist.',
    color: '#FF8C00',
    characteristics: ['The "one" emphasis', 'Ghost notes', 'Syncopated kick patterns', 'Hi-hat interplay'],
    keyDrummerIds: ['clyde-stubblefield', 'questlove'],
    iconicSongIds: ['cold-sweat', 'what-is-hip'],
  },
  {
    id: 'soul',
    name: 'Soul & R&B',
    origin: 'Detroit & Memphis, USA',
    lat: 42.3,
    lng: -83.0,
    era: '1950s–Present',
    description:
      'Soul drumming at Motown and Stax Studios defined precision as a form of expressiveness. Every fill was earned, every accent tasteful, every groove locked tight to the bass. Al Jackson Jr. at Stax and the Funk Brothers at Motown set the standard.',
    color: '#B22222',
    characteristics: ['Locked pocket', 'Tasteful minimal fills', 'Accent precision', 'Song-first philosophy'],
    keyDrummerIds: ['al-jackson-jr', 'earl-palmer'],
    iconicSongIds: ['green-onions'],
  },
  {
    id: 'hiphop',
    name: 'Hip-Hop',
    origin: 'South Bronx, New York, USA',
    lat: 40.8,
    lng: -73.9,
    era: '1970s–Present',
    description:
      'Hip-hop broke the rhythm world open by sampling classic drum breaks — especially "Funky Drummer" by Clyde Stubblefield — and looping them into new contexts. Live hip-hop drumming, pioneered by Questlove and the Roots, brought the groove back to the stage.',
    color: '#800080',
    characteristics: ['Sampled breaks', 'Laid-back feel', 'Boom-bap pocket', 'Programmed feel when live'],
    keyDrummerIds: ['questlove', 'clyde-stubblefield'],
    iconicSongIds: ['what-is-hip'],
  },
  {
    id: 'metal',
    name: 'Metal',
    origin: 'Birmingham, United Kingdom',
    lat: 52.5,
    lng: -1.9,
    era: '1970s–Present',
    description:
      'Metal drumming took rock power and pushed it to extremes of speed, precision, and volume. Double kick drumming enabled machine-gun rhythms. Blast beats in death metal pushed human limits. Progressive metal combined technical mastery with creative complexity.',
    color: '#4A4A4A',
    characteristics: ['Double kick patterns', 'Blast beats', 'Speed and precision', 'Dynamic power shifts'],
    keyDrummerIds: ['neil-peart', 'brann-dailor', 'matt-cameron'],
    iconicSongIds: ['tom-sawyer', 'lateralus'],
  },
  {
    id: 'reggae',
    name: 'Reggae',
    origin: 'Kingston, Jamaica',
    lat: 17.9,
    lng: -76.8,
    era: '1960s–Present',
    description:
      'Reggae drumming created a completely new rhythmic feel by emphasizing the "and" of beat three (the skank) while leaving spaces where Western music typically places accents. The one-drop pattern — where the bass drum emphasizes beat three only — is its most iconic contribution.',
    color: '#228B22',
    characteristics: ['One-drop pattern', 'Skank on the "and"', 'Sparse and spacious', 'Rim shots on two'],
    keyDrummerIds: ['stewart-copeland'],
    iconicSongIds: ['roxanne'],
  },
  {
    id: 'afrobeat',
    name: 'Afrobeat',
    origin: 'Lagos, Nigeria',
    lat: 6.5,
    lng: 3.4,
    era: '1970s–Present',
    description:
      'Fela Kuti and Tony Allen created Afrobeat by fusing jazz, funk, and West African rhythmic traditions. Allen\'s drumming was polyrhythmic genius — multiple independent rhythmic layers that lock together into a hypnotic whole, drawing from traditional Yoruba drumming.',
    color: '#FF4500',
    characteristics: ['Polyrhythmic layering', 'West African traditional rhythms', 'Jazz-funk fusion', 'Extended grooves'],
    keyDrummerIds: ['billy-cobham'],
    iconicSongIds: ['birdland'],
  },
  {
    id: 'latin',
    name: 'Latin',
    origin: 'Havana, Cuba',
    lat: 23.1,
    lng: -82.4,
    era: '1940s–Present',
    description:
      'Latin drumming draws from centuries of Afro-Cuban rhythmic traditions — clave, montuno, mambo — and fused them with jazz, pop, and rock. The clave pattern underpins everything, and Latin drummers must understand rhythm as a circular, interlocking system rather than a linear beat.',
    color: '#9400D3',
    characteristics: ['Clave foundation', 'Afro-Cuban patterns', 'Montuno rhythms', 'Layered polyrhythm'],
    keyDrummerIds: ['tito-puente'],
    iconicSongIds: ['rosanna'],
  },
];

export const DRUMMERS: Drummer[] = [
  {
    id: 'buddy-rich',
    name: 'Buddy Rich',
    born: 1917,
    died: 1987,
    primaryEra: '1950s',
    eras: ['1940s', '1950s', '1960s', '1970s', '1980s'],
    genres: ['jazz'],
    bands: ['Buddy Rich Big Band', 'Tommy Dorsey Orchestra'],
    bio: 'Often called the greatest drummer who ever lived, Buddy Rich was a self-taught prodigy who began performing professionally as a toddler. His big band drumming combined blazing speed, phenomenal power, and an effortless musicality that left audiences stunned for decades. He never read music yet commanded orchestras with absolute authority.',
    signatureStyle: 'Lightning-fast single-stroke rolls, explosive big band power, and effortless swing feel at any tempo.',
    bpmRange: [120, 300],
    influence: 'Set the technical benchmark for all jazz drumming that followed. His big band recordings remain the definitive example of swing drumming at its most spectacular.',
    iconicSongIds: ['sing-sing-sing'],
  },
  {
    id: 'gene-krupa',
    name: 'Gene Krupa',
    born: 1909,
    died: 1973,
    primaryEra: '1940s',
    eras: ['1940s', '1950s'],
    genres: ['jazz'],
    bands: ['Benny Goodman Orchestra', 'Gene Krupa Orchestra'],
    bio: 'Gene Krupa turned the drum kit into a star attraction. His showmanship and technical brilliance brought the drums to center stage in Benny Goodman\'s Orchestra, making him the first famous rock star drummer decades before rock existed. His 1937 solo on "Sing, Sing, Sing" is one of the most celebrated performances in music history.',
    signatureStyle: 'Theatrical showmanship combined with solid swing technique. Krupa made watching the drummer as exciting as hearing the music.',
    bpmRange: [90, 220],
    influence: 'Elevated the drummer from rhythm section support to featured soloist and public celebrity. Created the visual template for rock drumming.',
    iconicSongIds: ['sing-sing-sing'],
  },
  {
    id: 'max-roach',
    name: 'Max Roach',
    born: 1924,
    died: 2007,
    primaryEra: '1940s',
    eras: ['1940s', '1950s', '1960s', '1970s'],
    genres: ['jazz'],
    bands: ['Charlie Parker Quintet', 'Clifford Brown-Max Roach Quintet'],
    bio: 'Max Roach was bebop\'s rhythmic architect. He developed the modern jazz drumming approach where the ride cymbal carries the time and the rest of the kit is used melodically and compositionally. His political consciousness led to landmark albums like "We Insist! Freedom Now Suite," making him drumming\'s first activist-artist.',
    signatureStyle: 'Melodic use of the entire drum kit, precise bebop ride cymbal patterns, and a compositional approach to drumming that treats drums as a pitched instrument.',
    bpmRange: [100, 280],
    influence: 'Defined modern jazz drumming. Every jazz drummer since learns Max Roach\'s conceptual approach to ride cymbal timekeeping and melodic use of the kit.',
    iconicSongIds: ['ko-ko'],
  },
  {
    id: 'earl-palmer',
    name: 'Earl Palmer',
    born: 1924,
    died: 2008,
    primaryEra: '1950s',
    eras: ['1950s', '1960s', '1970s', '1980s'],
    genres: ['rock', 'blues', 'soul'],
    bands: ['Session musician – no primary band'],
    bio: 'Earl Palmer is the invisible genius behind rock and roll. As the go-to session drummer in New Orleans and later Los Angeles, he played on more hit records than any drummer in history — including early hits for Fats Domino, Little Richard, and hundreds of others. He invented the rock and roll backbeat as we know it.',
    signatureStyle: 'Invented the modern rock backbeat. Metronomic consistency, perfect pocket, and the ability to adapt to any musical style with complete naturalness.',
    bpmRange: [80, 180],
    influence: 'The uncredited rhythmic foundation of early rock and roll. His adaptability defined what a professional session drummer means.',
    iconicSongIds: ['hound-dog', 'whole-lotta-shakin'],
  },
  {
    id: 'dj-fontana',
    name: 'D.J. Fontana',
    born: 1931,
    died: 2018,
    primaryEra: '1950s',
    eras: ['1950s', '1960s'],
    genres: ['rock', 'blues'],
    bands: ["Elvis Presley's Band"],
    bio: 'D.J. Fontana was the drummer behind Elvis Presley\'s greatest recordings, including "Hound Dog" and "Jailhouse Rock." His instinctive, muscular playing was the rhythmic backbone of early rock and roll\'s most iconic performances. He joined Elvis in 1954 and became one of the most recorded drummers in music history.',
    signatureStyle: 'Powerful, instinctive rock and roll playing with explosive snare fills and a driving shuffle feel that perfectly matched Elvis\'s hip-swinging energy.',
    bpmRange: [90, 160],
    influence: 'Defined the sound of early rock and roll drumming through his work with Elvis. His instinctive style influenced every rock drummer who followed.',
    iconicSongIds: ['hound-dog'],
  },
  {
    id: 'ringo-starr',
    name: 'Ringo Starr',
    born: 1940,
    primaryEra: '1960s',
    eras: ['1960s', '1970s'],
    genres: ['rock'],
    bands: ['The Beatles'],
    bio: 'Often underestimated, Ringo Starr\'s drumming is a masterclass in taste, melody, and song-serving. His unconventional patterns — leading fills with his left hand, playing off the snare melody — created unique rhythmic identities for every Beatles song. Tracks like "Come Together," "Rain," and "A Day in the Life" showcase drumming that is both simple and uncopyably distinctive.',
    signatureStyle: 'Left-hand led fills, melodic approach to drum patterns, and an uncanny ability to create the perfect rhythmic statement for each song.',
    bpmRange: [80, 150],
    influence: 'Proved that feel and musicality matter more than technical flash. His work with The Beatles remains a masterclass in creative simplicity.',
    iconicSongIds: ['come-together'],
  },
  {
    id: 'keith-moon',
    name: 'Keith Moon',
    born: 1946,
    died: 1978,
    primaryEra: '1960s',
    eras: ['1960s', '1970s'],
    genres: ['rock'],
    bands: ['The Who'],
    bio: 'Keith Moon was drumming\'s great anarchist — he played melodies on the drums, treated the kit as a lead instrument, and refused to play a static timekeeping role. His explosive, lead-style drumming on "My Generation," "Won\'t Get Fooled Again," and "Baba O\'Riley" sounds like nothing before or since. He was simultaneously chaotic and deeply musical.',
    signatureStyle: 'Melodic lead drumming, explosive fills that ignore bar lines, simultaneous tom runs and cymbal crashes that create rhythmic chaos from which groove magically emerges.',
    bpmRange: [100, 200],
    influence: 'Redefined what a drummer could do musically. His approach to drums as a melodic lead instrument opened entirely new creative possibilities.',
    iconicSongIds: ['my-generation'],
  },
  {
    id: 'al-jackson-jr',
    name: 'Al Jackson Jr.',
    born: 1935,
    died: 1975,
    primaryEra: '1960s',
    eras: ['1960s', '1970s'],
    genres: ['soul', 'funk', 'blues'],
    bands: ['Booker T. & the MGs', 'Stax session band'],
    bio: 'Al Jackson Jr. was the heartbeat of Stax Records, playing on virtually every session recorded at the legendary Memphis studio. His drumming on "Green Onions," Otis Redding\'s recordings, and Al Green\'s catalog defined Southern soul\'s rhythmic language. Called "The Human Timepiece," his pocket was immaculate and his fills were never wasted.',
    signatureStyle: 'The Human Timepiece — unshakeable pocket, minimal fills deployed with maximum impact, and a groove that made every note feel inevitable.',
    bpmRange: [80, 140],
    influence: 'The defining voice of Southern soul drumming. His approach to pocket and minimalism is still the gold standard for groove-first drumming.',
    iconicSongIds: ['green-onions'],
  },
  {
    id: 'john-bonham',
    name: 'John Bonham',
    born: 1948,
    died: 1980,
    primaryEra: '1970s',
    eras: ['1970s'],
    genres: ['rock', 'blues', 'funk'],
    bands: ['Led Zeppelin'],
    bio: 'John Bonham redefined what was physically possible on a drum kit. His massive, thunderous sound came not from force but from remarkable technique — a loose wrist stroke that produced an enormous tone. The "Bonham Shuffle" on "Fool in the Rain," the devastating opening beats of "When the Levee Breaks," and the extended solo on "Moby Dick" represent drumming at its most primal and powerful.',
    signatureStyle: 'Earth-shaking power from relaxed technique, the triplet-based Bonham shuffle, deep bass drum sound, and the ability to swing hard rock with genuine funk feel.',
    bpmRange: [60, 180],
    influence: 'The defining template for hard rock and heavy metal drumming. His combination of power, feel, and musicality has never been replicated.',
    iconicSongIds: ['moby-dick'],
  },
  {
    id: 'clyde-stubblefield',
    name: 'Clyde Stubblefield',
    born: 1943,
    died: 2017,
    primaryEra: '1960s',
    eras: ['1960s', '1970s'],
    genres: ['funk', 'soul'],
    bands: ["James Brown's Band"],
    bio: 'Clyde Stubblefield is the most sampled drummer in history. His performance on "Funky Drummer" in 1969 created a drum break that has been sampled thousands of times in hip-hop. His work with James Brown defined what funk drumming means — complex syncopation, ghost notes, and an ironclad groove that makes dancing involuntary.',
    signatureStyle: 'Deep funk syncopation, ghost note mastery, and the ability to create intricate rhythmic patterns that still feel locked and funky rather than complicated.',
    bpmRange: [90, 130],
    influence: 'The most sampled drummer in history. The "Funky Drummer" break is the rhythmic DNA of hip-hop music.',
    iconicSongIds: ['cold-sweat'],
  },
  {
    id: 'neil-peart',
    name: 'Neil Peart',
    born: 1952,
    died: 2020,
    primaryEra: '1970s',
    eras: ['1970s', '1980s', '1990s', '2000s'],
    genres: ['rock', 'metal'],
    bands: ['Rush'],
    bio: 'Neil Peart is widely considered the greatest rock drummer of all time. His encyclopedic command of odd time signatures, complex rhythmic patterns, and ability to maintain these while playing perfectly in service of Rush\'s compositions made him uniquely influential. His approach combined technical mastery with genuine musicality and thoughtful, literate lyrics that made him a complete artist.',
    signatureStyle: 'Mastery of complex time signatures, seamlessly integrated electronic and acoustic elements, and the ability to play extraordinarily complex patterns that still feel musical.',
    bpmRange: [80, 200],
    influence: 'Set the technical and musical standard for progressive rock drumming. His work inspired an entire generation of serious drummers to pursue both technique and musicality.',
    iconicSongIds: ['tom-sawyer', 'lateralus'],
  },
  {
    id: 'billy-cobham',
    name: 'Billy Cobham',
    born: 1944,
    primaryEra: '1970s',
    eras: ['1970s', '1980s'],
    genres: ['jazz', 'rock', 'afrobeat'],
    bands: ['Mahavishnu Orchestra'],
    bio: 'Billy Cobham bridged jazz and rock with extraordinary power and musicality in the Mahavishnu Orchestra. Playing open-handed (not crossing his arms), he developed a unique approach to drumming that was simultaneously ferocious and musical. His album "Spectrum" is considered one of the greatest jazz-fusion drum albums ever recorded.',
    signatureStyle: 'Open-handed drumming technique, fusion of jazz vocabulary with rock power, and explosive energy that launched jazz-rock fusion as a genre.',
    bpmRange: [100, 250],
    influence: 'Pioneered jazz-rock fusion drumming and the open-handed technique. His power and musicality influenced generations of fusion and progressive drummers.',
    iconicSongIds: ['birdland'],
  },
  {
    id: 'stewart-copeland',
    name: 'Stewart Copeland',
    born: 1952,
    primaryEra: '1980s',
    eras: ['1980s'],
    genres: ['rock', 'reggae'],
    bands: ['The Police'],
    bio: 'Stewart Copeland created a unique hybrid of reggae, punk, and rock that defined The Police\'s sound. His use of reggae-influenced rhythms — the skank on the upbeat, the one-drop feel — combined with rock energy and punk attitude created something completely original. His hi-hat patterns are studies in rhythmic creativity.',
    signatureStyle: 'Reggae-influenced rhythms played with rock energy, highly syncopated hi-hat patterns, and a distinctive cross-stick snare sound that defined The Police\'s groove.',
    bpmRange: [90, 160],
    influence: 'Showed how to blend non-Western rhythmic traditions with rock music. Inspired a generation to look beyond standard rock patterns for inspiration.',
    iconicSongIds: ['roxanne'],
  },
  {
    id: 'jeff-porcaro',
    name: 'Jeff Porcaro',
    born: 1954,
    died: 1992,
    primaryEra: '1980s',
    eras: ['1980s'],
    genres: ['rock', 'soul'],
    bands: ['Toto'],
    bio: 'Jeff Porcaro was the definitive studio drummer of the 1980s. His half-time shuffle on Toto\'s "Rosanna" — dubbed the "Rosanna Shuffle" — is considered one of the most sophisticated grooves in rock history. Combining Motown influences with jazz feel and rock precision, Porcaro appeared on more gold records than any drummer of his generation.',
    signatureStyle: 'The Rosanna Shuffle (half-time feel with a swinging ghost note pattern), perfect pocket, and the musical sensitivity to serve any style from pop to rock to R&B.',
    bpmRange: [80, 150],
    influence: 'Defined 1980s studio drumming. The Rosanna Shuffle is one of the most studied grooves in contemporary drumming education.',
    iconicSongIds: ['rosanna'],
  },
  {
    id: 'dave-grohl',
    name: 'Dave Grohl',
    born: 1969,
    primaryEra: '1990s',
    eras: ['1990s', '2000s'],
    genres: ['rock'],
    bands: ['Nirvana', 'Foo Fighters'],
    bio: 'Dave Grohl\'s drumming on Nirvana\'s "Nevermind" helped define the grunge movement and proved that pure emotional power could trump technical complexity. His playing is ferocious, loud, and completely in service of the song — maximizing impact at every moment. After Nirvana, he became a rock star in his own right with Foo Fighters.',
    signatureStyle: 'Maximum emotional impact, explosive dynamics, powerful backbeat, and fills that land with stunning force at exactly the right musical moment.',
    bpmRange: [100, 180],
    influence: 'The definitive grunge drummer. Showed that primal power and emotional authenticity are as valid as technical mastery.',
    iconicSongIds: ['smells-like-teen-spirit'],
  },
  {
    id: 'questlove',
    name: 'Questlove',
    born: 1971,
    primaryEra: '1990s',
    eras: ['1990s', '2000s', '2010s'],
    genres: ['hiphop', 'funk', 'soul'],
    bands: ['The Roots'],
    bio: 'Questlove is hip-hop\'s greatest live drummer, bringing the programmed feel of classic boom-bap and the James Brown funk tradition to a live performance context. With The Roots, he demonstrated that hip-hop rhythm could be as deep and soulful in live performance as any recorded track. His scholarship of drum history makes him as much curator as performer.',
    signatureStyle: 'Playing hip-hop\'s laid-back, behind-the-beat feel on a live kit, deeply rooted in funk and soul tradition, with encyclopedic knowledge of drum history.',
    bpmRange: [80, 120],
    influence: 'Established live hip-hop drumming as a serious pursuit and became drumming\'s most important cultural scholar and ambassador.',
    iconicSongIds: ['what-is-hip'],
  },
  {
    id: 'carter-beauford',
    name: 'Carter Beauford',
    born: 1957,
    primaryEra: '1990s',
    eras: ['1990s', '2000s'],
    genres: ['rock', 'jazz'],
    bands: ['Dave Matthews Band'],
    bio: 'Carter Beauford plays open-handed (like Billy Cobham), giving him unique ability to lead patterns with his right hand on the hi-hat without crossing his arms. His work with Dave Matthews Band combines jazz sophistication, funk groove, and rock power in a fluid style that feels both complex and completely natural. His hi-hat work alone is a masterclass in rhythmic creativity.',
    signatureStyle: 'Open-handed technique, jazz-influenced fluidity within rock context, sophisticated hi-hat independence, and explosive fills that maintain perfect time.',
    bpmRange: [90, 170],
    influence: 'Popularized open-handed drumming and demonstrated how jazz vocabulary can enrich rock music without sacrificing groove.',
    iconicSongIds: ['come-together'],
  },
  {
    id: 'travis-barker',
    name: 'Travis Barker',
    born: 1975,
    primaryEra: '2000s',
    eras: ['2000s', '2010s'],
    genres: ['rock', 'hiphop'],
    bands: ['Blink-182'],
    bio: 'Travis Barker brought hip-hop fluency to punk rock drumming and became a cultural crossover phenomenon. His blazing speed, creative fills, and ability to blend hip-hop rhythmic sensibility with punk rock energy made Blink-182 one of the most rhythmically interesting bands of their era. His solo work brought him to collaborate with nearly every major hip-hop artist.',
    signatureStyle: 'Hip-hop influenced fills within punk/rock context, extraordinary speed, and the ability to bring street credibility to arena rock drumming.',
    bpmRange: [120, 220],
    influence: 'Bridged the gap between punk rock and hip-hop drumming, inspiring a generation of young drummers who loved both genres.',
    iconicSongIds: ['all-the-small-things'],
  },
];

export const SONGS: Song[] = [
  {
    id: 'sing-sing-sing',
    title: 'Sing, Sing, Sing',
    artist: 'Benny Goodman',
    drummerId: 'gene-krupa',
    year: 1937,
    eraId: '1940s',
    genreIds: ['jazz'],
    tempo: 228,
    feel: 'Swinging big band',
    complexity: 3,
    description:
      'Gene Krupa\'s extended solo in this recording is one of the most famous drum performances ever captured. His combination of explosive fills, swinging brushwork, and theatrical presentation elevated the drum solo from novelty to art form.',
    whyStudy:
      'The definitive swing era drum solo. Study it to understand how to build dramatic tension, when to play sparse and when to explode, and how to entertain without losing musicality.',
    songsterrSlug: 'benny-goodman-sing-sing-sing-tabs-s127000',
  },
  {
    id: 'ko-ko',
    title: 'Ko-Ko',
    artist: 'Charlie Parker',
    drummerId: 'max-roach',
    year: 1945,
    eraId: '1940s',
    genreIds: ['jazz'],
    tempo: 300,
    feel: 'Bebop',
    complexity: 5,
    description:
      'Max Roach\'s drumming on this bebop landmark at 300 BPM established the modern jazz drumming template. His ride cymbal pattern, hi-hat on 2 and 4, and spontaneous melodic fills with the rest of the kit defined the bebop rhythm section approach.',
    whyStudy:
      'Ground zero for modern jazz drumming. The ride cymbal pattern, hi-hat placement, and melodic approach to fills here created the entire framework that jazz drumming still follows.',
    songsterrSlug: 'charlie-parker-ko-ko',
  },
  {
    id: 'hound-dog',
    title: 'Hound Dog',
    artist: 'Elvis Presley',
    drummerId: 'dj-fontana',
    year: 1956,
    eraId: '1950s',
    genreIds: ['rock', 'blues'],
    tempo: 180,
    feel: 'Driving rock and roll',
    complexity: 1,
    description:
      'D.J. Fontana\'s drumming here is the simplest and most powerful statement of rock and roll drumming — pure backbeat, forward momentum, and zero wasted notes. It proves that knowing when not to play is as important as playing.',
    whyStudy:
      'The perfect introduction to rock and roll drumming. Study this to understand how to serve the song completely, how powerful simplicity can be, and how to make a beat feel urgent.',
    songsterrSlug: 'elvis-presley-hound-dog-tabs',
  },
  {
    id: 'whole-lotta-shakin',
    title: "Whole Lotta Shakin' Goin' On",
    artist: 'Jerry Lee Lewis',
    drummerId: 'earl-palmer',
    year: 1957,
    eraId: '1950s',
    genreIds: ['rock', 'blues'],
    tempo: 168,
    feel: 'Rock shuffle',
    complexity: 2,
    description:
      'Earl Palmer\'s drumming on this session captured the raw, swinging shuffle feel of early rock and roll at its most spontaneous and alive. The groove swings without losing its rock edge.',
    whyStudy:
      'Study the shuffle feel and how to make it rock. Palmer shows how to bridge the gap between the jazz-influenced shuffle and the forward drive of early rock and roll.',
    songsterrSlug: 'jerry-lee-lewis-whole-lotta-shakin',
  },
  {
    id: 'come-together',
    title: 'Come Together',
    artist: 'The Beatles',
    drummerId: 'ringo-starr',
    year: 1969,
    eraId: '1960s',
    genreIds: ['rock'],
    tempo: 82,
    feel: 'Laid-back rock swagger',
    complexity: 2,
    description:
      'Ringo Starr\'s drumming on "Come Together" is one of the most distinctive grooves in rock history. His deliberate, swinging snare placement combined with a tom-heavy approach creates a loose, swaggering feel that defines the track as much as any lyric.',
    whyStudy:
      'Study how to create rhythmic identity through feel rather than complexity. Ringo\'s laid-back snare placement and tom-forward approach show that personality matters more than technique.',
    songsterrSlug: 'beatles-come-together-tabs-s19671',
  },
  {
    id: 'my-generation',
    title: 'My Generation',
    artist: 'The Who',
    drummerId: 'keith-moon',
    year: 1965,
    eraId: '1960s',
    genreIds: ['rock'],
    tempo: 188,
    feel: 'Explosive proto-punk',
    complexity: 4,
    description:
      'Keith Moon\'s drumming on "My Generation" is drumming as pure energy and rebellion. His fills don\'t respect bar lines, his patterns don\'t always "make sense" conventionally, yet the result is somehow perfectly musical and intensely exciting.',
    whyStudy:
      'Study how to break rules meaningfully. Moon shows that when you have enough feel and conviction, unconventional patterns can be more exciting than technically correct ones.',
    songsterrSlug: 'the-who-my-generation-tabs-s26505',
  },
  {
    id: 'green-onions',
    title: 'Green Onions',
    artist: 'Booker T. & the MGs',
    drummerId: 'al-jackson-jr',
    year: 1962,
    eraId: '1960s',
    genreIds: ['soul', 'blues'],
    tempo: 100,
    feel: 'Southern soul groove',
    complexity: 1,
    description:
      'Al Jackson Jr.\'s drumming on "Green Onions" is the definitive example of playing for the song. Every note is perfectly placed, the groove is irresistible, and the minimalist approach makes the entire track feel simultaneously relaxed and inevitable.',
    whyStudy:
      'The gold standard of groove-first drumming. Study how Al Jackson creates maximum impact with minimum notes, and how a locked-in, minimal approach can carry an entire song.',
    songsterrSlug: 'booker-t-green-onions-tabs',
  },
  {
    id: 'cold-sweat',
    title: 'Cold Sweat',
    artist: 'James Brown',
    drummerId: 'clyde-stubblefield',
    year: 1967,
    eraId: '1960s',
    genreIds: ['funk', 'soul'],
    tempo: 108,
    feel: 'Deep funk',
    complexity: 3,
    description:
      'The track that defined funk drumming. Clyde Stubblefield\'s playing here introduced the world to syncopated funk patterns with ghost notes, emphasizing the "one" of each bar. Generations of hip-hop producers sampled this track.',
    whyStudy:
      'Essential for understanding funk drumming. Study the ghost note patterns, kick drum syncopation, and how to create a groove that simultaneously sounds complex and irresistibly locked-in.',
    songsterrSlug: 'james-brown-cold-sweat-tabs',
  },
  {
    id: 'moby-dick',
    title: 'Moby Dick',
    artist: 'Led Zeppelin',
    drummerId: 'john-bonham',
    year: 1969,
    eraId: '1970s',
    genreIds: ['rock', 'blues'],
    tempo: 128,
    feel: 'Heavy rock with funk undertones',
    complexity: 5,
    description:
      'John Bonham\'s extended solo showcase captures everything that made him unique — massive sound, deep pocket, and the ability to swing hard rock music with genuine funk feel. His triplet-based approach and remarkable physical power are on full display.',
    whyStudy:
      'Study Bonham\'s triplet-based playing style, his massive relaxed-wrist stroke technique, and how to create power without stiffness. Essential for understanding hard rock drumming\'s foundation.',
    songsterrSlug: 'led-zeppelin-moby-dick-tabs-s128494',
  },
  {
    id: 'tom-sawyer',
    title: 'Tom Sawyer',
    artist: 'Rush',
    drummerId: 'neil-peart',
    year: 1981,
    eraId: '1980s',
    genreIds: ['rock', 'metal'],
    tempo: 176,
    feel: 'Progressive rock precision',
    complexity: 5,
    description:
      'Neil Peart\'s drumming on "Tom Sawyer" is the gold standard of progressive rock drumming. His ability to navigate complex time signature changes while maintaining momentum and musicality made Rush\'s complex music feel natural and powerful.',
    whyStudy:
      'The definitive progressive rock drum study. Learn how to play complex patterns musically, how to handle time signature changes naturally, and how to make technical complexity feel effortless.',
    songsterrSlug: 'rush-tom-sawyer-tabs-s6018',
  },
  {
    id: 'roxanne',
    title: 'Roxanne',
    artist: 'The Police',
    drummerId: 'stewart-copeland',
    year: 1978,
    eraId: '1980s',
    genreIds: ['rock', 'reggae'],
    tempo: 131,
    feel: 'Reggae-influenced new wave',
    complexity: 3,
    description:
      'Stewart Copeland\'s drumming on "Roxanne" fuses reggae\'s rhythmic philosophy with rock energy in a way that sounds completely natural. His hi-hat patterns, skank-influenced accents, and cross-stick work create a groove that is simultaneously tight and loose.',
    whyStudy:
      'Study how to incorporate reggae rhythmic concepts into rock music. Copeland shows how hi-hat patterns can be a primary creative voice and how non-Western influences can transform a groove.',
    songsterrSlug: 'the-police-roxanne-tabs-s26628',
  },
  {
    id: 'rosanna',
    title: 'Rosanna',
    artist: 'Toto',
    drummerId: 'jeff-porcaro',
    year: 1982,
    eraId: '1980s',
    genreIds: ['rock', 'soul'],
    tempo: 118,
    feel: 'Half-time shuffle groove',
    complexity: 4,
    description:
      'The "Rosanna Shuffle" — Jeff Porcaro\'s half-time feel pattern with its complex ghost note structure — is one of the most studied and celebrated grooves in contemporary drumming. It combines Motown soul, New Orleans second-line, and studio precision into something completely original.',
    whyStudy:
      'Essential study for understanding the half-time shuffle and ghost note technique. The Rosanna groove teaches how to swing inside a half-time feel while maintaining forward momentum.',
    songsterrSlug: 'toto-rosanna-tabs-s31688',
  },
  {
    id: 'lets-go-crazy',
    title: "Let's Go Crazy",
    artist: 'Prince',
    drummerId: 'sheila-e',
    year: 1984,
    eraId: '1980s',
    genreIds: ['funk', 'rock'],
    tempo: 142,
    feel: 'Funky rock explosion',
    complexity: 3,
    description:
      'The drumming on this track exemplifies the 1980s fusion of funk groove with rock energy — tight, funky, and driving. The syncopated patterns and consistent pocket throughout create a groove that makes standing still impossible.',
    whyStudy:
      'Study how to blend funk syncopation with rock drive. Analyze how to maintain a pocket at high tempos and how to keep complex patterns feeling natural and locked.',
    songsterrSlug: 'prince-lets-go-crazy-tabs',
  },
  {
    id: 'smells-like-teen-spirit',
    title: 'Smells Like Teen Spirit',
    artist: 'Nirvana',
    drummerId: 'dave-grohl',
    year: 1991,
    eraId: '1990s',
    genreIds: ['rock'],
    tempo: 116,
    feel: 'Explosive grunge dynamics',
    complexity: 2,
    description:
      'Dave Grohl\'s drumming on "Teen Spirit" defined grunge\'s dynamic vocabulary — quiet verse, explosive chorus — and proved that primal power can be as sophisticated a musical statement as technical complexity. His fills are perfectly timed for maximum impact.',
    whyStudy:
      'Study dynamic contrast as a musical device. Grohl shows how to make explosive moments more powerful by contrast, and how timing a fill correctly matters more than how complex the fill is.',
    songsterrSlug: 'nirvana-smells-like-teen-spirit-tabs-s24898',
  },
  {
    id: 'what-is-hip',
    title: 'What Is Hip?',
    artist: 'Tower of Power',
    drummerId: 'questlove',
    year: 1973,
    eraId: '1970s',
    genreIds: ['funk', 'soul'],
    tempo: 98,
    feel: 'Deep Oakland funk',
    complexity: 4,
    description:
      'One of the deepest funk grooves ever recorded, this track\'s drumming is a lesson in how to create sophisticated syncopation while maintaining an irresistible groove. The interplay between kick drum, snare ghost notes, and hi-hat creates a rhythmic conversation that rewards close listening.',
    whyStudy:
      'Essential for understanding deep funk groove. Study the kick/snare/hi-hat interplay and how complex syncopation can feel completely natural when the pocket is deep enough.',
    songsterrSlug: 'tower-of-power-what-is-hip-tabs',
  },
  {
    id: 'birdland',
    title: 'Birdland',
    artist: 'Weather Report',
    drummerId: 'billy-cobham',
    year: 1977,
    eraId: '1970s',
    genreIds: ['jazz', 'afrobeat'],
    tempo: 138,
    feel: 'Jazz-fusion explosion',
    complexity: 5,
    description:
      'Billy Cobham\'s playing on jazz-fusion tracks of this era demonstrated how to combine jazz rhythmic vocabulary with rock power and world music polyrhythm. His open-handed technique creates a unique visual and sonic experience.',
    whyStudy:
      'Study the open-handed drumming technique and how to bring jazz complexity to high-energy contexts. Essential for understanding jazz-rock fusion drumming\'s vocabulary.',
    songsterrSlug: 'weather-report-birdland-tabs',
  },
  {
    id: 'all-the-small-things',
    title: 'All the Small Things',
    artist: 'Blink-182',
    drummerId: 'travis-barker',
    year: 1999,
    eraId: '2000s',
    genreIds: ['rock'],
    tempo: 149,
    feel: 'Punk rock precision',
    complexity: 2,
    description:
      'Travis Barker\'s drumming here shows how punk rock drumming can be both simple and remarkably precise. The fills have hip-hop influenced subdivision that adds rhythmic sophistication to what is otherwise a driving rock beat.',
    whyStudy:
      'Study how hip-hop rhythmic influences can be incorporated naturally into rock drumming. Barker shows how to add sophistication to simple patterns without overcomplicating them.',
    songsterrSlug: 'blink-182-all-the-small-things-tabs-s18617',
  },
  {
    id: 'lateralus',
    title: 'Lateralus',
    artist: 'Tool',
    drummerId: 'neil-peart',
    year: 2001,
    eraId: '2000s',
    genreIds: ['metal', 'rock'],
    tempo: 100,
    feel: 'Progressive metal with Fibonacci time',
    complexity: 5,
    description:
      'Tool\'s "Lateralus" famously uses Fibonacci sequence numbers to determine time signature changes. The drumming navigates these mathematical structures while maintaining musical flow — one of progressive metal\'s greatest achievements.',
    whyStudy:
      'Study how mathematical concepts can be used musically. The time signature navigation demonstrates how to make intellectual complexity feel emotionally powerful.',
    songsterrSlug: 'tool-lateralus-tabs-s10553',
  },
  {
    id: 'uptown-funk',
    title: 'Uptown Funk',
    artist: 'Mark Ronson ft. Bruno Mars',
    drummerId: 'questlove',
    year: 2014,
    eraId: '2010s',
    genreIds: ['funk', 'soul'],
    tempo: 115,
    feel: 'Modern funk throwback',
    complexity: 2,
    description:
      'The drumming on "Uptown Funk" demonstrates how classic funk patterns can be applied in modern pop productions. The tight pocket, tasteful fills, and locked-in groove reference the 1970s and 80s without sounding nostalgic.',
    whyStudy:
      'Study how classic funk patterns work in modern pop contexts. Analyze how to modernize a vintage groove while keeping it authentic.',
    songsterrSlug: 'mark-ronson-uptown-funk-tabs-s1152697',
  },
];

export function getDrummerById(id: string): Drummer | undefined {
  return DRUMMERS.find((d) => d.id === id);
}

export function getSongById(id: string): Song | undefined {
  return SONGS.find((s) => s.id === id);
}

export function getEraById(id: string): Era | undefined {
  return ERAS.find((e) => e.id === id);
}

export function getGenreById(id: string): Genre | undefined {
  return GENRES.find((g) => g.id === id);
}

export function getDrummersByIds(ids: string[]): Drummer[] {
  return ids.map(getDrummerById).filter(Boolean) as Drummer[];
}

export function getSongsByIds(ids: string[]): Song[] {
  return ids.map(getSongById).filter(Boolean) as Song[];
}

export function getDrummersByEra(eraId: string): Drummer[] {
  return DRUMMERS.filter((d) => d.eras.includes(eraId));
}

export function getDrummersByGenre(genreId: string): Drummer[] {
  return DRUMMERS.filter((d) => d.genres.includes(genreId));
}

export function getSongsByEra(eraId: string): Song[] {
  return SONGS.filter((s) => s.eraId === eraId);
}

export function getSongsByGenre(genreId: string): Song[] {
  return SONGS.filter((s) => s.genreIds.includes(genreId));
}

export function searchAll(query: string): {
  drummers: Drummer[];
  songs: Song[];
  genres: Genre[];
  eras: Era[];
} {
  const q = query.toLowerCase().trim();
  if (!q) return { drummers: [], songs: [], genres: [], eras: [] };
  return {
    drummers: DRUMMERS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.bands.some((b) => b.toLowerCase().includes(q)) ||
        d.genres.some((g) => g.toLowerCase().includes(q))
    ),
    songs: SONGS.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        s.feel.toLowerCase().includes(q)
    ),
    genres: GENRES.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.origin.toLowerCase().includes(q)
    ),
    eras: ERAS.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.subtitle.toLowerCase().includes(q)
    ),
  };
}
