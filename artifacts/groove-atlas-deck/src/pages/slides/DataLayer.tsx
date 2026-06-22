export default function DataLayer() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#F5EDD4" }}>
      <div
        className="absolute bottom-0 left-0 w-full h-[40vh] opacity-5"
        style={{ background: "linear-gradient(to top, #2A1A0A, transparent)" }}
      />

      <div className="absolute inset-0 flex" style={{ padding: "7vh 8vw" }}>
        <div className="flex flex-col justify-between" style={{ width: "45vw", paddingRight: "4vw" }}>
          <div>
            <p className="font-body" style={{ fontSize: "2.2vw", color: "#8B6914", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              The Data Layer
            </p>
            <div style={{ width: "6vw", height: "0.35vh", background: "#8B6914", marginTop: "1.5vh" }} />
          </div>

          <div>
            <h2 className="font-display" style={{ fontSize: "6.5vw", color: "#2A1A0A", lineHeight: 1.0, letterSpacing: "0.02em" }}>
              GRAPHQL YOGA
            </h2>
            <h2 className="font-display" style={{ fontSize: "6.5vw", color: "#8B6914", lineHeight: 1.0, letterSpacing: "0.02em" }}>
              + TYPESENSE
            </h2>
            <p className="font-body" style={{ fontSize: "2.6vw", color: "#7A6040", marginTop: "3vh", lineHeight: 1.5, fontStyle: "italic" }}>
              Static JSON as the source of truth. Typesense for instant search. GraphQL for flexible client queries.
            </p>
          </div>

          <div style={{ height: "0.25vh", background: "#8B6914", opacity: 0.3 }} />
        </div>

        <div
          className="flex flex-col justify-center gap-[3vh]"
          style={{ width: "47vw", background: "#2A1A0A", borderRadius: "0.8vw", padding: "4vh 3.5vw" }}
        >
          <div>
            <p className="font-body" style={{ fontSize: "2vw", color: "#C4971A", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              GraphQL Schema
            </p>
            <div style={{ marginTop: "1.5vh", height: "0.2vh", background: "#8B6914", opacity: 0.5 }} />
          </div>
          <div style={{ fontFamily: "monospace", fontSize: "2.2vw", color: "#F5EDD4", lineHeight: 1.7 }}>
            <p><span style={{ color: "#C4971A" }}>type</span> <span style={{ color: "#F5EDD4" }}>Drummer</span></p>
            <p style={{ paddingLeft: "2vw", color: "#8B6914" }}>era · genre · vibe</p>
            <p style={{ paddingLeft: "2vw", color: "#8B6914" }}>songs · contemporaries</p>
            <p style={{ marginTop: "1.5vh" }}><span style={{ color: "#C4971A" }}>type</span> <span style={{ color: "#F5EDD4" }}>Song</span></p>
            <p style={{ paddingLeft: "2vw", color: "#8B6914" }}>BPM · energy · moods</p>
            <p style={{ paddingLeft: "2vw", color: "#8B6914" }}>stems · preview</p>
            <p style={{ marginTop: "1.5vh" }}><span style={{ color: "#C4971A" }}>type</span> <span style={{ color: "#F5EDD4" }}>Query</span></p>
            <p style={{ paddingLeft: "2vw", color: "#8B6914" }}>search · drummer · song</p>
          </div>
        </div>
      </div>
    </div>
  );
}
