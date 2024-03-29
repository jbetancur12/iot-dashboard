import userReducer from '@app/store/slices/userSlice'
import authReducer from '@app/store/slices/authSlice'
import nightModeReducer from '@app/store/slices/nightModeSlice'
import themeReducer from '@app/store/slices/themeSlice'
import pwaReducer from '@app/store/slices/pwaSlice'
import thingReducer from '@app/store/slices/thingSlice'
import customerReducer from '@app/store/slices/customerSlice'
import templateReducer from '@app/store/slices/templateSlice'
import variableReducer from '@app/store/slices/variableSlice'
import mqttSlice from './mqttSlice'

export default {
  user: userReducer,
  auth: authReducer,
  nightMode: nightModeReducer,
  theme: themeReducer,
  pwa: pwaReducer,
  thing: thingReducer,
  customer: customerReducer,
  template: templateReducer,
  variable: variableReducer,
  mqtt: mqttSlice
}
