export interface CustomParam {
  name: string
  value: string
}

interface MoreConfig {
  include: string
  exclude: string
  filename: string
  region: string
  emoji: boolean
  udp: boolean
  sort: boolean
  scv: boolean
  list: boolean
  appendType: boolean
  fdn: boolean
  expand: boolean
  surgeDoh: boolean
  clashDoh: boolean
  insert: boolean
  customParams: CustomParam[]
}

const regionPatterns: Record<string, string> = {
  asia: '\\s(?:HK|MO|TW|SG|MY|MV|KH|TH|MM|LA|VN|JP|KR|BT|BN|PH|ID|IN|MN|JO|IR|BH|OM|IL|PS|TR|NP|BD|LB|IQ|SY|AF|QA|KW|AE|AZ|AM|GE|PK|LK|SA|KZ|TJ|KG|UZ)$',
  americas: '\\s(?:US|CA|PM|MX|PA|BM|GL|GD|CR|VG|VI|BR|CL|PE|CU|HT|AR|UY|PY|JM|SR|BS|GF|BZ|MS|AW|CW|SX|MF|BL|GP|MQ|AG|KN|TT|VC|CO|EC|VE|BO|GT|SV|PR|KY|HN|DM|BB|LC|FK|TC)$',
  europe: '\\s(?:FR|GB|GG|JE|DE|DK|NO|SE|FI|IS|CH|CZ|GR|NL|PL|ME|RU|UA|HU|LU|AT|IT|VA|BE|IE|LT|ES|PT|AD|MT|MC|BG|HR|MK|RS|CY|LV|MD|SK|EE|BY|RO|GI|SM|FO|AX|SI|AL|BA|LI)$',
  africa: '\\s(?:EG|GH|TG|ZA|BJ|SD|ML|CG|GA|TD|TN|LY|KE|RW|CV|AO|CM|BI|SO|DJ|GM|GN|LS|MW|NE|UG|YT|ZM|NG|MZ|MU|CI|TZ|ZW|SN|BW|NA|SL|SZ|LR|DZ|MG|GQ|BF|ER|ET|MR|CF|ST|RE)$',
  common: '\\s(?:HK|TW|SG|JP|US)$',
  game: '游戏',
}

export const getSubLink = (
  urls: string,
  api: string,
  target: string,
  remoteConfig: string,
  isShowMoreConfig: boolean,
  moreConfig: MoreConfig
): string => {
  const linkLst = urls.split(/\r?\n/)
  const link = linkLst.join('|')
  const endpoint = api.endsWith('/sub?') ? api : api + '/sub?'
  let finalUrl = endpoint + 'target=' + target + '&url=' + encodeURIComponent(link)

  if (remoteConfig) {
    finalUrl = finalUrl + '&config=' + encodeURIComponent(remoteConfig)
  }

  if (isShowMoreConfig) {
    const include = moreConfig.include || regionPatterns[moreConfig.region] || ''
    if (include !== '') {
      finalUrl = finalUrl + '&include=' + encodeURIComponent(include)
    }
    if (moreConfig.exclude !== '') {
      finalUrl = finalUrl + '&exclude=' + encodeURIComponent(moreConfig.exclude)
    }
    finalUrl = finalUrl + '&emoji=' + moreConfig.emoji
    finalUrl = finalUrl + '&udp=' + moreConfig.udp
    finalUrl = finalUrl + '&sort=' + moreConfig.sort
    finalUrl = finalUrl + '&scv=' + moreConfig.scv
    finalUrl = finalUrl + '&list=' + moreConfig.list
    if (moreConfig.filename !== '') {
      finalUrl = finalUrl + '&filename=' + encodeURIComponent(moreConfig.filename)
    }
    if (moreConfig.appendType) {
      finalUrl = finalUrl + '&append_type=true'
    }
    if (moreConfig.fdn) {
      finalUrl = finalUrl + '&fdn=true'
    }
    if (!moreConfig.expand) {
      finalUrl = finalUrl + '&expand=false'
    }
    if (moreConfig.surgeDoh) {
      finalUrl = finalUrl + '&surge.doh=true'
    }
    if (moreConfig.clashDoh) {
      finalUrl = finalUrl + '&clash.doh=true'
    }
    if (moreConfig.insert) {
      finalUrl = finalUrl + '&insert=true'
    }
    for (const param of moreConfig.customParams) {
      if (param.name.trim() && param.value.trim()) {
        finalUrl = finalUrl + '&' + encodeURIComponent(param.name.trim()) + '=' + encodeURIComponent(param.value.trim())
      }
    }
  }

  return finalUrl
}

export const regexCheck = (url: string): boolean => {
  const reg_url = /https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/
  return reg_url.test(url)
}

export type { MoreConfig }
