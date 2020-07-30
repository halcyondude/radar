import path from 'path'
import { readdirSync } from 'fs'
import stripUrl from './helpers/stripUrl'
import fetchLandscapeData from './helpers/fetchLandscapeData'
import loadYaml from './helpers/loadYaml'

const projectMatches = ({ project, point }) => {
  if (point.repo) {
    return project.repo_url === `https://github.com/${point.repo}`
  }

  return stripUrl(project.homepage_url) === stripUrl(point.homepage)
}

const formatDate = (date, format) => {
  const dateTimeFormat = new Intl.DateTimeFormat('en', format)
  return dateTimeFormat.format(date)
}

const makePoint = (attrs, landscapeAttrs) => {
  const key = attrs.name.toLowerCase().replace(/\W/g, '-')
  const { github_data } = landscapeAttrs || {}

  if (!landscapeAttrs) {
    return { ...attrs, key }
  }

  const description = (landscapeAttrs || {}).description || (github_data || {}).description
  return { description, landscapeId: landscapeAttrs.id, ...attrs, key }
}

const makeRadar = attrs => {
  const date = new Date(attrs.key.match(/\d{4}-\d{2}/)[0])
  const name = `${attrs.name}, ${(formatDate(date, { month: 'long', year: 'numeric' }))}`

  return { ...attrs, name }
}

const loadRadarData = _ => {
  return readdirSync(path.join(process.cwd(), 'content', 'radars')).map(path => {
    const radar = loadYaml('radars', path)
    const key = path.replace(/\.yml/, '')
    return { ...radar, key }
  })
}

export default async () => {
  const data = loadRadarData()
  const landscapeData = await fetchLandscapeData()

  const radars = data
    .sort((a, b) => -a.key.localeCompare(b.key))
    .map(radarAttrs => {
      const radar = makeRadar(radarAttrs)

      const points = radar.points.map(pointAttrs => {
        const landscapeAttrs = landscapeData.find(project => projectMatches({ project, point: pointAttrs }))
        const point = makePoint(pointAttrs, landscapeAttrs)
        return { ...point, fullKey: `${radar.key}/${point.key}`, radarKey: radar.key }
      })

      return { ...radar, points }
    })

  const points = radars.flatMap(radar => {
    return radar.points.map(point => ({ ...point, radar }))
  })

  return { radars, points }
}
