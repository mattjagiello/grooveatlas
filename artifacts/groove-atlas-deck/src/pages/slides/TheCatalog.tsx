export default function TheCatalog() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#F5EDD4" }}>
      <div
        className="absolute top-0 right-0 w-[30vw] h-full opacity-5"
        style={{ background: "linear-gradient(to left, #8B6914, transparent)" }}
      />

      <div className="absolute inset-0 flex flex-col justify-between" style={{ padding: "7vh 8vw" }}>
        <div>
          <p className="font-body" style={{ fontSize: "2.2vw", color: "#8B6914", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            The Catalog
          </p>
          <div style={{ width: "6vw", height: "0.35vh", background: "#8B6914", marginTop: "1.5vh" }} />
        </div>

        <div>
          <h2 className="font-display" style={{ fontSize: "7vw", color: "#2A1A0A", lineHeight: 1, letterSpacing: "0.02em" }}>
            EIGHT DECADES OF
          </h2>
          <h2 className="font-display" style={{ fontSize: "7vw", color: "#8B6914", lineHeight: 1, letterSpacing: "0.02em" }}>
            DRUM HISTORY
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-[4vw]">
          <div>
            <p className="font-display" style={{ fontSize: "11vw", color: "#2A1A0A", lineHeight: 1 }}>
              169
            </p>
            <p className="font-body" style={{ fontSize: "2.8vw", color: "#8B6914", fontWeight: 700, marginTop: "1vh" }}>
              Drummers
            </p>
            <p className="font-body" style={{ fontSize: "2.4vw", color: "#7A6040", marginTop: "0.8vh" }}>
              1940s through today — jazz, funk, rock, latin, soul, hip-hop, and more
            </p>
          </div>
          <div>
            <p className="font-display" style={{ fontSize: "11vw", color: "#2A1A0A", lineHeight: 1 }}>
              407
            </p>
            <p className="font-body" style={{ fontSize: "2.8vw", color: "#8B6914", fontWeight: 700, marginTop: "1vh" }}>
              Songs
            </p>
            <p className="font-body" style={{ fontSize: "2.4vw", color: "#7A6040", marginTop: "0.8vh" }}>
              Each with audio analysis, vibe data, and playable previews
            </p>
          </div>
          <div>
            <p className="font-display" style={{ fontSize: "11vw", color: "#2A1A0A", lineHeight: 1 }}>
              5
            </p>
            <p className="font-body" style={{ fontSize: "2.8vw", color: "#8B6914", fontWeight: 700, marginTop: "1vh" }}>
              Live APIs
            </p>
            <p className="font-body" style={{ fontSize: "2.4vw", color: "#7A6040", marginTop: "0.8vh" }}>
              Real-time audio intelligence and streaming data on every song
            </p>
          </div>
        </div>

        <div style={{ height: "0.25vh", background: "#C4971A", opacity: 0.4 }} />
      </div>
    </div>
  );
}
