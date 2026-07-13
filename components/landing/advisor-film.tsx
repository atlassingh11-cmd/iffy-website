"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Pause, Play } from "@phosphor-icons/react";

export function AdvisorFilm() {
  const [activated, setActivated] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [pending, setPending] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState(
    "The film loads only after you choose Play.",
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const pendingRef = useRef(false);
  const playbackErrorRef = useRef(false);

  async function activate() {
    const video = videoRef.current;
    if (!video || pendingRef.current) return;

    pendingRef.current = true;
    playbackErrorRef.current = false;
    setPending(true);

    try {
      if (!activated) {
        setActivated(true);
        setPlaybackStatus("Loading the Meet Iffy film.");
        video.src = "/media/iffy-film.mp4";
      }

      if (video.paused) {
        await video.play();
      } else {
        video.pause();
        setPlaying(false);
        setPlaybackStatus("The film is paused.");
      }
    } catch {
      playbackErrorRef.current = true;
      setPlaying(false);
      setPlaybackStatus(
        "The film could not play. Try again, or read the transcript below.",
      );
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  }

  return (
    <div className="w-full max-w-[28rem]">
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[1.15rem] bg-[#0a1514] shadow-[0_32px_90px_rgba(14,39,35,0.2)]">
        {!activated ? (
          <Image
            src="/media/iffy-film-poster.webp"
            alt="Iffy Khan speaking with a client on the phone"
            fill
            sizes="(min-width: 1024px) 34vw, 86vw"
            className="object-cover"
          />
        ) : null}
        <video
          ref={videoRef}
          className={`h-full w-full object-cover transition-opacity duration-300 ${activated ? "opacity-100" : "opacity-0"}`}
          preload="none"
          poster="/media/iffy-film-poster.webp"
          playsInline
          controls={activated}
          onError={() => {
            playbackErrorRef.current = true;
            setPlaying(false);
            setPlaybackStatus(
              "The film could not load. Try again, or read the transcript below.",
            );
          }}
          onPlay={() => {
            playbackErrorRef.current = false;
            setPlaying(true);
            setPlaybackStatus(
              "The film is playing. Native playback controls are available.",
            );
          }}
          onPause={() => {
            setPlaying(false);
            const video = videoRef.current;
            if (
              playbackErrorRef.current ||
              video?.error ||
              (activated && video?.readyState === HTMLMediaElement.HAVE_NOTHING)
            ) {
              playbackErrorRef.current = true;
              setPlaybackStatus(
                "The film could not load. Try again, or read the transcript below.",
              );
            } else if (!pendingRef.current) {
              setPlaybackStatus("The film is paused.");
            }
          }}
          onEnded={() => {
            setPlaying(false);
            setPlaybackStatus("The film has ended.");
          }}
        >
          <track
            default
            kind="captions"
            src="/media/iffy-film.vtt"
            srcLang="en"
            label="English"
          />
        </video>
        {!activated ? (
          <button
            type="button"
            onClick={activate}
            disabled={pending}
            className="absolute inset-0 flex min-h-11 min-w-11 items-end justify-start bg-[linear-gradient(180deg,transparent_45%,rgba(5,13,12,0.78))] p-5 text-left text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-white sm:p-7"
            aria-label="Play the Meet Iffy film"
          >
            <span className="flex items-center gap-3 text-base font-semibold">
              <span className="grid size-12 place-items-center rounded-full bg-white text-[#0a1514] shadow-lg">
                <Play aria-hidden="true" size={19} weight="fill" />
              </span>
              {pending ? "Loading film…" : "Meet Iffy. 94 seconds."}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={activate}
            disabled={pending}
            aria-label={pending ? "Film loading" : playing ? "Pause film" : "Play film"}
            className="absolute right-3 top-3 grid size-11 place-items-center rounded-full bg-[#0a1514]/80 text-white backdrop-blur-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-wait disabled:opacity-65"
          >
            {playing ? (
              <Pause aria-hidden="true" size={18} weight="fill" />
            ) : (
              <Play aria-hidden="true" size={18} weight="fill" />
            )}
          </button>
        )}
      </div>
      <p aria-live="polite" className="mt-3 text-sm text-[var(--muted)]">
        {playbackStatus}
      </p>
      <details className="mt-5 text-sm leading-relaxed text-[var(--muted)]">
        <summary className="min-h-11 cursor-pointer py-3 font-semibold text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-strong)]">
          Read what the film covers
        </summary>
        <div className="mt-3 space-y-4">
          <p>
            Iffy introduces himself as a Manchester native who began in retail banking. After six years investing in UK property, he decided to advise others in a market and city he enjoyed.
          </p>
          <p>
            He talks about Dubai&apos;s ambition, the importance of working with a strong team and his focus on off-plan property.
          </p>
          <p>
            A recent deal began as a coffee chat with clients who only wanted information. Clear answers gave them the confidence to proceed.
          </p>
          <p>
            Iffy also describes joining Kamani as a full-circle family moment, then explains the hunger, work ethic and standards he brings to the role.
          </p>
        </div>
      </details>
    </div>
  );
}
