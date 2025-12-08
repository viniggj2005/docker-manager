import 'xterm/css/xterm.css';
import iziToast from 'izitoast';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import React, { useEffect, useRef } from 'react';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { useDockerClient } from '../../../../contexts/DockerClientContext';
import { EventsOn, EventsOff } from '../../../../../wailsjs/runtime/runtime';
import {
    containerExec,
    terminalWrite,
} from '../../services/ContainersService';

interface TerminalModalProps {
    id: string;
    name: string;
    setTerminalModal: (state: boolean) => void;
}

const TerminalModal: React.FC<TerminalModalProps> = ({ id, name, setTerminalModal }) => {
    const connectedRef = useRef(false);
    const xtermRef = useRef<Terminal | null>(null);
    const terminalRef = useRef<HTMLDivElement>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);
    const { selectedCredentialId } = useDockerClient();

    useEffect(() => {
        if (selectedCredentialId == null || !terminalRef.current) return;

        const terminal = new Terminal({
            cursorBlink: true,
            fontSize: 14,
            fontFamily: 'Consolas, "Courier New", monospace',
            theme: {
                background: '#1e1e1e',
                foreground: '#ffffff',
            },
        });

        const fitAddon = new FitAddon();
        terminal.loadAddon(fitAddon);
        terminal.open(terminalRef.current);

        fitAddon.fit();
        terminal.focus();

        xtermRef.current = terminal;
        fitAddonRef.current = fitAddon;

        terminal.attachCustomKeyEventHandler((event) => {
            if (event.code === 'Tab' || event.key === 'Tab') {
                event.preventDefault();
                return true;
            }

            if (event.ctrlKey && !event.shiftKey && (event.key === 'v' || event.key === 'V')) {
                if (event.type === 'keydown') {
                    event.preventDefault();
                    if (navigator.clipboard?.readText) {
                        navigator.clipboard
                            .readText()
                            .then((text) => {
                                if (!text) return;
                                const anyTerm = terminal as any;
                                if (typeof anyTerm.paste === 'function') {
                                    anyTerm.paste(text);
                                } else {
                                    terminalWrite(id, text).catch(console.error);
                                }
                            })
                            .catch(console.error);
                    }
                }
                return false;
            }
            if (event.ctrlKey && !event.shiftKey && (event.key === 'c' || event.key === 'C')) {
                const selection = terminal.getSelection();
                if (selection) {
                    if (event.type === 'keydown') {
                        event.preventDefault();
                        if (navigator.clipboard?.writeText) {
                            navigator.clipboard.writeText(selection).catch(console.error);
                        }
                    }
                    return false;
                }
                return true;
            }

            return true;
        });

        terminal.onData((data) => {
            if (connectedRef.current) {
                terminalWrite(id, data).catch((err) => console.error(err));
            }
        });

        EventsOn(`terminal:data:${id}`, (data: string) => {
            terminal.write(data);
        });

        EventsOn(`terminal:closed:${id}`, () => {
            terminal.writeln('\r\nConnection closed by remote host.');
            connectedRef.current = false;
        });

        (async () => {
            try {
                await containerExec(selectedCredentialId, id);
                connectedRef.current = true;
                terminal.clear();
                fitAddon.fit();
                terminal.focus();
            } catch (error: any) {
                terminal.writeln(`\r\nError connecting: ${error?.message || error}`);
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
            terminal.dispose();
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
