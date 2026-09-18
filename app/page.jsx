"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Heart, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const heroSlides = [
  { src: "/images/flower-lift.png", alt: "A joyful cartoon couple with flowers" },
  { src: "/images/hearts-sitting.png", alt: "A happy cartoon couple surrounded by hearts" },
  { src: "/images/finger-heart.png", alt: "A couple sharing a tiny heart" },
  { src: "/images/hug.png", alt: "A joyful cartoon couple hugging" },
  { src: "/images/elegant-couple.png", alt: "An affectionate cartoon couple" }
];
const story = [
  { title: "Somewhere along the way…", text: "You quietly became a very important part of my life.", image: "/images/kiss.png", alt: "A sweet little moment together" },
  { title: "Then came the little moments…", text: "The random talks, teasing, smiles and tiny moments started meaning a lot more.", image: "/images/playful.png", alt: "A playful couple moment" },
  { title: "And then I realized…", text: "Maybe you were never just another person in my story.", image: "/images/lift.png", alt: "A couple sharing an affectionate moment" }
];
const reasons = [
  { title: "Your Smile", text: "Your smile has a way of making even an ordinary moment feel better.", image: "/images/girl-flowers.png", alt: "Girl smiling with flowers" },
  { title: "Your Presence", text: "Even doing nothing special, having you around feels different.", image: "/images/boy-roses.png", alt: "A boy offering roses" },
  { title: "Our Little Chaos", text: "The teasing, arguments, and silly moments… I would not trade them.", image: "/images/angry.png", alt: "A playful cartoon couple" },
  { title: "Just You", text: "I like having you in my life more than I can ever explain.", image: "/images/finger-heart.png", alt: "Two people sharing a heart" }
];

function Art({ src, alt, className = "" }) { return <div className={`art ${className}`}><Image src={src} alt={alt} fill sizes="(max-width: 700px) 90vw, 480px" priority={src === "/images/flower-lift.png"} /></div>; }
function Burst({ active }) { return <AnimatePresence>{active && <div className="burst" aria-hidden="true">{Array.from({ length: 9 }).map((_, i) => <Heart key={i} className="burst-heart" style={{ "--i": i }} fill="currentColor" />)}</div>}</AnimatePresence>; }
function Dots({ chapter, go }) { return <nav className="chapter-dots" aria-label="Story chapters">{[0, 1, 2, 3].map(index => <button key={index} onClick={() => go(index)} className={chapter === index ? "active" : ""} aria-current={chapter === index ? "step" : undefined} aria-label={`Go to chapter ${index + 1}`} />)}</nav>; }
function Deck({ items, current, setCurrent, kind }) {
  const previous = () => setCurrent(value => Math.max(value - 1, 0));
  const next = () => setCurrent(value => Math.min(value + 1, items.length - 1));
  return <div className="deck-shell"><button className="card-arrow card-arrow-left" aria-label={`Previous ${kind}`} onClick={previous} disabled={current === 0}><ArrowLeft size={18} /></button><div className="card-deck" aria-live="polite">{items.map((item, index) => <article className={`deck-card ${index === current ? "top" : ""} ${index < current ? "past" : ""}`} key={item.title} style={{ "--offset": index - current, "--order": index }} aria-hidden={index !== current}><Art src={item.image} alt={item.alt} /><div className="card-copy"><span>{kind} {index + 1} of {items.length}</span><h3>{item.title}</h3><p>{item.text}</p></div>{kind === "Reason" && <Heart className="corner-heart" size={16} fill="currentColor" />}</article>)}</div><button className="card-arrow card-arrow-right" aria-label={`Next ${kind}`} onClick={next} disabled={current === items.length - 1}><ArrowRight size={18} /></button></div>;
}

export default function Home() {
  const [chapter, setChapter] = useState(0), [slide, setSlide] = useState(0), [storyCard, setStoryCard] = useState(0), [reasonCard, setReasonCard] = useState(0), [yes, setYes] = useState(false), [burst, setBurst] = useState(false), [noText, setNoText] = useState("No"), [noPos, setNoPos] = useState(null);
  const noButtonRef = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => { if (reduced || chapter !== 0) return undefined; const timer = setInterval(() => setSlide(current => (current + 1) % heroSlides.length), 3600); return () => clearInterval(timer); }, [chapter, reduced]);
  const go = next => { setBurst(true); setTimeout(() => setBurst(false), 700); setChapter(next); };
  const moveNo = useCallback(() => {
    const button = noButtonRef.current?.getBoundingClientRect();
    if (!button) return;
    const edge = 16;
    const minimumY = 70;
    const maximumX = Math.max(edge, window.innerWidth - button.width - edge);
    const maximumY = Math.max(minimumY, window.innerHeight - button.height - edge);
    setNoPos({ x: Math.round(edge + Math.random() * (maximumX - edge)), y: Math.round(minimumY + Math.random() * (maximumY - minimumY)) });
    const choices = ["Are you sure?", "Really?", "Think again", "Wait…", "Try again!"];
    setNoText(choices[Math.floor(Math.random() * choices.length)]);
  }, []);
  const celebrate = () => { setYes(true); fetch("/api/proposal", { method: "POST" }).catch(() => undefined); };
  const transition = reduced ? { duration: 0 } : { duration: .52, ease: [0.22, 1, 0.36, 1] };
  return <main className="story-app"><Burst active={burst} /><Dots chapter={chapter} go={go} /><AnimatePresence mode="wait">
    {chapter === 0 && <motion.section className="screen hero" key="hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -22 }} transition={transition}>
      <div className="edge-hearts" aria-hidden="true"><Heart fill="currentColor" /><Sparkles /><Heart fill="currentColor" /></div>
      <div className="hero-copy"><p className="eyebrow">A little something for you</p><h1>Ruta, I made a <em>tiny world</em> for us.</h1><p className="lead">A few moments, a few reasons, and one question I&apos;ve been wanting to ask.</p><div className="hero-note"><Heart size={15} fill="currentColor" /><span>Made slowly, carefully, and with love by Harshil.</span></div><button className="primary" onClick={() => go(1)}>Start the story <ArrowRight size={17} /></button></div>
      <div className="hero-gallery"><div className="gallery-glow" /><AnimatePresence mode="wait">{heroSlides.map((item, index) => index === slide && <motion.div className="hero-slide" key={item.src} initial={{ opacity: 0, scale: .94, rotate: -2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 1.04, rotate: 2 }} transition={{ duration: .55 }}><Art {...item} /></motion.div>)}</AnimatePresence><div className="slide-controls" aria-label="Illustration gallery">{heroSlides.map((item, index) => <button key={item.src} className={slide === index ? "selected" : ""} onClick={() => setSlide(index)} aria-label={`Show image ${index + 1}`} aria-current={slide === index ? "true" : undefined} />)}</div><p className="gallery-caption">little snapshots of a story still being written</p></div>
    </motion.section>}
    {chapter === 1 && <motion.section className="screen chapter" key="story" initial={{ opacity: 0, x: 46 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -46 }} transition={transition}><header className="chapter-header"><p className="eyebrow">Chapter one · 01</p><h2>Maybe this started as <em>friendship…</em></h2><p>But the best stories often begin in the smallest ways.</p></header><Deck items={story} current={storyCard} setCurrent={setStoryCard} kind="Memory" /><div className="chapter-actions"><button className="back" onClick={() => go(0)}><ArrowLeft size={16} /> Chapter back</button><button className="primary" onClick={() => go(2)}>Next chapter <ArrowRight size={17} /></button></div></motion.section>}
    {chapter === 2 && <motion.section className="screen chapter chapter-two" key="reasons" initial={{ opacity: 0, x: 46 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -46 }} transition={transition}><header className="chapter-header"><p className="eyebrow">Chapter two · 02</p><h2>Why you, <em>Ruta?</em></h2><p>I could write a hundred reasons. Here are just four little ones.</p></header><Deck items={reasons} current={reasonCard} setCurrent={setReasonCard} kind="Reason" /><div className="chapter-actions"><button className="back" onClick={() => go(1)}><ArrowLeft size={16} /> Chapter back</button><button className="primary" onClick={() => go(3)}>Next chapter <ArrowRight size={17} /></button></div></motion.section>}
    {chapter === 3 && <motion.section className="screen proposal-screen" key="proposal" initial={{ opacity: 0, x: 46 }} animate={{ opacity: 1, x: 0 }} transition={transition}><AnimatePresence mode="wait">{yes ? <motion.div className="success" key="success" initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }}><div className="success-hearts" aria-hidden="true">{Array.from({ length: 14 }).map((_, i) => <Heart key={i} fill="currentColor" style={{ "--i": i }} />)}</div><p className="eyebrow">A new chapter</p><h2>Ruta said <em>YES!</em></h2><p className="couple-name">Harshil <Heart size={16} fill="currentColor" /> Ruta</p><p className="lead">And just like that…<br />our little story gets a new chapter.</p><Art src="/images/flower-lift.png" alt="A sweet cartoon couple" className="success-art" /><button className="text-button" onClick={() => { setYes(false); go(0); }}>Read it again <Heart size={15} fill="currentColor" /></button></motion.div> : <div className="proposal-wrap"><div className="proposal-copy"><p className="eyebrow">The question · 03</p><h2>Ruta…</h2><p className="lead">I&apos;ve been trying to find the perfect way to say this.</p><p className="message">You became my favorite person to talk to,<br />my favorite person to annoy,<br />and somehow…<br /><b>my favorite person to care about.</b></p><p className="small-copy">So I don&apos;t want to keep this as just a thought in my head.</p><h2 className="will">Will you be <em>mine?</em></h2><div className="answer-arena"><button className="primary yes" onClick={celebrate}>Yes, I will <Heart size={17} fill="currentColor" /></button><button ref={noButtonRef} className={`no ${noPos ? "floating" : ""}`} onMouseEnter={moveNo} onFocus={moveNo} onPointerDown={moveNo} onClick={moveNo} style={noPos ? { left: noPos.x, top: noPos.y } : undefined}>{noText}</button></div><button className="back proposal-back" onClick={() => go(2)}><ArrowLeft size={16} /> Back to the reasons</button></div><Art src="/images/wedding-lift.png" alt="A couple in a loving embrace" className="proposal-art" /></div>}</AnimatePresence></motion.section>}
  </AnimatePresence></main>;
}
