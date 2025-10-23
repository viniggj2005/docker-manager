import { HiOutlineCube, HiOutlineHome, HiOutlineServer, HiOutlinePhotograph } from 'react-icons/hi';
export const navItems = [
  {
    label: 'Painel',
    description: 'Visão geral dos containers',
    to: '/home',
    icon: HiOutlineHome,
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
    label: 'Conexões SSH',
    description: 'Acesse servidores remotos',
    to: '/createConnectionForm',
    icon: HiOutlineServer,
  },
];
