export default function Cover() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#2A1A0A" }}>
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, #8B6914 0px, #8B6914 1px, transparent 1px, transparent 80px), repeating-linear-gradient(90deg, #8B6914 0px, #8B6914 1px, transparent 1px, transparent 80px)",
        }}
      />

      <div className="absolute inset-0 flex flex-col justify-between" style={{ padding: "8vh 8vw" }}>
        <div>
          <p className="font-body" style={{ fontSize: "2.2vw", color: "#C4971A", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Hackathon Pitch · June 2026
          </p>
        </div>

        <div>
          <div style={{ width: "12vw", height: "0.4vh", background: "#8B6914", marginBottom: "3vh" }} />
          <h1 className="font-display" style={{ fontSize: "14vw", color: "#F5EDD4", lineHeight: 0.9, letterSpacing: "0.02em" }}>
            GROOVE
          </h1>
          <h1 className="font-display" style={{ fontSize: "14vw", color: "#8B6914", lineHeight: 0.9, letterSpacing: "0.02em" }}>
            ATLAS
          </h1>
          <div style={{ marginTop: "4vh" }}>
            <p className="font-body" style={{ fontSize: "2.8vw", color: "#F5EDD4", opacity: 0.8, fontStyle: "italic" }}>
              A drum history and discovery platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-[4vw]">
          <p className="font-body" style={{ fontSize: "2.2vw", color: "#C4971A" }}>
            Cyanite
          </p>
          <span style={{ color: "#8B6914", fontSize: "2vw" }}>·</span>
          <p className="font-body" style={{ fontSize: "2.2vw", color: "#C4971A" }}>
            Songstats
          </p>
          <span style={{ color: "#8B6914", fontSize: "2vw" }}>·</span>
          <p className="font-body" style={{ fontSize: "2.2vw", color: "#C4971A" }}>
            LALAL.AI
          </p>
          <span style={{ color: "#8B6914", fontSize: "2vw" }}>·</span>
          <p className="font-body" style={{ fontSize: "2.2vw", color: "#C4971A" }}>
            Musixmatch
          </p>
          <span style={{ color: "#8B6914", fontSize: "2vw" }}>·</span>
          <p className="font-body" style={{ fontSize: "2.2vw", color: "#C4971A" }}>
            Deezer
          </p>
        </div>
      </div>
    </div>
  );
}
