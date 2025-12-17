import { UsersService } from '@/services/remote-api/api/user-management-service/users.service'

const userService = new UsersService()

export const replaceAll = (str: string, find: string, replace: string): string => {
  return str.replace(new RegExp(find, 'g'), replace)
}

export const toTitleCase = (phrase: string): string => {
  return phrase
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const EmailAvailability = (email: string) => {
  return new Promise(resolve => {
    userService.getEmailConfirmation(email).subscribe(
      (res: any) => resolve(res.status), // Resolve with API status
      (error: any) => {
        console.error('Error in getEmailConfirmation:', error)
        resolve(false) // Return false in case of an error
      }
    )
  })
}
