export default function Closing() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#2A1A0A" }}>
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "repeating-linear-gradient(135deg, #8B6914 0px, #8B6914 1px, transparent 1px, transparent 60px)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-[50vh]"
        style={{ background: "linear-gradient(to top, rgba(139,105,20,0.15), transparent)" }}
      />

      <div className="absolute inset-0 flex flex-col justify-between" style={{ padding: "8vh 8vw" }}>
        <div>
          <p className="font-body" style={{ fontSize: "2.2vw", color: "#C4971A", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Built on Replit · June 2026
          </p>
        </div>

        <div>
          <div style={{ width: "12vw", height: "0.4vh", background: "#8B6914", marginBottom: "3vh" }} />
          <h1 className="font-display" style={{ fontSize: "12vw", color: "#F5EDD4", lineHeight: 0.9, letterSpacing: "0.02em" }}>
            GROOVE
          </h1>
          <h1 className="font-display" style={{ fontSize: "12vw", color: "#8B6914", lineHeight: 0.9, letterSpacing: "0.02em" }}>
            ATLAS
          </h1>
          <p className="font-body" style={{ fontSize: "2.8vw", color: "#F5EDD4", opacity: 0.7, marginTop: "3vh", fontStyle: "italic" }}>
            169 drummers · 407 songs · 5 APIs · one GraphQL layer
          </p>
        </div>

        <div className="flex flex-col gap-[1.5vh]">
          <div style={{ height: "0.25vh", background: "#8B6914", opacity: 0.4 }} />
          <div className="flex gap-[6vw]">
            <div>
              <p className="font-body" style={{ fontSize: "2.2vw", color: "#C4971A", fontWeight: 700 }}>
                What's live
              </p>
              <p className="font-body" style={{ fontSize: "2.4vw", color: "#F5EDD4", opacity: 0.8, marginTop: "0.8vh" }}>
                Deployed Expo app · GraphQL API · all 5 integrations working
              </p>
            </div>
            <div>
              <p className="font-body" style={{ fontSize: "2.2vw", color: "#C4971A", fontWeight: 700 }}>
                What's next
              </p>
              <p className="font-body" style={{ fontSize: "2.4vw", color: "#F5EDD4", opacity: 0.8, marginTop: "0.8vh" }}>
                Recommendations engine · session playlists · educator mode
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
