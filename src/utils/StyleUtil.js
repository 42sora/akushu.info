export const getBkColerClass = (value) => {
  return {
    'bk-coler-nogi': value.includes('乃木坂'),
    'bk-coler-keyaki': value.includes('欅坂'),
    'bk-coler-yoshimoto': value.includes('吉本坂'),
    'bk-coler-hinata': value.includes('日向坂'),
    'bk-coler-zenkoku': value.includes('全国'),
    'bk-coler-kobetsu': value.includes('個別'),
    'bk-coler-miyagi': value.includes('宮城'),
    'bk-coler-chiba': value.includes('千葉'),
    'bk-coler-tokyo': value.includes('東京'),
    'bk-coler-kanagawa': value.includes('神奈川'),
    'bk-coler-aichi': value.includes('愛知'),
    'bk-coler-kyoto': value.includes('京都'),
    'bk-coler-osaka': value.includes('大阪'),
    'bk-coler-kanto': value.includes('関東'),
    'bk-coler-kansai': value.includes('関西')
  }
}
