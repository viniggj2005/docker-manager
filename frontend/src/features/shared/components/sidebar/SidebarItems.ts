import {
  HiOutlineCube,
  HiOutlineHome,
  HiOutlineServer,
  HiOutlinePhotograph,
  HiOutlineKey,
} from 'react-icons/hi';
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
