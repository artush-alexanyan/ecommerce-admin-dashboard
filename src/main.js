import './assets/main.css'
import 'animate.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'
import { MotionPlugin } from '@vueuse/motion'
import Unicon from 'vue-unicons'
import customUserIcon from './assets/icons/custom-user'
import customGoogleIcon from './assets/icons/custom-google'
import customArrowLeft from './assets/icons/custom-arrow-left'
import customShoppingBag from './assets/icons/custom-shopping-bag'
import customHomeIcon from './assets/icons/custom-home'
import customLogo from './assets/icons/custom-logo'
import {
  uniEnvelope,
  uniLock,
  uniUnlock,
  uniEyeSlash,
  uniEye,
  uniGoogle,
  uniFacebookF,
  uniSetting,
  uniPhone,
  uniSearch,
  uniAngleLeft,
  uniEllipsisH,
  uniAngleRight,
  uniLocationArrow,
  uniShieldCheck,
  uniShield,
  uniGlobe,
  uniSignOutAlt,
  uniQuestionCircle,
  uniUser,
  uniHeart,
  uniShoppingBag,
  uniShoppingCart,
  uniEstate,
  uniBell,
  uniLayerGroup,
  uniPower,
  uniPalette,
  uniTrash,
  uniListUl,
  uniPlus,
  uniBookMedical,
  uniMessage,
  uniPen,
  uniCameraPlus,
  uniChart,
  uniApps,
  uniArrowLeft,
  uniArrowRight,
  uniAngleRightB,
  uniAngleDown,
  uniCheckCircle,
  uniInfoCircle,
  uniExclamationOctagon,
  uniTimesCircle,
  uniSpinner,
  uniTimes,
  uniWordpress,
  uniImagePlus,
  uniCloudUpload,
  uniWebGrid,
  uniSave
} from 'vue-unicons/dist/icons'

Unicon.add([
  uniEnvelope,
  uniLock,
  uniUnlock,
  uniEyeSlash,
  uniEye,
  uniGoogle,
  uniFacebookF,
  uniSetting,
  uniPhone,
  uniSearch,
  uniAngleLeft,
  uniEllipsisH,
  uniAngleRight,
  uniLocationArrow,
  uniShieldCheck,
  uniShield,
  uniGlobe,
  uniSignOutAlt,
  uniQuestionCircle,
  uniUser,
  uniHeart,
  uniShoppingBag,
  uniShoppingCart,
  uniEstate,
  uniBell,
  uniLayerGroup,
  uniPower,
  uniPalette,
  uniTrash,
  uniListUl,
  uniPlus,
  uniBookMedical,
  uniBookMedical,
  uniMessage,
  uniPen,
  uniCameraPlus,
  uniChart,
  uniApps,
  uniArrowLeft,
  uniArrowRight,
  uniAngleRightB,
  uniAngleDown,
  uniCheckCircle,
  uniInfoCircle,
  uniExclamationOctagon,
  uniTimesCircle,
  uniSpinner,
  uniTimes,
  uniWordpress,
  uniImagePlus,
  uniCloudUpload,
  uniWebGrid,
  uniSave,
  customArrowLeft,
  customGoogleIcon,
  customUserIcon,
  customShoppingBag,
  customHomeIcon,
  customLogo
])

const app = createApp(App)

app.use(MotionPlugin)
app.use(createPinia())
app.use(Unicon)
app.use(router)

app.mount('#app')
