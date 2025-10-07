import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { ContainerLogs } from "../../../wailsjs/go/docker/Docker";
import React, { useEffect, useRef, useState } from "react";

interface LogsProps {
  id: string;
  setLogsModal: (state: boolean) => void;
}

const LogsModal: React.FC<LogsProps> = ({ id, setLogsModal }) => {
  const [logs, setLogs] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const firstScrollDone = useRef(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const resp = await ContainerLogs(id);
        iziToast.success({
          message: "Logs buscados com sucesso!",
          position: "bottomRight",
        });
        setLogs(resp ?? "");
      } catch (e: any) {
        iziToast.error({
          title: "Erro",
          message: e?.message ?? String(e),
          position: "bottomRight",
        });
      }
    })();
  }, [id]);

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

 const display = filter
  ? logs
      .split(/<br\s*\/?>/)
      .filter((line) =>
        line.toLowerCase().includes(filter.toLowerCase())
      )
      .join("<br>")
  : logs;


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
            <button
              onClick={() => setLogsModal(false)}
              className="ml-1 text-rose-400 hover:text-rose-300"
              title="Fechar"
            >
              <IoMdCloseCircleOutline className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="h-[calc(100%-52px)] overflow-y-auto px-5 py-4 font-mono text-xs"
          dangerouslySetInnerHTML={{ __html: display }}
        />
      </div>
    </div>
  );
};

export default LogsModal;
