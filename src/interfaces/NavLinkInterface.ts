// Author: Kevin Pabón

/**
 * A NavBar link. Whether the route requires the admin role is decided by
 * the router (each route's meta.admin): it is the only source of that information.
 */
export interface NavLink {
  name: string
  label: string
}
