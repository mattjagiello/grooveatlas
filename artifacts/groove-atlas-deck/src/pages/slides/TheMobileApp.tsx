const base = import.meta.env.BASE_URL;

export default function TheMobileApp() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#F5EDD4" }}>
      <div
        className="absolute top-0 right-0 w-[35vw] h-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle at 80% 50%, #8B6914, transparent 70%)" }}
      />

      <div className="absolute inset-0 flex" style={{ paddingTop: "6vh", paddingBottom: "6vh", paddingLeft: "8vw", paddingRight: "8vw", gap: "5vw" }}>
        <div className="flex flex-col justify-between" style={{ flex: 1 }}>
          <div>
            <p className="font-body" style={{ fontSize: "2.2vw", color: "#8B6914", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              The App
            </p>
            <div style={{ width: "6vw", height: "0.35vh", background: "#8B6914", marginTop: "1.5vh" }} />
            <h2 className="font-display" style={{ fontSize: "6vw", color: "#2A1A0A", letterSpacing: "0.02em", marginTop: "2vh", lineHeight: 1 }}>
              MOBILE FIRST
            </h2>
            <p className="font-body" style={{ fontSize: "2.4vw", color: "#7A6040", marginTop: "1.5vh", fontStyle: "italic", lineHeight: 1.5 }}>
              Expo · iOS and Android · Web secondary
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
          className="flex items-center justify-center"
          style={{ width: "22vw", flexShrink: 0 }}
        >
          <div style={{
            width: "100%",
            height: "80vh",
            borderRadius: "2.5vw",
            border: "0.5vw solid #8B6914",
            overflow: "hidden",
            boxShadow: "0 2vw 5vw rgba(42,26,10,0.25)",
            background: "#2A1A0A",
          }}>
            <img
              src={`${base}app-screenshot.jpg`}
              crossOrigin="anonymous"
              alt="Groove Atlas app screenshot"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
