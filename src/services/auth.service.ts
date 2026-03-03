import instance from "@/lib/axios/instance";
import endpoint from "@/services/endpoint.constant";
import type { ILogin, IRegister } from "@/types/auth.type";

const authService = {
  login: (payload: ILogin) =>
    instance.post(`${endpoint.AUTH}/login`, payload),

  register: (payload: IRegister) =>
    instance.post(`${endpoint.AUTH}/register`, payload),

  getProfile: () =>
    instance.get(`${endpoint.AUTH}/profile`),

  logout: () =>
    instance.post(`${endpoint.AUTH}/logout`),
};

export default authService;
