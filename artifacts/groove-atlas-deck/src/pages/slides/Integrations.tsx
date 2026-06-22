export default function Integrations() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#2A1A0A" }}>
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "repeating-linear-gradient(90deg, #8B6914 0px, #8B6914 1px, transparent 1px, transparent 120px)",
        }}
      />

      <div className="absolute inset-0 flex flex-col" style={{ paddingTop: "4.5vh", paddingBottom: "4.5vh", paddingLeft: "8vw", paddingRight: "8vw" }}>
        <div style={{ marginBottom: "3vh" }}>
          <p className="font-body" style={{ fontSize: "1.9vw", color: "#C4971A", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            API Integrations
          </p>
          <div style={{ width: "6vw", height: "0.3vh", background: "#8B6914", marginTop: "1vh" }} />
          <h2 className="font-display" style={{ fontSize: "4.5vw", color: "#F5EDD4", letterSpacing: "0.02em", marginTop: "1.2vh" }}>
            FIVE LIVE APIS · ONE PLATFORM
          </h2>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div className="flex items-center" style={{ paddingTop: "1.4vh", paddingBottom: "1.4vh", paddingLeft: "2vw", borderLeft: "0.4vw solid #8B6914" }}>
            <p className="font-display" style={{ fontSize: "3vw", color: "#C4971A", width: "19vw", flexShrink: 0 }}>
              CYANITE
            </p>
            <p className="font-body" style={{ fontSize: "2.3vw", color: "#F5EDD4", opacity: 0.85 }}>
              Audio AI — BPM, energy, moods, sonic fingerprints per song
            </p>
          </div>

          <div style={{ height: "0.15vh", background: "#8B6914", opacity: 0.2 }} />

          <div className="flex items-center" style={{ paddingTop: "1.4vh", paddingBottom: "1.4vh", paddingLeft: "2vw", borderLeft: "0.4vw solid #8B6914" }}>
            <p className="font-display" style={{ fontSize: "3vw", color: "#C4971A", width: "19vw", flexShrink: 0 }}>
              SONGSTATS
            </p>
            <p className="font-body" style={{ fontSize: "2.3vw", color: "#F5EDD4", opacity: 0.85 }}>
              Streaming stats — Spotify listeners, radio plays, chart history per artist
            </p>
          </div>

          <div style={{ height: "0.15vh", background: "#8B6914", opacity: 0.2 }} />

          <div className="flex items-center" style={{ paddingTop: "1.4vh", paddingBottom: "1.4vh", paddingLeft: "2vw", borderLeft: "0.4vw solid #8B6914" }}>
            <p className="font-display" style={{ fontSize: "3vw", color: "#C4971A", width: "19vw", flexShrink: 0 }}>
              LALAL.AI
            </p>
            <p className="font-body" style={{ fontSize: "2.3vw", color: "#F5EDD4", opacity: 0.85 }}>
              Stem separation — isolates the drum track from any song for study
            </p>
          </div>

          <div style={{ height: "0.15vh", background: "#8B6914", opacity: 0.2 }} />

          <div className="flex items-center" style={{ paddingTop: "1.4vh", paddingBottom: "1.4vh", paddingLeft: "2vw", borderLeft: "0.4vw solid #8B6914" }}>
            <p className="font-display" style={{ fontSize: "3vw", color: "#C4971A", width: "19vw", flexShrink: 0 }}>
              MUSIXMATCH
            </p>
            <p className="font-body" style={{ fontSize: "2.3vw", color: "#F5EDD4", opacity: 0.85 }}>
              Song metadata — ISRC, genres, artist details, catalogue enrichment
            </p>
          </div>

          <div style={{ height: "0.15vh", background: "#8B6914", opacity: 0.2 }} />

          <div className="flex items-center" style={{ paddingTop: "1.4vh", paddingBottom: "1.4vh", paddingLeft: "2vw", borderLeft: "0.4vw solid #8B6914" }}>
            <p className="font-display" style={{ fontSize: "3vw", color: "#C4971A", width: "19vw", flexShrink: 0 }}>
              DEEZER
            </p>
            <p className="font-body" style={{ fontSize: "2.3vw", color: "#F5EDD4", opacity: 0.85 }}>
              30-second previews — sourced automatically to feed LALAL.AI stem extraction
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
