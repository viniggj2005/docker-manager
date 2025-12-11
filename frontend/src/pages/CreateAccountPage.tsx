import React from 'react';
import { useNavigate } from 'react-router-dom';
import appIcon from '../assets/images/appicon.png';
import CreateUserForm from '../features/users/components/forms/CreateUserForm';
import { motion } from 'framer-motion';
import { GoContainer } from 'react-icons/go';
import { LuLayers, LuServer } from 'react-icons/lu';
const CreateAccountPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-500/10 rounded-full blur-3xl" />
        <motion.div
          animate={{
            y: [0, -25, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-20 text-purple-400/20"
        >
          <GoContainer size={90} />
        </motion.div>

        <motion.div
          animate={{
            y: [0, 25, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-10 text-blue-400/20"
        >
          <LuLayers size={110} />
        </motion.div>

        <motion.div
          animate={{
            y: [0, -10, 0],
            x: [0, -15, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-20 text-cyan-400/20"
        >
          <LuServer size={70} />
        </motion.div>
      </div>

      <div className="relative z-10 h-full overflow-y-auto overflow-x-hidden">
        <div className="min-h-full flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-lg"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="inline-flex items-center justify-center mb-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl blur-lg opacity-75" />
                  <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <img src={appIcon} alt="App Icon" className="w-9 h-9 " />
                  </div>
                </div>
              </motion.div>

              <h1 className="text-3xl text-white mb-2">
                Criar Conta
              </h1>
              <p className="text-purple-200/70">
                Comece a gerenciar seus containers hoje
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20" />

              <div className="relative p-8">
                <CreateUserForm />
                <div className="relative my-6">

                  <div className="relative flex justify-center">
                    <span className="px-4 text-sm mt-1 text-purple-200/60 bg-transparent">
                      ou
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-purple-100/70">
                    Já tem uma conta?{' '}
                    <button
                      onClick={() => navigate('/login')}
                      className="text-purple-300 hover:text-purple-200 transition-colors underline-offset-4 hover:underline"
                    >
                      Fazer login
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center text-purple-200/50 text-sm mt-8"
            >
              Ao criar uma conta, você concorda com nossos termos de serviço
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountPage;
