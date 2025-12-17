import { signIn } from '../libs/auth'

export default async function SignInAction() {
  await signIn('keycloak')
}
