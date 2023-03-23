import userReducer from '@app/store/slices/userSlice';
import authReducer from '@app/store/slices/authSlice';
import nightModeReducer from '@app/store/slices/nightModeSlice';
import themeReducer from '@app/store/slices/themeSlice';
import pwaReducer from '@app/store/slices/pwaSlice';
import thingReducer from '@app/store/slices/thingSlice';
import customerReducer from '@app/store/slices/customerSlice';
import variableReducer from '@app/store/slices/variableSlice';

export default {
  user: userReducer,
  auth: authReducer,
  nightMode: nightModeReducer,
  theme: themeReducer,
  pwa: pwaReducer,
  thing: thingReducer,
  customer: customerReducer,
  variable: variableReducer
};
