import { redirect } from "next/navigation";

/** Legacy path — operators were renamed to inspectors. */
export default function OperatorsRedirectPage() {
  redirect("/certificate/admin/inspectors/");
}
