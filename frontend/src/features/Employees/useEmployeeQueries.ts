import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  type Employee,
  type EmployeePayload,
} from '../../api/employeeapi';

export const useEmployees = () => {
  return useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: getEmployees,
  });
};

export const useEmployee = (id: string | undefined) => {
  return useQuery<Employee>({
    queryKey: ['employees', id],
    queryFn: () => getEmployeeById(id as string),
    enabled: !!id,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: EmployeePayload) => createEmployee(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: EmployeePayload }) =>
      updateEmployee(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};