const getEnvVariable = (key) => {
  if (import.meta.env) {
    return import.meta.env[key]
  }
  return undefined
}

const config = {
  backendUrl: getEnvVariable('VITE_API_BACK'),
  backendPort: getEnvVariable('VITE_PORT_BACK'),
  getFullBackendUrl: function () {
    const baseUrl = this.backendUrl?.startsWith('http')
      ? this.backendUrl
      : `http://${this.backendUrl}`

    return this.backendPort ? `${baseUrl}:${this.backendPort}` : baseUrl
  },
}

export default config
