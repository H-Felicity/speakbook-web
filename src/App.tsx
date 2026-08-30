import { useEffect, useRef, useState } from "react";

type LessonSentence = {
  id: string;
  startTime: string;
  endTime: string;
  english: string;
  chinese: string;
};

const sentences: LessonSentence[] = [
  { id: "01", startTime: "00:17", endTime: "00:21", english: "I've just arrived in London", chinese: "我刚刚到伦敦" },
  { id: "02", startTime: "00:21", endTime: "00:27", english: "and I'm so excited to explore", chinese: "我非常兴奋要来探索这座城市" },
  { id: "03", startTime: "00:27", endTime: "00:33", english: "the weather is actually much nicer than I expected", chinese: "天气其实比我想象的要好" },
  { id: "04", startTime: "00:33", endTime: "00:38", english: "so I'm starting my day with a coffee", chinese: "所以我开始一天的行程，先喝一杯咖啡" },
  { id: "05", startTime: "00:38", endTime: "00:44", english: "this city always inspires me", chinese: "这座城市总是能给我灵感" },
  { id: "06", startTime: "00:44", endTime: "00:51", english: "there's just so much to see and do", chinese: "有太多值得看和做的事情" },
  { id: "07", startTime: "00:51", endTime: "00:57", english: "let's take a walk through the neighborhood", chinese: "让我们在这个街区走走" },
  { id: "08", startTime: "00:57", endTime: "01:03", english: "I love the little cafés around here", chinese: "我喜欢这里周围的小咖啡馆" },
  { id: "09", startTime: "01:03", endTime: "01:09", english: "everyone seems to be enjoying the sunshine", chinese: "每个人似乎都在享受阳光" },
  { id: "10", startTime: "01:09", endTime: "01:15", english: "I'm going to meet a friend for lunch", chinese: "我要去和一位朋友吃午餐" },
  { id: "11", startTime: "01:15", endTime: "01:21", english: "we found a lovely table by the window", chinese: "我们找到了一张靠窗的好桌子" },
  { id: "12", startTime: "01:21", endTime: "01:27", english: "the view over the street is beautiful", chinese: "街景非常美丽" },
  { id: "13", startTime: "01:27", endTime: "01:33", english: "after lunch I'm heading to the park", chinese: "午餐后我要去公园" },
  { id: "14", startTime: "01:33", endTime: "01:39", english: "it's the perfect place for a slow walk", chinese: "这里是悠闲散步的完美地点" },
  { id: "15", startTime: "01:39", endTime: "01:45", english: "the trees are starting to turn golden", chinese: "树叶开始变成金黄色" },
  { id: "16", startTime: "01:45", endTime: "01:51", english: "London feels different in every season", chinese: "伦敦在每个季节都有不同的感觉" },
  { id: "17", startTime: "01:51", endTime: "01:57", english: "I always discover something new here", chinese: "我在这里总能发现新东西" },
  { id: "18", startTime: "01:57", endTime: "02:03", english: "there's a small market around the corner", chinese: "拐角处有一个小市场" },
  { id: "19", startTime: "02:03", endTime: "02:09", english: "the flowers look so colorful today", chinese: "今天的花看起来色彩缤纷" },
  { id: "20", startTime: "02:09", endTime: "02:15", english: "I'm picking up something for dinner", chinese: "我要买些晚餐的食材" },
  { id: "21", startTime: "02:15", endTime: "02:21", english: "then I'll head home before it gets dark", chinese: "然后我会在天黑前回家" },
  { id: "22", startTime: "02:21", endTime: "02:27", english: "it's been such a lovely day", chinese: "今天真是美好的一天" },
  { id: "23", startTime: "02:27", endTime: "02:45", english: "I hope you enjoyed coming along with me", chinese: "希望你喜欢和我一起逛逛" },
  { id: "24", startTime: "02:45", endTime: "03:02", english: "I'll see you again very soon", chinese: "很快再见" },
];

function Icon({ name, className = "" }: { name: string; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    back: <path d="M19 12H5m6-6-6 6 6 6" />,
    play: <path d="m8 5 11 7-11 7V5Z" fill="currentColor" stroke="none" />,
    volume: <><path d="M5 10v4h3l4 4V6L8 10H5Z" /><path d="M16 9.5a4 4 0 0 1 0 5m2.7-7.4a7 7 0 0 1 0 9.8" /></>,
    expand: <><path d="M8 3H3v5m13-5h5v5M8 21H3v-5m13 5h5v-5" /></>,
    loop: <><path d="M17 2.8 20.2 6 17 9.2" /><path d="M20 6h-9a5 5 0 0 0-4.8 6.4M7 21.2 3.8 18 7 14.8" /><path d="M4 18h9a5 5 0 0 0 4.8-6.4" /></>,
    bookmark: <path d="M6 3h12v18l-6-3.5L6 21V3Z" />,
    sliders: <><path d="M4 6h16M4 18h16" /><path d="M9 3v6m6 6v6" /></>,
    more: <path d="M5 12h.01M12 12h.01M19 12h.01" strokeWidth="3" strokeLinecap="round" />,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export default function App() {
  const [currentMode, setCurrentMode] = useState("Watch");
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(2);
  const [playing, setPlaying] = useState(false);
  const [looping, setLooping] = useState(false);
  const [saved, setSaved] = useState(false);
  const [wordOpen, setWordOpen] = useState(false);
  const [expressionSaved, setExpressionSaved] = useState(false);
  const [clipPlaying, setClipPlaying] = useState(false);
  const [shadowState, setShadowState] = useState<"ready" | "recording" | "compare">("ready");
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [difficult, setDifficult] = useState(false);
  const [abPlayback, setAbPlayback] = useState<"idle" | "original" | "you">("idle");
  const wordPopoverRef = useRef<HTMLDivElement>(null);
  const transcriptListRef = useRef<HTMLDivElement>(null);
  const currentSentence = sentences[currentSentenceIndex];

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (wordPopoverRef.current && !wordPopoverRef.current.contains(event.target as Node)) setWordOpen(false);
    };
    if (wordOpen) document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [wordOpen]);

  useEffect(() => {
    if (currentMode !== "Watch") return;
    const list = transcriptListRef.current;
    const activeSentence = list?.querySelector<HTMLElement>("[data-active='true']");
    if (!list || !activeSentence) return;

    const targetTop = activeSentence.offsetTop - list.clientHeight / 2 + activeSentence.offsetHeight / 2;
    list.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
  }, [currentMode, currentSentenceIndex]);

  useEffect(() => {
    if (shadowState !== "recording") return;
    const timer = window.setInterval(() => setRecordSeconds((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(timer);
  }, [shadowState]);

  const openShadowPractice = () => {
    setWordOpen(false);
    setCurrentMode("Shadow");
  };

  const startRecording = () => {
    setClipPlaying(false);
    setRecordSeconds(0);
    setShadowState("recording");
  };

  const stopRecording = () => setShadowState("compare");
  const startAbCompare = () => {
    setAbPlayback("original");
    window.setTimeout(() => setAbPlayback("you"), 300);
    window.setTimeout(() => setAbPlayback("idle"), 1800);
  };
  const tryAgain = () => {
    setRecordSeconds(0);
    setShadowState("ready");
  };
  const nextSentence = () => {
    setCurrentSentenceIndex(Math.min(sentences.length - 1, currentSentenceIndex + 1));
    setRecordSeconds(0);
    setShadowState("ready");
  };
  const isRecording = shadowState === "recording";
  const recordingTime = `00:${String(recordSeconds).padStart(2, "0")}`;

  return (
    <main className="min-h-full bg-background p-5 text-foreground md:p-10">
      <div className="mx-auto max-w-[1376px]">
        <p className="mb-4 text-[14px] text-muted-foreground">{currentMode === "Shadow" ? "03 Shadow Ready" : "01 Watch Default"}</p>
        <section className="overflow-hidden rounded-[12px] border border-border bg-card">
          <header className="relative flex h-16 items-center border-b border-border px-6">
            <button className="nav-back" aria-label="Go back"><Icon name="back" className="size-4" /> Back</button>
            <h1 className="absolute left-1/2 -translate-x-1/2 text-[15px] font-semibold tracking-[-0.02em]">A Day in My Life in London</h1>
            <nav className="ml-auto mr-14 flex h-full gap-7" aria-label="Lesson sections">
              {["Watch", "Shadow", "Expressions"].map((tab) => <button key={tab} disabled={isRecording} onClick={() => { setWordOpen(false); setCurrentMode(tab); }} className={`tab ${currentMode === tab ? "tab-active" : ""}`}>{tab}</button>)}
            </nav>
            <button className="absolute right-5 text-muted-foreground" aria-label="More options"><Icon name="more" className="size-5" /></button>
          </header>

          {currentMode === "Shadow" ? (
            <section className="shadow-workspace">
              <div className="shadow-progress"><span style={{ width: `${((currentSentenceIndex + 1) / sentences.length) * 100}%` }} /></div>
              <div className="shadow-content">
                <div className="shadow-video relative aspect-video overflow-hidden rounded-[10px] bg-[#1a1a1b]">
                  <img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=90" alt="Woman walking on a London street with a red bus passing behind her" className="size-full object-cover object-center" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_52%,rgba(0,0,0,.7)_100%)]" />
                  <div className="absolute inset-x-4 bottom-3 text-white">
                    <div className="mb-2 h-0.5 rounded-full bg-white/35"><div className="h-full w-full rounded-full bg-[#5965F2]" /></div>
                    <div className="flex items-center justify-between text-[12px]"><span>{currentSentence.startTime} – {currentSentence.endTime}</span><span>Sentence clip</span></div>
                  </div>
                </div>
                <div className="mt-7 text-center">
                  <p className="text-[13px] font-medium text-secondary-foreground">Sentence {currentSentenceIndex + 1} / {sentences.length}</p>
                  <p className="mx-auto mt-2 max-w-[650px] text-[28px] font-medium leading-[1.24] tracking-[-0.035em] md:text-[32px]">{currentSentence.english}</p>
                  <p className="mt-3 text-[15px] text-muted-foreground">{currentSentence.chinese}</p>
                </div>
                <div className="mt-7 flex flex-col items-center">
                  {isRecording ? (
                    <div className="recording-panel" aria-live="polite">
                      <div className="recording-status"><span className="recording-indicator" />Recording</div>
                      <div className="recording-wave" aria-hidden="true">{[17, 28, 42, 24, 36, 56, 32, 46, 25, 61, 38, 50, 29, 44, 58, 34, 48, 22, 40, 55, 31, 45, 26, 52, 37, 59, 33, 47, 25, 41, 54, 30].map((height, index) => <span key={index} style={{ height: `${height}%`, animationDelay: `${index * 45}ms` }} />)}</div>
                      <div className="recording-time">{recordingTime}</div>
                      <button onClick={stopRecording} className="stop-button"><span />Stop</button>
                    </div>
                  ) : shadowState === "compare" ? (
                    <div className="compare-panel">
                      <div className="audio-rows">
                        <div className={`audio-row ${abPlayback === "original" ? "audio-row-playing" : ""}`}><span className="audio-label">Original</span><button className="audio-play" onClick={() => setAbPlayback("original")}><Icon name="play" className="size-4" /></button><span className="audio-wave audio-wave-original">{[18, 30, 52, 24, 64, 38, 78, 44, 30, 58, 75, 35, 52, 29, 69, 43, 60, 32, 51, 72, 39, 61, 28, 46, 67, 36, 54, 31, 49, 64, 38, 55, 27, 44].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</span><span className="audio-duration">3.8s</span></div>
                        <div className={`audio-row ${abPlayback === "you" ? "audio-row-playing" : ""}`}><span className="audio-label">You</span><button className="audio-play" onClick={() => setAbPlayback("you")}><Icon name="play" className="size-4" /></button><span className="audio-wave audio-wave-user">{[20, 36, 44, 29, 57, 33, 70, 42, 26, 51, 62, 31, 48, 25, 60, 39, 53, 28, 46, 66, 34, 58, 24, 42, 61, 32, 50, 28, 43, 59, 31, 48, 22, 39].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</span><span className="audio-duration">4.2s</span></div>
                      </div>
                      <div className="compare-actions">
                        <button onClick={startAbCompare} className="ab-button">⚯&nbsp; {abPlayback === "original" ? "Playing Original" : abPlayback === "you" ? "Playing You" : "A/B Compare"}</button>
                        <button onClick={() => setDifficult(!difficult)} className="ghost-control">{difficult ? "★" : "☆"}&nbsp; Difficult</button>
                        <div className="compare-primary-actions"><button onClick={tryAgain} className="try-again-button">Try Again</button><button onClick={nextSentence} className="compare-next-button">Next&nbsp; →</button></div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button onClick={() => setClipPlaying(!clipPlaying)} className="listen-button" aria-pressed={clipPlaying}><Icon name="play" className="size-4" />{clipPlaying ? "Playing" : "Listen"}</button>
                      <button onClick={startRecording} className="record-button"><span className="record-dot" />Record</button>
                      <div className="mt-4 flex items-center gap-2">
                        <button onClick={() => setLooping(!looping)} className={`ghost-control ${looping ? "ghost-control-selected" : ""}`}>↺&nbsp; Loop</button>
                        <button className="ghost-control">1.0×</button>
                        <button className="ghost-control">☆&nbsp; Difficult</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <footer className="shadow-footer">
                <button disabled={isRecording} onClick={() => setCurrentSentenceIndex(Math.max(0, currentSentenceIndex - 1))} className="lesson-nav lesson-nav-previous">←&nbsp; Previous</button>
                <span className="auto-next">Auto Next <button aria-label="Toggle auto next" className="auto-next-toggle"><span /></button></span>
                {shadowState === "compare" ? <span /> : <button disabled={isRecording} onClick={() => setCurrentSentenceIndex(Math.min(sentences.length - 1, currentSentenceIndex + 1))} className="lesson-nav">Next&nbsp; →</button>}
              </footer>
            </section>
          ) : (
          <div className="grid min-h-[790px] grid-cols-1 lg:h-[790px] lg:grid-cols-[62%_38%]">
            <section className="border-b border-border p-6 lg:border-b-0 lg:border-r lg:p-7">
              <div className="video-frame group relative aspect-video overflow-hidden rounded-[10px] bg-[#1a1a1b]">
                <img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=90" alt="Woman walking on a London street with a red bus passing behind her" className="size-full object-cover object-center" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_58%,rgba(0,0,0,.7)_100%)]" />
                <div className="absolute inset-x-4 bottom-4 text-white">
                  <div className="mb-3 h-0.5 rounded-full bg-white/35"><div className="h-full w-[48%] rounded-full bg-[#5965F2]" /></div>
                  <div className="flex items-center gap-3 text-[13px] font-medium">
                    <button onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause" : "Play"}><Icon name="play" className="size-5" /></button>
                    <Icon name="volume" className="size-4" />
                    <span>{currentSentence.startTime} / 3:02</span>
                    <div className="ml-auto flex items-center gap-4"><span>1.0×</span><span className="rounded bg-white px-1 text-[11px] font-bold text-[#18181A]">CC</span><Icon name="expand" className="size-5" /><Icon name="expand" className="size-5" /></div>
                  </div>
                </div>
              </div>

              <article className="mt-6 rounded-[12px] border border-border bg-card px-5 py-4 md:px-6 md:py-5">
                <p className="text-[13px] font-medium text-secondary-foreground">Sentence {currentSentenceIndex + 1} / {sentences.length}</p>
                <div className="py-5 text-center md:py-6">
                  <div ref={wordPopoverRef} className="sentence-line">
                    <p className="mx-auto max-w-[570px] text-[24px] font-semibold leading-[1.25] tracking-[-0.035em] md:text-[29px]">
                    {currentSentence.english.split(" ").map((word, index) => word === "weather" ? (
                      <span key={`${word}-${index}`} className="word-anchor">
                        <button type="button" onClick={() => setWordOpen(!wordOpen)} className="word-trigger" aria-expanded={wordOpen}>weather</button>{" "}
                      </span>
                    ) : <span key={`${word}-${index}`} className={index === 1 ? "text-primary" : ""}>{word}{" "}</span>)}
                    </p>
                    {wordOpen && <section className="word-popover" role="dialog" aria-label="Weather expression details">
                          <div className="flex items-start gap-2">
                            <span className="mt-0.5 flex size-5 items-center justify-center rounded-full bg-[#eef0ff] text-[12px] text-primary">◖</span>
                            <div><h3>weather</h3><p className="pronunciation">/ˈweðər/</p></div>
                          </div>
                          <div className="word-definition"><p className="popover-label">noun</p><p>天气；气象</p></div>
                          <div className="word-section"><p className="popover-label">In this sentence</p><p>这里指“天气状况”</p></div>
                          <div className="word-section"><p className="popover-label">Useful expression</p><p className="font-medium text-foreground">in any weather</p><p>不论天气如何</p></div>
                          <div className="word-section"><p className="popover-label">Original sentence</p><p className="sentence-quote">the weather is actually much nicer than I expected</p></div>
                          <button type="button" onClick={() => setExpressionSaved(!expressionSaved)} className={`expression-button ${expressionSaved ? "expression-saved" : ""}`}>{expressionSaved ? "✓ Saved" : "+  Save Expression"}</button>
                    </section>}
                  </div>
                  <p className="mt-3 text-[15px] text-muted-foreground">{currentSentence.chinese}</p>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div className="flex gap-2">
                    <button onClick={() => setLooping(!looping)} className={`action-button ${looping ? "action-selected" : ""}`}><Icon name="loop" className="size-4" />Loop</button>
                    <button onClick={() => setSaved(!saved)} className={`action-button ${saved ? "action-selected" : ""}`}><Icon name="bookmark" className="size-4" />{saved ? "Saved" : "Save"}</button>
                  </div>
                  <button onClick={openShadowPractice} className="practice-button">Practice This Sentence</button>
                </div>
              </article>
            </section>

            <aside className="flex min-h-0 flex-col bg-[#fdfdfc] p-6 lg:h-full lg:p-7">
              <div className="mb-4 flex items-center justify-between"><h2 className="text-[15px] font-semibold">Transcript</h2><div className="flex gap-4"><button aria-label="Filter transcript"><Icon name="sliders" className="size-4" /></button><button aria-label="Transcript options"><Icon name="sliders" className="size-4" /></button></div></div>
              <div ref={transcriptListRef} className="transcript-scroll min-h-0 flex-1 overflow-y-auto rounded-[10px] border border-border bg-card">
                {sentences.map((item, index) => <button key={item.id} data-active={currentSentenceIndex === index} onClick={() => { setWordOpen(false); setCurrentSentenceIndex(index); }} className={`transcript-line ${currentSentenceIndex === index ? "transcript-active" : ""}`}>
                  <span className="timestamp">{item.startTime}</span><span className="line-copy"><span className="block text-[14px] font-medium leading-5">{item.english}</span><span className="mt-1 block text-[13px] leading-5 text-muted-foreground">{item.chinese}</span></span>
                </button>)}
              </div>
            </aside>
          </div>
          )}
        </section>
      </div>
    </main>
  );
}
