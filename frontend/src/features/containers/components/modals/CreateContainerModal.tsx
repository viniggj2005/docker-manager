import iziToast from 'izitoast';
import React, { useState, useEffect } from 'react';
import { dtos, image } from '../../../../../wailsjs/go/models';
import { Modal } from '../../../shared/components/modals/Modal';
import { Box } from 'lucide-react';
import { useDockerClient } from '../../../../contexts/DockerClientContext';
import { CreateContainer, ImagesList, ListVolumes, ListNetworks } from '../../../../../wailsjs/go/handlers/DockerSdkHandlerStruct';
import { BasicInfoSection } from '../create-modal/BasicInfoSection';
import { PortsSection } from '../create-modal/PortsSection';
import { EnvVarsSection } from '../create-modal/EnvVarsSection';
import { VolumesSection } from '../create-modal/VolumesSection';
import { CreateContainerPortMapping, CreateContainerEnvVar, CreateContainerVolumeMapping } from '../../../../interfaces/ContainerInterfaces';


interface CreateContainerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const CreateContainerModal: React.FC<CreateContainerModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { dockerClientId } = useDockerClient();
    const [loading, setLoading] = useState(false);

    const [availableImages, setAvailableImages] = useState<image.Summary[]>([]);
    const [availableVolumes, setAvailableVolumes] = useState<any[]>([]);
    const [availableNetworks, setAvailableNetworks] = useState<any[]>([]);

    const [containerName, setContainerName] = useState('');
    const [imageName, setImageName] = useState('');
    const [selectedNetwork, setSelectedNetwork] = useState('bridge');
    const [ports, setPorts] = useState<CreateContainerPortMapping[]>([]);
    const [envVars, setEnvVars] = useState<CreateContainerEnvVar[]>([]);
    const [volumes, setVolumes] = useState<CreateContainerVolumeMapping[]>([]);


    useEffect(() => {
        if (isOpen && dockerClientId) {
            ImagesList(dockerClientId).then((imgs) => {
                setAvailableImages(imgs || []);
            }).catch(error => {
                iziToast.error({ title: 'Erro', message: 'Falha ao carregar imagens.' });
            });

            ListVolumes(dockerClientId).then((volsJson) => {
                try {
                    const data = JSON.parse(volsJson);
                    setAvailableVolumes(data.Volumes || []);
                } catch (error) {
                    iziToast.error({ title: 'Erro', message: 'Falha ao processar lista de volumes.' });
                }
            }).catch(error => {
                iziToast.error({ title: 'Erro', message: 'Falha ao carregar volumes.' });
            });

            ListNetworks(dockerClientId).then((netsJson) => {
                try {
                    const data = JSON.parse(netsJson);
                    setAvailableNetworks(Array.isArray(data) ? data : []);
                } catch (error) {
                    iziToast.error({ title: 'Erro', message: 'Falha ao processar lista de redes.' });
                }
            }).catch((error) => {

                iziToast.error({ title: 'Erro', message: 'Falha ao carregar redes.' });
            });
        }
    }, [isOpen, dockerClientId]);


    const handleSubmit = async () => {
        if (!dockerClientId) return;
        if (!imageName) {
            iziToast.warning({ title: 'Atenção', message: 'O nome da imagem é obrigatório' });
            return;
        }

        setLoading(true);
        try {
            const exposedPorts: Record<string, any> = {};
            const portBindings: Record<string, any[]> = {};

            ports.forEach(p => {
                if (p.containerPort) {
                    const portKey = `${p.containerPort}/tcp`;
                    exposedPorts[portKey] = {};
                    if (p.hostPort) {
                        portBindings[portKey] = [{ HostPort: p.hostPort }];
                    }
                }
            });

            const envList = envVars
                .filter(e => e.key)
                .map(e => `${e.key}=${e.value}`);

            const binds = volumes
                .filter(v => v.hostPath && v.containerPath)
                .map(v => `${v.hostPath}:${v.containerPath}`);

            const options = new dtos.ContainerCreateOptions({
                containerName: containerName,
                config: {
                    Image: imageName,
                    ExposedPorts: exposedPorts,
                    Env: envList,
                },
                hostConfig: {
                    PortBindings: portBindings,
                    Binds: binds,
                },
                networkingConfig: {
                    EndpointsConfig: {
                        [selectedNetwork]: {}
                    }
                },
                platform: null
            });

            await CreateContainer(dockerClientId, options);

            iziToast.success({ title: 'Sucesso', message: 'Container criado com sucesso' });
            onSuccess();
            onClose();

            setContainerName('');
            setImageName('');
            setPorts([]);
            setEnvVars([]);
            setVolumes([]);

        } catch (error) {
            console.error(error);
            iziToast.error({ title: 'Erro', message: `Falha ao criar container: ${error}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Criar Novo Container"
            icon={<Box className="w-5 h-5 text-blue-500" />}
            className="max-w-3xl"
        >
            <div className="space-y-6">
                <BasicInfoSection
                    containerName={containerName}
                    setContainerName={setContainerName}
                    imageName={imageName}
                    setImageName={setImageName}
                    selectedNetwork={selectedNetwork}
                    setSelectedNetwork={setSelectedNetwork}
                    availableImages={availableImages}
                    availableNetworks={availableNetworks}
                />

                <PortsSection ports={ports} setPorts={setPorts} />

                <EnvVarsSection envVars={envVars} setEnvVars={setEnvVars} />

                <VolumesSection volumes={volumes} setVolumes={setVolumes} availableVolumes={availableVolumes} />
            </div>

            <div className="mt-8 flex justify-end gap-3">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                    {loading ? 'Criando...' : 'Criar Container'}
                </button>
            </div>
        </Modal>
    );
};
