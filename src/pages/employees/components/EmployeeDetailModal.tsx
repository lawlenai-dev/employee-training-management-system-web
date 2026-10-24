import EmployeeModal from "./EmployeeModal";
import EmployeeTrainingHistoryPanel from "./EmployeeTrainingHistory";
import { getEmployeeFullName, toEmployeeForm } from "./employeeModel";
import type { EmployeeTrainingHistory } from "./EmployeeTrainingHistory";
export type { EmployeeTrainingHistory, TrainingResult } from "./EmployeeTrainingHistory";

type Props = { open: boolean; employee: object | null; histories: EmployeeTrainingHistory[]; onClose: () => void };
/** Compatibility wrapper. All employee details are rendered by EmployeeModal. */
export default function EmployeeDetailModal({ open, employee, histories, onClose }: Props) {
  if (!open || !employee) return null;
  const values = toEmployeeForm(employee);
  return <EmployeeModal open mode="view" initialData={values} title={getEmployeeFullName(values)} description="ข้อมูลพนักงานและประวัติการอบรม" onClose={onClose}>
    <div className="mt-5"><EmployeeTrainingHistoryPanel histories={histories} /></div>
  </EmployeeModal>;
}
