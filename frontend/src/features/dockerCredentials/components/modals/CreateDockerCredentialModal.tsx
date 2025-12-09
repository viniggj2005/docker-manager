import iziToast from "izitoast";
import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import TextField from "../../../login/components/fields/TextField";
import { DockerCredentialService } from "../../services/DockerCredentialService";
import { CreateDockerCredentialModalProps } from "../../../../interfaces/DockerCredentialInterfaces";

type FileInput = File | File[];
const fileTypes = ["PEM", "TXT"];
type FileSetter = React.Dispatch<React.SetStateAction<string>>;

export const CreateDockerCredentialModal: React.FC<CreateDockerCredentialModalProps> = ({
  open,
  token,
  userId,
  refresh,
  onClose,
}) => {
  if (!open) return null;

  const [ca, setCa] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [key, setKey] = useState<string>("");
  const [cert, setCert] = useState<string>("");
  const [alias, setAlias] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleFileUpload = async (file: FileInput, setter: FileSetter): Promise<void> => {
    const selectedFile = Array.isArray(file) ? file[0] : file;
    const content = await selectedFile.text();
    setter(content);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      setSubmitting(true);
      await DockerCredentialService.create(token, {
        ca,
        key,
        url,
        cert,
        alias,
        description,
        userId: Number(userId),
      });

      iziToast.success({
        title: "Sucesso",
        message: "Credencial criada!",
        position: "bottomRight",
      });

      onClose();
      refresh();
    } catch (err) {
      iziToast.error({
        title: "Erro",
        message: String(err),
        position: "bottomRight",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-[450px] rounded-xl bg-white dark:bg-[var(--dark-secondary)] p-6 shadow-xl">

        <h2 className="text-xl font-semibold mb-4">Nova Credencial Docker</h2>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <TextField
            label="Alias"
            value={alias}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAlias(e.target.value)}
            required
          />
          <TextField
            label="Descrição"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
            required
          />

          <TextField
            label="URL"
            value={url}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
            required
          />

          <FileUploader
            types={fileTypes}
            handleChange={(f: FileInput) => handleFileUpload(f, setCa)}
          >
            <span className="px-2 py-1 bg-gray-200 rounded cursor-pointer">Enviar CA</span>
          </FileUploader>

          <textarea
            value={ca}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCa(e.target.value)}
            className="border rounded p-2"
            required
          />

          <FileUploader
            types={fileTypes}
            handleChange={(f: FileInput) => handleFileUpload(f, setCert)}
          >
            <span className="px-2 py-1 bg-gray-200 rounded cursor-pointer">Enviar Cert</span>
          </FileUploader>

          <textarea
            value={cert}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCert(e.target.value)}
            className="border rounded p-2"
            required
          />

          <FileUploader
            types={fileTypes}
            handleChange={(f: FileInput) => handleFileUpload(f, setKey)}
          >
            <span className="px-2 py-1 bg-gray-200 rounded cursor-pointer">Enviar Key</span>
          </FileUploader>

          <textarea
            value={key}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setKey(e.target.value)}
            className="border rounded p-2"
            required
          />

          <div className="flex gap-2 mt-4">
            <button
              className="flex-1 bg-gray-300 rounded py-2"
              type="button"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              className="flex-1 bg-[var(--docker-blue)] text-white rounded py-2"
              disabled={submitting}
            >
              {submitting ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
