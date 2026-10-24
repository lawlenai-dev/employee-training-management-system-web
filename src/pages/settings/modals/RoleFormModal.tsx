import type { ComponentProps } from "react";
import AccessFormModal from "./AccessFormModal";
export default function RoleFormModal(
  props: Omit<ComponentProps<typeof AccessFormModal>, "kind">,
) {
  return <AccessFormModal {...props} kind="roles" />;
}
