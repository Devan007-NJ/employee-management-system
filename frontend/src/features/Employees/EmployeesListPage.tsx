import { Link } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { useEmployees, useDeleteEmployee } from './useEmployeeQueries';

export default function EmployeeListPage() {
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  const { data: employees, isLoading, isError } = useEmployees();
  const deleteMutation = useDeleteEmployee();

  const handleDelete = (id: string) => {
    if (confirm('Delete this employee record?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-base flex items-center justify-center text-text">Loading...</div>;
  }

  if (isError) {
    return <div className="min-h-screen bg-base flex items-center justify-center text-red">Failed to load employees.</div>;
  }

  return (
    <div className="min-h-screen bg-base p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-mauve">
          {isAdmin ? 'All Employees' : 'My Record'}
        </h1>
        {isAdmin && (
          <Link
            to="/employees/new"
            className="bg-mauve text-white font-semibold rounded-md px-4 py-2 hover:opacity-90 transition"
          >
            + Add Employee
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees?.map((emp) => (
          <div
            key={emp._id}
            className="bg-mantle border border-surface0 rounded-xl p-5 flex flex-col gap-2"
          >
            <h2 className="text-lg font-semibold text-text">{emp.name}</h2>
            <p className="text-subtext1 text-sm">{emp.email}</p>
            <p className="text-subtext0 text-sm">Department: {emp.department}</p>
            <p className="text-subtext0 text-sm">Role: {emp.role}</p>
            {isAdmin && (
              <p className="text-subtext0 text-sm">Salary: ${emp.salary.toLocaleString()}</p>
            )}

            <div className="flex gap-2 mt-3">
              <Link
                to={`/employees/${emp._id}/edit`}
                className="bg-surface0 text-text rounded-md px-3 py-1 text-sm hover:bg-surface1 transition"
              >
                Edit
              </Link>
              {isAdmin && (
                <button
                  onClick={() => handleDelete(emp._id)}
                  className="bg-red text-white rounded-md px-3 py-1 text-sm hover:opacity-90 transition"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {employees?.length === 0 && (
        <p className="text-subtext0 mt-8 text-center">No employee records found.</p>
      )}
    </div>
  );
}