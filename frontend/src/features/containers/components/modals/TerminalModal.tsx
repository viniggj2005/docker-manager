import iziToast from 'izitoast';
import 'xterm/css/xterm.css';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import React, { useEffect, useRef, useState } from 'react';
import { useDockerClient } from '../../../../contexts/DockerClientContext';
import {
    containerExec,
    terminalWrite,
    terminalResize,
} from '../../services/ContainersService';
import { EventsOn, EventsOff } from '../../../../../wailsjs/runtime/runtime';

interface TerminalModalProps {
    id: string;
    name: string;
    setTerminalModal: (state: boolean) => void;
}

const TerminalModal: React.FC<TerminalModalProps> = ({ id, name, setTerminalModal }) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<Terminal | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);
    const { selectedCredentialId } = useDockerClient();
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (selectedCredentialId == null || !terminalRef.current) return;

        const term = new Terminal({
            cursorBlink: true,
            fontSize: 14,
            fontFamily: 'Consolas, "Courier New", monospace',
            theme: {
                background: '#1e1e1e',
                foreground: '#ffffff',
            },
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        fitAddon.fit();
        term.focus();

        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        term.onData((data) => {
            if (connected) {
                terminalWrite(id, data).catch((err) => console.error(err));
            }
        });

        EventsOn(`terminal:data:${id}`, (data: string) => {
            term.write(data);
        });

        EventsOn(`terminal:closed:${id}`, () => {
            term.writeln('\r\nConnection closed by remote host.');
            setConnected(false);
        });

        (async () => {
            try {
                await containerExec(selectedCredentialId, id);
                setConnected(true);
                term.clear();
                fitAddon.fit();
                term.focus();
            } catch (error: any) {
                term.writeln(`\r\nError connecting: ${error?.message || error}`);
                iziToast.error({ title: 'Erro', message: error?.message || String(error) });
            }
        })();

        const resizeObserver = new ResizeObserver(() => {
            fitAddon.fit();
        });
        resizeObserver.observe(terminalRef.current);

        return () => {
            EventsOff(`terminal:data:${id}`);
            EventsOff(`terminal:closed:${id}`);
            term.dispose();
            resizeObserver.disconnect();
        };
    }, [id, selectedCredentialId]);

    const closeOnBackdrop = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) setTerminalModal(false);
    };

    return (
        <div
            onClick={closeOnBackdrop}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--light-overlay)] dark:bg-[var(--dark-overlay)] backdrop-blur-sm"
            aria-modal
            role="dialog"
        >
            <div className="relative w-[min(90vw,1200px)] h-[min(80vh,800px)] rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)] shadow-2xl overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] bg-[var(--system-white)] dark:bg-[var(--dark-primary)]">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <h2 className="text-sm font-medium text-[var(--system-black)] dark:text-[var(--system-white)]">
                            Terminal: {name}
                        </h2>
                        <span className="text-xs text-[var(--grey-text)]">#{id.slice(0, 12)}</span>
                    </div>

                    <button
                        onClick={() => setTerminalModal(false)}
                        className="text-[var(--exit-red)] hover:scale-95 transition"
                    >
                        <IoMdCloseCircleOutline className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 bg-[#1e1e1e] p-2 relative">
                    <div ref={terminalRef} className="absolute inset-0" />
                </div>
            </div>
        </div>
    );
};

export default TerminalModal;
