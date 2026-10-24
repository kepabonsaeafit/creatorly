// Author: Kevin Pabón

// internal imports
import { StringUtil } from '@/utils/StringUtil'
import type { UserFilterDTO } from '@/dtos/Users/UserFilterDTO'
import type { UserInterface } from '@/interfaces/UserInterface'

export class UserUtil {
  /**
   * Users with the coordinator role, for OrderFormComponent's coordinator select.
   * @param users - Users already fetched from the API.
   * @returns The users with the coordinator role.
   */
  static getCoordinators(users: UserInterface[]): UserInterface[] {
    return users.filter((user: UserInterface): boolean => user.role === 'coordinator')
  }

  /**
   * Applies a UserFilterDTO over a list of users already fetched from the API
   * and sorts the result by name. Used by UsersIndexView.
   * @param users - Users to filter.
   * @param filter - Filter criteria.
   * @returns The filtered, name-sorted users.
   */
  static filter(users: UserInterface[], filter: UserFilterDTO): UserInterface[] {
    return users
      .filter((user: UserInterface): boolean => {
        if (filter.role && user.role !== filter.role) return false
        if (
          filter.text &&
          !StringUtil.contains(user.name, filter.text) &&
          !StringUtil.contains(user.email, filter.text)
        ) {
          return false
        }

        return true
      })
      .sort((first: UserInterface, second: UserInterface): number =>
        first.name.localeCompare(second.name),
      )
  }
}
