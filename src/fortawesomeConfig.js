import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faAngleDown, faAngleDoubleUp, faTimes, faTable, faCalendar, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faAngleDown, faAngleDoubleUp, faTimes, faTable, faCalendar, faUser)

Vue.component('font-awesome-icon', FontAwesomeIcon)
