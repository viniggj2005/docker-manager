import { useEffect, useMemo, useRef, useState } from "react";
import { ContainersList,ContainerLogs } from "../../wailsjs/go/docker/Docker";
import { CiPlay1 } from "react-icons/ci";
type Port = {
  IP?: string;
  PrivatePort: number;
  PublicPort?: number;
  Type: string; 
};

type NetworkSettings = {
  Networks?: Record<string, { IPAddress?: string }>;
};

type ContainerItem = {
  Id: string;
  Image: string;
  ImageID?: string;
  Names: string[]; 
  Command?: string;
  Created?: number; 
  State: string; 
  Status?: string; 
  Ports?: Port[];
  NetworkSettings?: NetworkSettings;
  Labels?: Record<string, string>;
};

function classState(state: string) {
  const s = state?.toLowerCase();
  if (s === "running") return "bg-emerald-100 text-emerald-700";
  if (s === "exited") return "bg-rose-100 text-rose-700";
  if (s === "paused") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

function fmtAgo(created?: number) {
  if (!created) return "-";
  const ms = Date.now() - created * 1000;
  const sec = Math.max(1, Math.floor(ms / 1000));
  const units: [number, string][] = [
    [60, "s"],
    [60, "min"],
    [24, "h"],
    [7, "d"],
    [4.345, "sem"],
    [12, "m"],
  ];
  let v = sec;
  let label = "s";
  for (let i = 0; i < units.length; i++) {
    const [k, l] = units[i];
    if (v < k) {
      label = l;
      break;
    }
    v = Math.floor(v / k);
    label = l;
  }
  return `${v} ${label} atrás`;
}

function fmtPorts(ports?: Port[]) {
  if (!ports || ports.length === 0) return "—";
  return ports
    .map((p) => {
      const pub = p.PublicPort ? `${p.PublicPort}` : "";
      const priv = `${p.PrivatePort}`;
      const arrow = pub ? "→" : "";
      return `${pub}${arrow}${priv}/${p.Type}`;
    })
    .join(", ");
}

function fmtName(names: string[]) {
  if (!names || names.length === 0) return "—";
  return names[0].startsWith("/") ? names[0].slice(1) : names[0];
}

const ContainersListView=()=> {
  const [items, setItems] = useState<ContainerItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const fetchData = async () => {
    try {
      const resp = await ContainersList(); 
      setItems(resp || []);
      setError(null);
    } catch (e: any) {
      setError(e?.message || "Falha ao listar containers");
    }
  };
  const fetchLogs=async(id:string)=>{
    console.log("entrei no fetch logs")
    try{
      const resp= await ContainerLogs(id)
      console.log("Response:",resp)
    }catch (e:any){
      console.log("ERROR:",e)

    }
  }

  useEffect(() => {
    fetchData();
    timerRef.current = window.setInterval(fetchData, 2000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const skeleton = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-4 w-56 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 h-8 w-full animate-pulse rounded bg-slate-200" />
        </div>
      )),
    []
  );

  return (
    <div className="w-full h-full bg-transparent">
      <div className="mx-auto max-w-7xl p-6">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900">
            Containers
          </h1>
          <button
            onClick={fetchData}
            className="rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
          >
            Atualizar
          </button>
        </header>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!items ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skeleton}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
            Nenhum container encontrado.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((c) => {
              return(
              <div
                key={c.Id}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-medium text-slate-900">
                      {fmtName(c.Names)}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      {c.Image}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${classState(
                      c.State
                    )}`}
                    title={c.Status || c.State}
                  >
                    {c.State}
                  </span>
                  <button
            onClick={()=>fetchLogs(c.Id)}
            className="rounded-2xl border border-red-500 bg-white px-3 py-1.5 text-sm text-red-500 hover:bg-red-500 hover:text-white"
          >
            logs
          </button>
              <button
            onClick={()=>fetchLogs(c.Id)}
            className="rounded-2xl border border-red-500 bg-white px-3 py-1.5 text-sm text-red-500 hover:bg-red-500 hover:text-white"
          >
           <CiPlay1 />
          </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="text-[11px] uppercase text-slate-500">
                      Criado
                    </div>
                    <div className="mt-0.5 font-medium text-slate-800">
                      {fmtAgo(c.Created)}
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="text-[11px] uppercase text-slate-500">
                      Status
                    </div>
                    <div className="mt-0.5 font-medium text-slate-800">
                      {c.Status || "—"}
                    </div>
                  </div>
                  <div className="col-span-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="text-[11px] uppercase text-slate-500">
                      Portas
                    </div>
                    <div className="mt-0.5 font-mono text-xs text-slate-800">
                      {fmtPorts(c.Ports)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    {c.Id.slice(0, 12)}
                  </div>
                  <div className="opacity-0 transition group-hover:opacity-100">
                    <button
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100"
                      onClick={() => navigator.clipboard.writeText(c.Id)}
                    >
                      Copiar ID
                    </button>
                  </div>
                </div>
              </div>)
})}
          </div>
        )}

        <footer className="mt-6 text-xs text-slate-500">
          Atualiza a cada 2s. Clique em “Atualizar” para forçar agora.
        </footer>
      </div>
    </div>
  );
}


export default ContainersListView
