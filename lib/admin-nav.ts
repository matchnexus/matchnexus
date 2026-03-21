import {
  HiChartBar,
  HiUsers,
  HiOfficeBuilding,
  HiBadgeCheck,
} from "react-icons/hi";

export const adminNavItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: HiChartBar,
  },
  {
    label: "Students",
    href: "/admin/students",
    icon: HiUsers,
  },
  {
    label: "Companies",
    href: "/admin/companies",
    icon: HiOfficeBuilding,
  },
  {
    label: "Verifications",
    href: "/admin/verifications",
    icon: HiBadgeCheck,
  },
];