// Source unique de vérité des droits : sert à la fois à PROTÉGER les actions (serveur) et à AFFICHER la matrice (page Rôles).
import type { Role } from "./data";
export const PERMS = ["view_dash", "view_reports", "validate_code", "sync_stock", "adjust_stock", "manage_catalogue", "manage_cats", "view_audit"] as const;
export type Perm = (typeof PERMS)[number];
export const MATRIX: Record<Role, readonly Perm[]> = { ADMIN: PERMS, SUPERVISEUR: ["view_dash", "view_reports", "validate_code", "sync_stock", "adjust_stock"] };
export const can = (r: Role, p: Perm) => MATRIX[r].includes(p);
