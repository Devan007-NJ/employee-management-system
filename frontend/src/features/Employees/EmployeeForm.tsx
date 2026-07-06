import { useState, useEffect } from 'react';
import type { SyntheticEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import {
  useEmployee,
  useCreateEmployee,
  useUpdateEmployee,
} from './useEmployeeQueries';

export default function EmployeeForm() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  const { data: existingEmployee, isLoading } = useEmployee(id);
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();

  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const [salary, setSalary] = useState('');
  const [error, setError] = useState('');

  // Populate form once existing employee data loads (edit mode)
  useEffect(() => {
    if (existingEmployee) {
      setName(existingEmployee.name);
      setEmail(existingEmployee.email);
      setDepartment(existingEmployee.department);
      setRole(existingEmployee.role);
      setSalary(String(existingEmployee.salary));
    }
  }, [existingEmployee]);

  // Only admins can restrict-lock fields for employees editing their own record
  const canEditRestrictedFields = isAdmin;

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const payload = {
      name,
      email,
      department,
      role,
      salary: Number(salary),
    };

    try {
      if (isEditMode && id) {
        await updateMutation.mutateAsync({ id, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      navigate('/employees');
    } catch {
      setError('Failed to save employee. Check the fields and try again.');
    }
  };

  if (isEditMode && isLoading) {
    return <div className="min-h-screen bg-base flex items-center justify-center text-text">Loading...</div>;
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-base flex items-center justify-center p-8">
      <form
        onSubmit={handleSubmit}
        className="bg-mantle border border-surface0 rounded-xl p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-mauve mb-6">
          {isEditMode ? 'Edit Employee' : 'Add Employee'}
        </h1>

        {error && (
          <p className="text-red bg-surface0 rounded-md p-2 mb-4 text-sm">{error}</p>
        )}

        <div className="mb-4">
          <label className="block text-subtext1 mb-1 text-sm">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-surface0 text-text border border-surface1 rounded-md px-3 py-2 focus:outline-none focus:border-mauve"
          />
        </div>

        <div className="mb-4">
          <label className="block text-subtext1 mb-1 text-sm">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-surface0 text-text border border-surface1 rounded-md px-3 py-2 focus:outline-none focus:border-mauve"
          />
        </div>

        <div className="mb-4">
          <label className="block text-subtext1 mb-1 text-sm">Department</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
            disabled={!canEditRestrictedFields}
            className="w-full bg-surface0 text-text border border-surface1 rounded-md px-3 py-2 focus:outline-none focus:border-mauve disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="mb-4">
          <label className="block text-subtext1 mb-1 text-sm">Role</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            disabled={!canEditRestrictedFields}
            className="w-full bg-surface0 text-text border border-surface1 rounded-md px-3 py-2 focus:outline-none focus:border-mauve disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="mb-6">
          <label className="block text-subtext1 mb-1 text-sm">Salary</label>
          <input
            type="number"
            step="0.01"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required
            disabled={!canEditRestrictedFields}
            className="w-full bg-surface0 text-text border border-surface1 rounded-md px-3 py-2 focus:outline-none focus:border-mauve disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 bg-mauve text-white font-semibold rounded-md py-2 hover:opacity-90 transition disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Employee'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/employees')}
            className="flex-1 bg-surface0 text-text font-semibold rounded-md py-2 hover:bg-surface1 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}