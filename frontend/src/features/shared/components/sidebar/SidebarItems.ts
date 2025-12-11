import {
  HiOutlineCube,
  HiOutlineHome,
  HiOutlineServer,
  HiOutlinePhotograph,
} from 'react-icons/hi';
import { FiKey } from "react-icons/fi";
import { PiNetworkBold } from "react-icons/pi";
import { RiHardDrive3Line } from "react-icons/ri";
export const navItems = [
  {
    label: 'Painel',
    description: 'Visão geral dos contêineres',
    to: '/home',
    icon: HiOutlineHome,
  },
  {
    label: 'Networks',
    description: 'Visão das redes do docker',
    to: '/networks',
    icon: PiNetworkBold,
  },
  {
    label: 'Volumes',
    description: 'Gerencie volumes Docker',
    to: '/volumes',
    icon: RiHardDrive3Line,
  },
  {
    label: 'Containers',
    description: 'Gerencie contêineres locais',
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
    icon: FiKey,
  },
  {
    label: 'Conexões SSH',
    description: 'Acesse servidores remotos',
    to: '/createConnectionForm',
    icon: HiOutlineServer,
  },
];
