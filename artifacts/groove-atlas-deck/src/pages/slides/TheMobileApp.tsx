export default function TheMobileApp() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#F5EDD4" }}>
      <div
        className="absolute top-0 right-0 w-[35vw] h-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle at 80% 50%, #8B6914, transparent 70%)" }}
      />

      <div className="absolute inset-0 flex" style={{ padding: "6vh 8vw", gap: "5vw" }}>
        <div className="flex flex-col justify-between" style={{ flex: 1 }}>
          <div>
            <p className="font-body" style={{ fontSize: "2.2vw", color: "#8B6914", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              The App
            </p>
            <div style={{ width: "6vw", height: "0.35vh", background: "#8B6914", marginTop: "1.5vh" }} />
            <h2 className="font-display" style={{ fontSize: "6vw", color: "#2A1A0A", letterSpacing: "0.02em", marginTop: "2vh", lineHeight: 1 }}>
              MOBILE FIRST
            </h2>
            <p className="font-body" style={{ fontSize: "2.4vw", color: "#7A6040", marginTop: "2vh", fontStyle: "italic", lineHeight: 1.5 }}>
              Expo · Android primary · Web secondary
            </p>
          </div>

          <div className="flex flex-col" style={{ gap: "2.5vh" }}>
            <div>
              <div style={{ width: "4vw", height: "0.3vh", background: "#8B6914", marginBottom: "1vh" }} />
              <p className="font-body" style={{ fontSize: "2.6vw", color: "#2A1A0A", fontWeight: 700 }}>Drummer Profiles</p>
              <p className="font-body" style={{ fontSize: "2.3vw", color: "#7A6040", marginTop: "0.6vh" }}>
                Bio, era, genre, rhythm profile, contemporaries
              </p>
            </div>
            <div>
              <div style={{ width: "4vw", height: "0.3vh", background: "#8B6914", marginBottom: "1vh" }} />
              <p className="font-body" style={{ fontSize: "2.6vw", color: "#2A1A0A", fontWeight: 700 }}>Song Pages</p>
              <p className="font-body" style={{ fontSize: "2.3vw", color: "#7A6040", marginTop: "0.6vh" }}>
                BPM, energy, moods · Deezer preview · isolated drum stem via LALAL.AI
              </p>
            </div>
            <div>
              <div style={{ width: "4vw", height: "0.3vh", background: "#8B6914", marginBottom: "1vh" }} />
              <p className="font-body" style={{ fontSize: "2.6vw", color: "#2A1A0A", fontWeight: 700 }}>Full-Text Search</p>
              <p className="font-body" style={{ fontSize: "2.3vw", color: "#7A6040", marginTop: "0.6vh" }}>
                Typesense across all drummers, songs, eras, and genres
              </p>
            </div>
          </div>

          <div style={{ height: "0.25vh", background: "#C4971A", opacity: 0.4 }} />
        </div>

        <div
          className="flex flex-col items-center justify-center"
          style={{ width: "22vw", flexShrink: 0 }}
        >
          <div
            style={{
              width: "100%",
              height: "76vh",
              background: "#2A1A0A",
              borderRadius: "3vw",
              border: "0.4vw solid #8B6914",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 2vw 4vw rgba(42,26,10,0.3)",
            }}
          >
            <div style={{ background: "#1A0E05", padding: "1.5vh 2vw", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p className="font-display" style={{ fontSize: "2.2vw", color: "#C4971A" }}>GROOVE ATLAS</p>
              <div style={{ width: "1.5vw", height: "1.5vw", borderRadius: "50%", background: "#8B6914" }} />
            </div>
            <div style={{ flex: 1, padding: "2vh 1.8vw", display: "flex", flexDirection: "column", gap: "1.5vh" }}>
              <div style={{ background: "#F5EDD4", borderRadius: "0.6vw", padding: "1.5vh 1.5vw" }}>
                <p className="font-body" style={{ fontSize: "1.8vw", color: "#8B6914", fontWeight: 700 }}>Featured</p>
                <p className="font-display" style={{ fontSize: "2.6vw", color: "#2A1A0A", marginTop: "0.5vh" }}>TONY WILLIAMS</p>
                <p className="font-body" style={{ fontSize: "1.6vw", color: "#7A6040" }}>Jazz · 1960s–70s</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1vh" }}>
                <div style={{ background: "#8B6914", borderRadius: "0.6vw", padding: "1.2vh 1vw" }}>
                  <p className="font-body" style={{ fontSize: "1.4vw", color: "#F5EDD4", opacity: 0.8 }}>Eras</p>
                  <p className="font-display" style={{ fontSize: "2vw", color: "#F5EDD4" }}>8</p>
                </div>
                <div style={{ background: "#8B6914", borderRadius: "0.6vw", padding: "1.2vh 1vw" }}>
                  <p className="font-body" style={{ fontSize: "1.4vw", color: "#F5EDD4", opacity: 0.8 }}>Genres</p>
                  <p className="font-display" style={{ fontSize: "2vw", color: "#F5EDD4" }}>6</p>
                </div>
              </div>
              <div style={{ background: "#F5EDD4", borderRadius: "0.6vw", padding: "1.2vh 1.5vw" }}>
                <p className="font-body" style={{ fontSize: "1.4vw", color: "#8B6914", fontWeight: 700 }}>Search</p>
                <p className="font-body" style={{ fontSize: "1.6vw", color: "#2A1A0A", marginTop: "0.4vh" }}>169 drummers · 407 songs</p>
              </div>
              <div style={{ background: "#3A2010", borderRadius: "0.6vw", padding: "1.2vh 1.5vw" }}>
                <p className="font-body" style={{ fontSize: "1.4vw", color: "#C4971A", fontWeight: 700 }}>Now Playing</p>
                <p className="font-body" style={{ fontSize: "1.5vw", color: "#F5EDD4", marginTop: "0.4vh" }}>So What · Miles Davis</p>
                <div style={{ marginTop: "1vh", height: "0.4vh", background: "#8B6914", borderRadius: "999px" }}>
                  <div style={{ width: "40%", height: "100%", background: "#C4971A", borderRadius: "999px" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
