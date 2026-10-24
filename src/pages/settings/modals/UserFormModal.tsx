import type { ComponentProps } from "react";
import AccessFormModal from "./AccessFormModal";
export default function UserFormModal(
  props: Omit<ComponentProps<typeof AccessFormModal>, "kind">,
) {
  return <AccessFormModal {...props} kind="users" />;
}
