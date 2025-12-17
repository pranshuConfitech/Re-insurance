import { Suspense } from "react"

import UsersComponent from "@/views/apps/user-management/users/users.component"

const Users = () => {
  return (
    <Suspense fallback={null}>
      <UsersComponent/>
    </Suspense>
  )
}

export default Users
