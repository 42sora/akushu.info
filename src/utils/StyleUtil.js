const config = [
  { value: '乃木坂', class: ['bk-coler-nogi'] },
  { value: '欅坂', class: ['bk-coler-keyaki'] },
  { value: '吉本坂', class: ['bk-coler-yoshimoto'] },
  { value: '日向坂', class: ['bk-coler-hinata'] },
  { value: '全国', class: ['bk-coler-zenkoku'] },
  { value: '個別', class: ['bk-coler-kobetsu'] },
  { value: '宮城', class: ['bk-coler-miyagi'] },
  { value: '千葉', class: ['bk-coler-chiba'] },
  { value: '東京', class: ['bk-coler-tokyo'] },
  { value: '神奈川', class: ['bk-coler-kanagawa'] },
  { value: '愛知', class: ['bk-coler-aichi'] },
  { value: '京都', class: ['bk-coler-kyoto'] },
  { value: '大阪', class: ['bk-coler-osaka'] },
  { value: '関東', class: ['bk-coler-kanto'] },
  { value: '関西', class: ['bk-coler-kansai'] }
]

export const getBkColerClass = value => {
  for (let i = 0; i < config.length; i++) {
    const element = config[i]
    if (value.includes(element.value)) {
      return element.class
    }
  }
  return []
}
