export default function HowItWorks() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#F5EDD4" }}>
      <div
        className="absolute top-0 left-0 h-full w-[2vw] opacity-60"
        style={{ background: "linear-gradient(to right, #C4971A, transparent)" }}
      />

      <div className="absolute inset-0 flex flex-col justify-between" style={{ padding: "7vh 8vw" }}>
        <div>
          <p className="font-body" style={{ fontSize: "2.2vw", color: "#8B6914", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            How It Works
          </p>
          <div style={{ width: "6vw", height: "0.35vh", background: "#8B6914", marginTop: "1.5vh" }} />
          <h2 className="font-display" style={{ fontSize: "6vw", color: "#2A1A0A", letterSpacing: "0.02em", marginTop: "2vh", lineHeight: 1 }}>
            REQUEST FLOW
          </h2>
        </div>

        <div className="flex items-center justify-between" style={{ gap: "1vw" }}>
          <div
            className="flex flex-col items-center text-center"
            style={{ flex: 1, background: "#2A1A0A", borderRadius: "0.6vw", padding: "3.5vh 2vw" }}
          >
            <p className="font-display" style={{ fontSize: "2.8vw", color: "#C4971A" }}>EXPO APP</p>
            <p className="font-body" style={{ fontSize: "2.2vw", color: "#F5EDD4", opacity: 0.8, marginTop: "1.5vh" }}>
              React Native · Android-first · graphql-request client
            </p>
          </div>

          <div style={{ fontSize: "4vw", color: "#8B6914", fontWeight: 700, flexShrink: 0 }}>→</div>

          <div
            className="flex flex-col items-center text-center"
            style={{ flex: 1, background: "#8B6914", borderRadius: "0.6vw", padding: "3.5vh 2vw" }}
          >
            <p className="font-display" style={{ fontSize: "2.8vw", color: "#F5EDD4" }}>GRAPHQL API</p>
            <p className="font-body" style={{ fontSize: "2.2vw", color: "#F5EDD4", opacity: 0.85, marginTop: "1.5vh" }}>
              GraphQL Yoga · resolvers fan out to static data + external APIs
            </p>
          </div>

          <div style={{ fontSize: "4vw", color: "#8B6914", fontWeight: 700, flexShrink: 0 }}>→</div>

          <div
            className="flex flex-col items-center text-center"
            style={{ flex: 1, background: "#2A1A0A", borderRadius: "0.6vw", padding: "3.5vh 2vw" }}
          >
            <p className="font-display" style={{ fontSize: "2.8vw", color: "#C4971A" }}>TYPESENSE</p>
            <p className="font-body" style={{ fontSize: "2.2vw", color: "#F5EDD4", opacity: 0.8, marginTop: "1.5vh" }}>
              Full-text search · local binary · indexed on startup
            </p>
          </div>

          <div style={{ fontSize: "4vw", color: "#8B6914", fontWeight: 700, flexShrink: 0 }}>→</div>

          <div
            className="flex flex-col items-center text-center"
            style={{ flex: 1, background: "#2A1A0A", borderRadius: "0.6vw", padding: "3.5vh 2vw" }}
          >
            <p className="font-display" style={{ fontSize: "2.8vw", color: "#C4971A" }}>STATIC JSON</p>
            <p className="font-body" style={{ fontSize: "2.2vw", color: "#F5EDD4", opacity: 0.8, marginTop: "1.5vh" }}>
              169 drummers · 407 songs · source of truth, no database
            </p>
          </div>
        </div>

        <div>
          <div style={{ height: "0.25vh", background: "#8B6914", opacity: 0.3, marginBottom: "2.5vh" }} />
          <p className="font-body" style={{ fontSize: "2.4vw", color: "#7A6040", fontStyle: "italic" }}>
            Static JSON is the source of truth. Cyanite and Songstats load and cache on startup. LALAL.AI stems are fetched on demand, per user request.
          </p>
        </div>
      </div>
    </div>
  );
}
