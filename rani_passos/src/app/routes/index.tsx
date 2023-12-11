import { Route, Routes } from 'react-router-dom';

import Perfil from '../pages/usuario/Perfil';
import Aula from '../pages/cursos/Aula';
import { Pedidos } from '../pages';
import { Chat } from '../pages';
import { Termos } from '../pages';
import { Painel } from '../pages';
import {
  Esqueci,
  Login,
  NotFound,
  Registro,
  Reset,
} from '../shared/components';
export const Rotas = () => {
  return (
    <Routes>
      {/* Rotas Privadas */}
      <Route path="/" element={<Painel />} />
      <Route path="/minha-conta" element={<Perfil />} />
      <Route path="/pedidos" element={<Pedidos />} />
      <Route path="/chat-rav" element={<Chat />} />
      <Route path="/curso/:id" element={<Aula />} />
      <Route path="/termos-uso" element={<Termos />} />
      {/* Rotas Publicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/esqueci" element={<Esqueci />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/:token/:id/reset_password" element={<Reset />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
