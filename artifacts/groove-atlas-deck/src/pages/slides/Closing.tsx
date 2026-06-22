export default function Closing() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#2A1A0A" }}>
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "repeating-linear-gradient(135deg, #8B6914 0px, #8B6914 1px, transparent 1px, transparent 60px)",
        }}
      />

      <div className="absolute inset-0 flex" style={{ padding: "7vh 8vw", gap: "6vw" }}>
        <div className="flex flex-col justify-between" style={{ flex: 1 }}>
          <div>
            <div style={{ width: "8vw", height: "0.4vh", background: "#8B6914", marginBottom: "2.5vh" }} />
            <h1 className="font-display" style={{ fontSize: "10vw", color: "#F5EDD4", lineHeight: 0.9, letterSpacing: "0.02em" }}>
              GROOVE
            </h1>
            <h1 className="font-display" style={{ fontSize: "10vw", color: "#8B6914", lineHeight: 0.9, letterSpacing: "0.02em" }}>
              ATLAS
            </h1>
            <p className="font-body" style={{ fontSize: "2.4vw", color: "#F5EDD4", opacity: 0.6, marginTop: "2.5vh", fontStyle: "italic" }}>
              169 drummers · 407 songs · 5 APIs · one GraphQL layer
            </p>
          </div>

          <div style={{ height: "0.25vh", background: "#8B6914", opacity: 0.3 }} />
        </div>

        <div className="flex flex-col justify-center" style={{ width: "48vw", gap: "3vh" }}>
          <p className="font-body" style={{ fontSize: "2.2vw", color: "#C4971A", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5vh" }}>
            Where This Goes
          </p>

          <div style={{ borderLeft: "0.4vw solid #8B6914", paddingLeft: "2vw" }}>
            <p className="font-body" style={{ fontSize: "2.6vw", color: "#F5EDD4", fontWeight: 700 }}>Full song database</p>
            <p className="font-body" style={{ fontSize: "2.3vw", color: "#F5EDD4", opacity: 0.7, marginTop: "0.5vh" }}>
              Expand beyond 407 songs — every significant recording per drummer, crowd-sourced and API-verified
            </p>
          </div>

          <div style={{ height: "0.15vh", background: "#8B6914", opacity: 0.2 }} />

          <div style={{ borderLeft: "0.4vw solid #8B6914", paddingLeft: "2vw" }}>
            <p className="font-body" style={{ fontSize: "2.6vw", color: "#F5EDD4", fontWeight: 700 }}>New genres and traditions</p>
            <p className="font-body" style={{ fontSize: "2.3vw", color: "#F5EDD4", opacity: 0.7, marginTop: "0.5vh" }}>
              Brazilian, African, Indian classical, gospel, country — percussion is global
            </p>
          </div>

          <div style={{ height: "0.15vh", background: "#8B6914", opacity: 0.2 }} />

          <div style={{ borderLeft: "0.4vw solid #8B6914", paddingLeft: "2vw" }}>
            <p className="font-body" style={{ fontSize: "2.6vw", color: "#F5EDD4", fontWeight: 700 }}>Educator and practice tools</p>
            <p className="font-body" style={{ fontSize: "2.3vw", color: "#F5EDD4", opacity: 0.7, marginTop: "0.5vh" }}>
              Curated study playlists, isolated drum stems, BPM-matched practice mode
            </p>
          </div>

          <div style={{ height: "0.15vh", background: "#8B6914", opacity: 0.2 }} />

          <div style={{ borderLeft: "0.4vw solid #8B6914", paddingLeft: "2vw" }}>
            <p className="font-body" style={{ fontSize: "2.6vw", color: "#F5EDD4", fontWeight: 700 }}>Monetization</p>
            <p className="font-body" style={{ fontSize: "2.3vw", color: "#F5EDD4", opacity: 0.7, marginTop: "0.5vh" }}>
              Pro tier for educators, affiliate revenue via streaming links, licensed data API for music platforms
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
