import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    fortune: [
      {
        eventDate: '2019-5-6',
        eventPlace: '千葉',
        tickets: [
          {
            memberName: '井口　眞緒',
            partName: '第５部',
            amont: 3
          },
          {
            memberName: '小坂　菜緒',
            partName: '第２部',
            amont: 1
          },
          {
            memberName: '渡邉　美穂',
            partName: '第３部',
            amont: 2
          }
        ]
      },
      {
        eventDate: '2019-6-8',
        eventPlace: '千葉',
        tickets: [
          {
            memberName: '井口　眞緒',
            partName: '第５部',
            amont: 3
          }
        ]
      },
      {
        eventDate: '2019-6-30',
        eventPlace: '東京',
        tickets: [
          {
            memberName: '井口　眞緒',
            partName: '第５部',
            amont: 3
          },
          {
            memberName: '渡邉　美穂',
            partName: '第３部',
            amont: 1
          }
        ]
      },
      {
        eventDate: '2019-7-21',
        eventPlace: '東京',
        tickets: [
          {
            memberName: '佐々木　美玲',
            partName: '第３部',
            amont: 1
          }
        ]
      },
      {
        eventDate: '2019-3-24',
        eventPlace: '愛知',
        tickets: [
          {
            memberName: '井口　眞緒',
            partName: '第５部',
            amont: 8
          },
          {
            memberName: '井口　眞緒',
            partName: '第４部',
            amont: 9
          }
        ]
      },
      {
        eventDate: '2019-7-14',
        eventPlace: '神奈川',
        tickets: [
          {
            memberName: '井口　眞緒',
            partName: '第１部',
            amont: 12
          },
          {
            memberName: '井口　眞緒',
            partName: '第２部',
            amont: 8
          },
          {
            memberName: '高瀬　愛奈',
            partName: '第３部',
            amont: 1
          }
        ]
      },
      {
        eventDate: '2019-4-29',
        eventPlace: '千葉',
        tickets: [
          {
            memberName: '井口　眞緒',
            partName: '第１部',
            amont: 9
          },
          {
            memberName: '井口　眞緒',
            partName: '第２部',
            amont: 6
          }
        ]
      },
      {
        eventDate: '2019-5-4',
        eventPlace: '神奈川',
        tickets: [
          {
            memberName: '井口　眞緒',
            partName: '第４部',
            amont: 9
          },
          {
            memberName: '井口　眞緒',
            partName: '第５部',
            amont: 6
          }
        ]
      },
      {
        eventDate: '2019-6-2',
        eventPlace: '神奈川',
        tickets: [
          {
            memberName: '井口　眞緒',
            partName: '第２部',
            amont: 9
          },
          {
            memberName: '井口　眞緒',
            partName: '第３部',
            amont: 4
          },
          {
            memberName: '濱岸　ひより',
            partName: '第１部',
            amont: 2
          }
        ]
      },
      {
        eventDate: '2018-11-17',
        eventPlace: '千葉',
        tickets: [
          {
            memberName: '井口　眞緒',
            partName: '第２部',
            amont: 8
          },
          {
            memberName: '井口　眞緒',
            partName: '第３部',
            amont: 4
          },
          {
            memberName: '井口　眞緒',
            partName: '第４部',
            amont: 8
          },
          {
            memberName: '井口　眞緒',
            partName: '第５部',
            amont: 6
          },
          {
            memberName: '長濱　ねる',
            partName: '第１部',
            amont: 2
          },
          {
            memberName: '齊藤　京子',
            partName: '第１部',
            amont: 2
          },
          {
            memberName: '金村　美玖',
            partName: '第３部',
            amont: 2
          }
        ]
      },
      {
        eventDate: '2018-9-15',
        eventPlace: '千葉',
        tickets: [
          {
            memberName: '井口　眞緒',
            partName: '第１部',
            amont: 2
          },
          {
            memberName: '井口　眞緒',
            partName: '第２部',
            amont: 1
          },
          {
            memberName: '井口　眞緒',
            partName: '第４部',
            amont: 2
          },
          {
            memberName: '井口　眞緒',
            partName: '第５部',
            amont: 7
          },
          {
            memberName: '上村　莉菜',
            partName: '第１部',
            amont: 3
          },
          {
            memberName: '潮　紗理菜',
            partName: '第４部',
            amont: 3
          },
          {
            memberName: '齊藤　京子',
            partName: '第５部',
            amont: 1
          },
          {
            memberName: '高本　彩花',
            partName: '第２部',
            amont: 3
          },
          {
            memberName: '東村　芽依',
            partName: '第２部',
            amont: 3
          }
        ]
      },
      {
        eventDate: '2018-9-29',
        eventPlace: '神奈川',
        tickets: [
          {
            memberName: '井口　眞緒',
            partName: '第１部',
            amont: 4
          },
          {
            memberName: '井口　眞緒',
            partName: '第２部',
            amont: 4
          },
          {
            memberName: '井口　眞緒',
            partName: '第４部',
            amont: 4
          },
          {
            memberName: '井口　眞緒',
            partName: '第５部',
            amont: 5
          }
        ]
      },
      {
        eventDate: '2018-10-13',
        eventPlace: '東京',
        tickets: [
          {
            memberName: '井口　眞緒',
            partName: '第１部',
            amont: 2
          },
          {
            memberName: '井口　眞緒',
            partName: '第５部',
            amont: 6
          },
          {
            memberName: '井口　眞緒',
            partName: '第２部',
            amont: 1
          },
          {
            memberName: '井口　眞緒',
            partName: '第３部',
            amont: 1
          },
          {
            memberName: '上村　莉菜',
            partName: '第３部',
            amont: 2
          },
          {
            memberName: '柿崎　芽実',
            partName: '第３部',
            amont: 3
          },
          {
            memberName: '齊藤　京子',
            partName: '第２部',
            amont: 2
          },
          {
            memberName: '東村　芽依',
            partName: '第２部',
            amont: 3
          },
          {
            memberName: '渡邉　美穂',
            partName: '第１部',
            amont: 2
          },
          {
            memberName: '佐々木琴子',
            partName: '第４部',
            amont: 3
          }
        ]
      },
      {
        eventDate: '2018-8-26',
        eventPlace: '京都',
        tickets: [
          {
            memberName: '井口　眞緒',
            partName: '第２部',
            amont: 5
          }
        ]
      },
      {
        eventDate: '2018-12-15',
        eventPlace: '東京',
        tickets: [
          {
            memberName: '佐々木琴子',
            partName: '第４部',
            amont: 3
          }
        ]
      },
      {
        eventDate: '2018-10-27',
        eventPlace: '神奈川',
        tickets: [
          {
            memberName: '佐々木琴子',
            partName: '第４部',
            amont: 3
          }
        ]
      },
      {
        eventDate: '2018-7-16',
        eventPlace: '千葉',
        tickets: [
          {
            memberName: '中井　りか',
            partName: '２部',
            amont: 2
          },
          {
            memberName: '中村　歩加',
            partName: '２部',
            amont: 1
          },
          {
            memberName: '井口　眞緒',
            partName: '第２部',
            amont: 2
          },
          {
            memberName: '井口　眞緒',
            partName: '第３部',
            amont: 2
          },
          {
            memberName: '井口　眞緒',
            partName: '第４部',
            amont: 2
          },
          {
            memberName: '井口　眞緒',
            partName: '第５部',
            amont: 2
          },
          {
            memberName: '影山　優佳',
            partName: '第１部',
            amont: 1
          },
          {
            memberName: '影山　優佳',
            partName: '第４部',
            amont: 2
          },
          {
            memberName: '佐々木琴子',
            partName: '第４部',
            amont: 3
          }
        ]
      },
      {
        eventDate: '2018-6-10',
        eventPlace: '神奈川',
        tickets: [
          {
            memberName: '井口　眞緒',
            partName: '第５部',
            amont: 3
          },
          {
            memberName: '井口　眞緒',
            partName: '第２部',
            amont: 1
          },
          {
            memberName: '佐々木　久美',
            partName: '第３部',
            amont: 1
          },
          {
            memberName: '長濱　ねる',
            partName: '第４部',
            amont: 3
          },
          {
            memberName: '影山　優佳',
            partName: '第２部',
            amont: 3
          },
          {
            memberName: '影山　優佳',
            partName: '第４部',
            amont: 3
          },
          {
            memberName: '加藤　史帆',
            partName: '第４部',
            amont: 3
          }
        ]
      },
      {
        eventDate: '2018-6-9',
        eventPlace: '神奈川',
        tickets: [
          {
            memberName: '佐々木琴子',
            partName: '第４部',
            amont: 3
          }
        ]
      },
      {
        eventDate: '2018-3-17',
        eventPlace: '東京',
        tickets: [
          {
            memberName: '井口　眞緒',
            partName: '第１部',
            amont: 1
          },
          {
            memberName: '井口　眞緒',
            partName: '第２部',
            amont: 2
          },
          {
            memberName: '高瀬　愛奈',
            partName: '第１部',
            amont: 1
          },
          {
            memberName: '上村　莉菜',
            partName: '第２部',
            amont: 1
          },
          {
            memberName: '上村　莉菜',
            partName: '第４部',
            amont: 2
          },
          {
            memberName: '影山　優佳',
            partName: '第３部',
            amont: 2
          },
          {
            memberName: '影山　優佳',
            partName: '第４部',
            amont: 2
          },
          {
            memberName: '佐々木　美玲',
            partName: '第３部',
            amont: 1
          },
          {
            memberName: '佐々木琴子',
            partName: '第５部',
            amont: 3
          }
        ]
      },
      {
        eventDate: '2018-2-25',
        eventPlace: '神奈川',
        tickets: [
          {
            memberName: '佐々木琴子',
            partName: '第１部',
            amont: 3
          }
        ]
      },
      {
        eventDate: '2018-1-14',
        eventPlace: '神奈川',
        tickets: [
          {
            memberName: '佐々木琴子',
            partName: '第４部',
            amont: 1
          }
        ]
      },
      {
        eventDate: '2018-1-28',
        eventPlace: '東京',
        tickets: [
          {
            memberName: '佐々木琴子',
            partName: '第４部',
            amont: 1
          }
        ]
      }
    ]
  },
  mutations: {},
  actions: {}
})
