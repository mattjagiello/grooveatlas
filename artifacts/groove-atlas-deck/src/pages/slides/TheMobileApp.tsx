export default function TheMobileApp() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#F5EDD4" }}>
      <div
        className="absolute top-0 right-0 w-[35vw] h-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle at 80% 50%, #8B6914, transparent 70%)" }}
      />

      <div className="absolute inset-0 flex" style={{ padding: "7vh 8vw", gap: "6vw" }}>
        <div className="flex flex-col justify-between" style={{ flex: 1 }}>
          <div>
            <p className="font-body" style={{ fontSize: "2.2vw", color: "#8B6914", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              The App
            </p>
            <div style={{ width: "6vw", height: "0.35vh", background: "#8B6914", marginTop: "1.5vh" }} />
            <h2 className="font-display" style={{ fontSize: "6vw", color: "#2A1A0A", letterSpacing: "0.02em", marginTop: "2vh", lineHeight: 1 }}>
              MOBILE FIRST
            </h2>
            <p className="font-body" style={{ fontSize: "2.6vw", color: "#7A6040", marginTop: "2vh", fontStyle: "italic", lineHeight: 1.5 }}>
              Built with Expo · Android primary · Web secondary
            </p>
          </div>

          <div className="flex flex-col gap-[3vh]">
            <div>
              <div style={{ width: "4vw", height: "0.3vh", background: "#8B6914", marginBottom: "1.2vh" }} />
              <p className="font-body" style={{ fontSize: "2.8vw", color: "#2A1A0A", fontWeight: 700 }}>Drummer Profiles</p>
              <p className="font-body" style={{ fontSize: "2.4vw", color: "#7A6040", marginTop: "0.8vh" }}>
                Bio, era, genre, rhythm profile, contemporaries
              </p>
            </div>
            <div>
              <div style={{ width: "4vw", height: "0.3vh", background: "#8B6914", marginBottom: "1.2vh" }} />
              <p className="font-body" style={{ fontSize: "2.8vw", color: "#2A1A0A", fontWeight: 700 }}>Song Pages</p>
              <p className="font-body" style={{ fontSize: "2.4vw", color: "#7A6040", marginTop: "0.8vh" }}>
                BPM, energy, time signature, moods, Deezer preview, isolated drum stem
              </p>
            </div>
            <div>
              <div style={{ width: "4vw", height: "0.3vh", background: "#8B6914", marginBottom: "1.2vh" }} />
              <p className="font-body" style={{ fontSize: "2.8vw", color: "#2A1A0A", fontWeight: 700 }}>Full-Text Search</p>
              <p className="font-body" style={{ fontSize: "2.4vw", color: "#7A6040", marginTop: "0.8vh" }}>
                Typesense across drummers, songs, eras, and genres
              </p>
            </div>
          </div>

          <div style={{ height: "0.25vh", background: "#C4971A", opacity: 0.4 }} />
        </div>

        <div
          className="flex flex-col justify-center items-center"
          style={{ width: "28vw", background: "#2A1A0A", borderRadius: "2vw", padding: "4vh 3vw", gap: "2.5vh" }}
        >
          <p className="font-display" style={{ fontSize: "3vw", color: "#C4971A", letterSpacing: "0.05em" }}>STACK</p>
          <div style={{ width: "100%", height: "0.2vh", background: "#8B6914", opacity: 0.4 }} />

          <p className="font-body" style={{ fontSize: "2.4vw", color: "#F5EDD4", textAlign: "center" }}>Expo / React Native</p>
          <p className="font-body" style={{ fontSize: "2.4vw", color: "#F5EDD4", textAlign: "center" }}>Expo Router (file-based)</p>
          <p className="font-body" style={{ fontSize: "2.4vw", color: "#F5EDD4", textAlign: "center" }}>graphql-request + React Query</p>
          <p className="font-body" style={{ fontSize: "2.4vw", color: "#F5EDD4", textAlign: "center" }}>GraphQL Yoga API</p>
          <p className="font-body" style={{ fontSize: "2.4vw", color: "#F5EDD4", textAlign: "center" }}>Typesense search</p>

          <div style={{ width: "100%", height: "0.2vh", background: "#8B6914", opacity: 0.4 }} />
          <p className="font-body" style={{ fontSize: "2.2vw", color: "#C4971A", textAlign: "center", fontStyle: "italic" }}>
            Deployed live on Replit
          </p>
        </div>
      </div>
    </div>
  );
}
