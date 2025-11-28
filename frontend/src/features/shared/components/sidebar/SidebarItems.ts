import {
  HiOutlineCube,
  HiOutlineHome,
  HiOutlineServer,
  HiOutlinePhotograph,
  HiOutlineKey,
  HiOutlineArchive,
} from 'react-icons/hi';
import { PiNetworkBold } from "react-icons/pi";
export const navItems = [
  {
    label: 'Painel',
    description: 'Visão geral dos containers',
    to: '/home',
    icon: HiOutlineHome,
  },
  {
    label: 'Networks',
    description: 'Visão das redes do docker',
    to: '/networks',
    icon: PiNetworkBold ,
  },
  {
    label: 'Volumes',
    description: 'Gerencie volumes Docker',
    to: '/volumes',
    icon: HiOutlineArchive,
  },
  {
    label: 'Containers',
    description: 'Gerencie containers locais',
    to: '/containers',
    icon: HiOutlineCube,
  },
  {
    label: 'Imagens Docker',
    description: 'Organize suas imagens',
    to: '/images',
    icon: HiOutlinePhotograph,
  },
  {
    label: 'Credenciais Docker',
    description: 'Gerencie conexões TLS do Docker',
    to: '/docker-credentials',
    icon: HiOutlineKey,
  },
  {
    label: 'Conexões SSH',
    description: 'Acesse servidores remotos',
    to: '/createConnectionForm',
    icon: HiOutlineServer,
  },
];
