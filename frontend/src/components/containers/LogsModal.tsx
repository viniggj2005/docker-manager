import { FiSearch, FiPause, FiPlay } from "react-icons/fi";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { ContainerLogs } from "../../../wailsjs/go/docker/Docker";
import React, { useEffect, useMemo, useRef, useState } from "react";
interface LogsProps {
    id: string;
    setLogsModal: (state: boolean) => void;
}

const METHOD_CLASS: Record<string, string> = {
    GET: "text-emerald-400",
    POST: "text-cyan-400",
    PUT: "text-amber-300",
    PATCH: "text-yellow-300",
    DELETE: "text-rose-400",
    HEAD: "text-purple-300",
    OPTIONS: "text-teal-300",
};


const LogsModal: React.FC<LogsProps> = ({ id, setLogsModal }) => {
    const [logs, setLogs] = useState<string>("");
    //   const [follow, setFollow] = useState<boolean>(true);
    const [filter, setFilter] = useState<string>("");
    const firstScrollDone = useRef(false);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const resp = await ContainerLogs(id);
                if (!cancelled) setLogs(resp ?? "");
            } catch (e: any) {
                if (!cancelled) setLogs(`ERROR: ${e?.message ?? String(e)}`);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [id]);

    //   useEffect(() => {
    //     if (!follow) return;
    //     const el = scrollRef.current;
    //     if (el) el.scrollTop = el.scrollHeight;
    //   }, [logs, follow]);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el || firstScrollDone.current) return;
        if (logs) {
            el.scrollTop = el.scrollHeight;
            firstScrollDone.current = true;
        }
    }, [logs]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setLogsModal(false);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [setLogsModal]);

    const displayRaw = useMemo(() => {
        if (!filter.trim()) return logs;
        const q = filter.toLowerCase();
        return logs
            .split("\n")
            .filter((line) => line.toLowerCase().includes(q))
            .join("\n");
    }, [logs, filter]);

    const display = useMemo(() => displayRaw, [displayRaw]);

    const reTs =
        /(\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?)|(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\s+\d{1,2}:\d{2}:\d{2}(?:\s?[AP]M)?)/g;
    const reIP = /\b\d{1,3}(?:\.\d{1,3}){3}\b/g;
    const reMethod = /\b(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b/g;
    const reStatus = /\b(\d{3})\b/g;

    type Seg = { text: string; className?: string };

    const applyRule = (
        segs: Seg[],
        regex: RegExp,
        classFor: (m: RegExpMatchArray) => string | undefined
    ) => {
        const out: Seg[] = [];
        for (const seg of segs) {
            if (seg.className) {
                out.push(seg);
                continue;
            }
            let last = 0;
            for (const m of seg.text.matchAll(regex)) {
                const start = m.index ?? 0;
                const end = start + m[0].length;
                if (start > last) out.push({ text: seg.text.slice(last, start) });
                out.push({ text: m[0], className: classFor(m) });
                last = end;
            }
            if (last < seg.text.length) out.push({ text: seg.text.slice(last) });
        }
        return out;
    };

    const highlightLine = (line: string, i: number) => {
        let segs: Seg[] = [{ text: line }];
        segs = applyRule(segs, reTs, () => "text-sky-400");
        segs = applyRule(segs, reIP, () => "text-emerald-300");
        segs = applyRule(segs, reMethod, (m) => METHOD_CLASS[m[1]] ?? "text-zinc-100");
        segs = applyRule(segs, reStatus, (m) => {
            const code = Number(m[1]);
            if (code >= 500) return "text-red-500 font-semibold";
            if (code >= 400) return "text-rose-400 font-semibold";
            if (code >= 300) return "text-amber-300";
            if (code >= 200) return "text-emerald-400";
            return undefined;
        });
        return (
            <div key={i} className="leading-relaxed">
                {segs.map((s, idx) => (
                    <span key={idx} className={s.className}>
                        {s.text}
                    </span>
                ))}
            </div>
        );
    };

    const closeOnBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) setLogsModal(false);
    };

    return (
        <div
            onClick={closeOnBackdrop}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            aria-modal
            role="dialog"
        >
            <div className="relative w-[min(90vw,900px)] h-[min(80vh,650px)] rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl text-zinc-100">
                <div className="sticky top-0 z-10 flex items-center rounded-t-2xl gap-3 border-b border-white/10 px-5 py-3 bg-zinc-900/90">
                    <div className="flex items-center gap-2">
                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                        <h2 className="text-sm font-medium">Logs do contêiner</h2>
                        <span className="text-xs text-zinc-400">#{id.slice(0, 12)}</span>
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        <div className="relative">
                            <FiSearch className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs opacity-70" />
                            <input
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                placeholder="Filtrar"
                                className="pl-7 pr-3 py-1.5 text-sm bg-zinc-800/70 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                            />
                        </div>
                        {/* <button
onClick={() => setFollow((f) => !f)}
className="rounded-lg border border-white/10 bg-zinc-800/70 px-2.5 py-1.5 text-sm hover:bg-zinc-800"
title={follow ? "Pausar rolagem" : "Seguir rolagem"}
>
{follow ? <FiPause /> : <FiPlay />}
</button> */}
                        <button
                            onClick={() => setLogsModal(false)}
                            className="ml-1 text-rose-400 hover:text-rose-300"
                            title="Fechar"
                        >
                            <IoMdCloseCircleOutline className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <div ref={scrollRef} className="h-[calc(100%-52px)] overflow-y-auto px-5 py-4 font-mono text-xs">
                    {display
                        ? display.split("\n").map((line, i) => highlightLine(line, i))
                        : <div className="text-zinc-400">Sem logs.</div>}
                </div>
            </div>
        </div>
    );
};

export default LogsModal;
