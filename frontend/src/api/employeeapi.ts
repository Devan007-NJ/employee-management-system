import api from "./AxiosInstance";

export interface Employee {
    _id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Employee';
    department: string;
    salary: number;
}
//GET OPERATION
export const getEmployees = async () : Promise<Employee[]> => {
    let response = await api.get<Employee[]>('/list/');
    return response.data;
}
export const getEmployeeById = async (id: string): Promise<Employee> => {
  const response = await api.get(`/${id}/`);
  return response.data;
};
//POST OPERATION
export const createEmployee = async (payload : Omit<Employee, '_id'>) : Promise<Employee> => {
    let response = await api.post<Employee>('/create/', payload);
    return response.data;
}
//PUT OPERATION
export const updateEmployee = async (id: string, payload: Omit<Employee, '_id'>): Promise<Employee> => {
  const response = await api.put<Employee>(`/${id}/`, payload);
  return response.data;
};
//DELETE OPERATION
export const deleteEmployee = async (id: string): Promise<void> => {
  await api.delete(`/${id}/`);
};  
