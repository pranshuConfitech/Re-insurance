import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
  url: 'https://identity.cognaisure.com',
  realm: 'lc360',
  clientId: 'reinsurance-web-client'
})

export default keycloak
