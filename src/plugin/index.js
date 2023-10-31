const plugins = import.meta.glob('./*.js', { eager: true })

const plugin = {
  install(app) {
    Object.values(plugins).forEach((plugin) => plugin.install && plugin.install(app))
  }
}

export default plugin
