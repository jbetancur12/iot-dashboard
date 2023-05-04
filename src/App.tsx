import React, { useEffect, useMemo, useState } from 'react';
import { ConfigProvider } from 'antd';
import deDe from 'antd/lib/locale/de_DE';
import enUS from 'antd/lib/locale/en_US';
import esES from 'antd/lib/locale/es_ES';
import ptBR from 'antd/lib/locale/pt_BR';
import { ThemeProvider } from 'styled-components';
import lightTheme from './styles/themes/light/lightTheme';
import GlobalStyle from './styles/GlobalStyle';
import 'typeface-montserrat';
import { darkTheme } from '@app/styles/themes/dark/darkTheme';
import { AppRouter } from './components/router/AppRouter';
import { ThemeSwitcher } from '@app/components/common/ThemeSwitcher';
import { useLanguage } from './hooks/useLanguage';
import { useAppSelector } from './hooks/reduxHooks';
import { useAutoNightMode } from './hooks/useAutoNightMode';
import { usePWA } from './hooks/usePWA';

const App: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.theme);

  const currentTheme = useMemo(() => (theme === 'dark' ? darkTheme : lightTheme), [theme]);

  const { language } = useLanguage();

  usePWA();

  useAutoNightMode();



  let lang = esES;

  switch (language) {
    case 'en':
      lang = enUS;
      break;
    case 'de':
      lang = deDe;
      break;
    default:
      break;
  }


  

  return (
    <>
      <meta name="theme-color" content={currentTheme.colors.main.primary} />
      <ThemeProvider theme={currentTheme}>
        <GlobalStyle />
        <ConfigProvider locale={lang}>
          <ThemeSwitcher theme={theme}>
         
            <AppRouter />
       
          </ThemeSwitcher>
        </ConfigProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
