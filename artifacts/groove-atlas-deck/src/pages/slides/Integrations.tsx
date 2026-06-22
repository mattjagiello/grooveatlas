export default function Integrations() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#2A1A0A" }}>
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "repeating-linear-gradient(90deg, #8B6914 0px, #8B6914 1px, transparent 1px, transparent 120px)",
        }}
      />

      <div className="absolute inset-0 flex flex-col" style={{ padding: "6vh 8vw" }}>
        <div style={{ marginBottom: "4vh" }}>
          <p className="font-body" style={{ fontSize: "2.2vw", color: "#C4971A", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            API Integrations
          </p>
          <div style={{ width: "6vw", height: "0.35vh", background: "#8B6914", marginTop: "1.5vh" }} />
          <h2 className="font-display" style={{ fontSize: "5.5vw", color: "#F5EDD4", letterSpacing: "0.02em", marginTop: "2vh" }}>
            FIVE LIVE APIS · ONE PLATFORM
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-[2.2vh]" style={{ flex: 1 }}>
          <div className="flex items-center gap-[3vw]" style={{ borderLeft: "0.4vw solid #8B6914", paddingLeft: "2vw" }}>
            <p className="font-display" style={{ fontSize: "3.5vw", color: "#C4971A", width: "22vw", flexShrink: 0 }}>
              CYANITE
            </p>
            <p className="font-body" style={{ fontSize: "2.6vw", color: "#F5EDD4", opacity: 0.85 }}>
              Audio AI — BPM, energy, moods, sonic fingerprints per song
            </p>
          </div>

          <div style={{ height: "0.15vh", background: "#8B6914", opacity: 0.2 }} />

          <div className="flex items-center gap-[3vw]" style={{ borderLeft: "0.4vw solid #8B6914", paddingLeft: "2vw" }}>
            <p className="font-display" style={{ fontSize: "3.5vw", color: "#C4971A", width: "22vw", flexShrink: 0 }}>
              SONGSTATS
            </p>
            <p className="font-body" style={{ fontSize: "2.6vw", color: "#F5EDD4", opacity: 0.85 }}>
              Streaming stats — Spotify listeners, radio plays, chart history
            </p>
          </div>

          <div style={{ height: "0.15vh", background: "#8B6914", opacity: 0.2 }} />

          <div className="flex items-center gap-[3vw]" style={{ borderLeft: "0.4vw solid #8B6914", paddingLeft: "2vw" }}>
            <p className="font-display" style={{ fontSize: "3.5vw", color: "#C4971A", width: "22vw", flexShrink: 0 }}>
              LALAL.AI
            </p>
            <p className="font-body" style={{ fontSize: "2.6vw", color: "#F5EDD4", opacity: 0.85 }}>
              Stem separation — isolates the drum track from any song for study
            </p>
          </div>

          <div style={{ height: "0.15vh", background: "#8B6914", opacity: 0.2 }} />

          <div className="flex items-center gap-[3vw]" style={{ borderLeft: "0.4vw solid #8B6914", paddingLeft: "2vw" }}>
            <p className="font-display" style={{ fontSize: "3.5vw", color: "#C4971A", width: "22vw", flexShrink: 0 }}>
              MUSIXMATCH
            </p>
            <p className="font-body" style={{ fontSize: "2.6vw", color: "#F5EDD4", opacity: 0.85 }}>
              Song metadata — ISRC, genres, artist details, catalogue enrichment
            </p>
          </div>

          <div style={{ height: "0.15vh", background: "#8B6914", opacity: 0.2 }} />

          <div className="flex items-center gap-[3vw]" style={{ borderLeft: "0.4vw solid #8B6914", paddingLeft: "2vw" }}>
            <p className="font-display" style={{ fontSize: "3.5vw", color: "#C4971A", width: "22vw", flexShrink: 0 }}>
              DEEZER
            </p>
            <p className="font-body" style={{ fontSize: "2.6vw", color: "#F5EDD4", opacity: 0.85 }}>
              30-second audio previews — feeds LALAL.AI stem extraction in-app
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
