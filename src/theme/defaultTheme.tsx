// import createBreakpoints from '@material-ui/core/styles/createBreakpoints';
// import { Fonts } from '../../../portal/src/@jumbo/constants/ThemeOptions';

import { Direction } from "@/@core/types";

// const breakpoints = createBreakpoints({
//   values: {
//     xs: 0,
//     sm: 600,
//     md: 960,
//     lg: 1280,
//     xl: 1920,
//   },
// });

const defaultTheme = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  spacing: 4,
  direction: 'ltr' as Direction,
  palette: {
    type: 'light',
    common: {
      black: '#000',
      white: '#fff',
      dark: '#020202',
    },
    primary: { main: '#D80E51' },
    secondary: { main: '#0EDB8A' },
    sidebar: {
      bgColor: '#f5f5f5', // Alternative to #FFFFFF
      textColor: 'rgba(0, 0, 0, 0.6)',
      textDarkColor: 'rgba(0, 0, 0, 0.87)',
      textActiveColor: '#6200EE', // You can choose one of the logo colors here
      // navHoverBgColor: 'rgb(229, 229, 229)',
      // navActiveBgColor: 'rgb(239, 229, 253)',
      borderColor: 'rgba(33, 33, 33, 0.08)',
    },
    horizontalNav: {
      navigationColor: 'rgba(255, 255, 255, 0.74)',
      navigationActiveColor: 'rgba(255, 255, 255, 1)',
      textColor: 'rgba(0, 0, 0, 0.6)',
      textDarkColor: 'rgba(0, 0, 0, 0.87)',
      textActiveColor: '#6200EE', // You can choose one of the logo colors here
      // menuHoverBgColor: 'rgb(229, 229, 229)',
      // menuActiveBgColor: 'rgb(239, 229, 253)',
    },
    background: {
      paper: '#F5F5F5',
      default: '#f4f4f7',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
      hint: 'rgba(0, 0, 0, 0.3)',
      white: '#0edb8a', // Use logo_color2
    },
    btn: {
      hover: 'rgba(0, 0, 0, 0.08)',
    },
    lightBtn: {
      bgColor: '#f5f5f5',
      textColor: 'rgba(0, 0, 0, 0.38)',
    },
    borderColor: {
      main: 'rgba(0, 0, 0, 0.06)',
      dark: 'rgba(0, 0, 0, 0.12)',
    },
    popupColor: {
      main: '#fff',
    },
    grey: {
      50: '#f9fafb'
    }
  },
  status: {
    danger: 'orange',
  },
  typography: {
    fontFamily: 'Nunito Sans, sans-serif',
    fontWeightExtraLight: 200,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightBold: 'bold',
    fontWeightExtraBold: 800,
  },
  overrides: {
    MuiTypography: {
      h1: {
        fontSize: 20,
        fontWeight: 'bold',
        // [breakpoints.up('md')]: {
        //   fontSize: 22,
        // },
      },
      h2: {
        fontSize: 18,
        fontWeight: 'bold',
        // [breakpoints.up('md')]: {
        //   fontSize: 20,
        // },
      },
      h3: {
        fontSize: 16,
        fontWeight: 'bold',
        // [breakpoints.up('md')]: {
        //   fontSize: 18,
        // },
      },
      h4: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      h5: {
        fontSize: 14,
        fontWeight: 400,
      },
      h6: {
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 0.5,
      },
      subtitle1: {
        fontSize: 14,
        fontWeight: 400,
        letterSpacing: 0.15,
      },
      subtitle2: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 0.1,
      },
      body1: {
        fontSize: 14,
        fontWeight: 400,
        letterSpacing: 0.5,
      },
      body2: {
        fontSize: 12,
        fontWeight: 400,
        letterSpacing: 0.25,
      },
    },
    MuiCheckbox: {
      root: { fontSize: '12px' },
    },
    MuiInputLabel: {
      root: {
        fontSize: '14px',
      },
    },
    MuiInputBase: {
      root: {
        fontSize: '14px',
      },
    },
    MuiInput: {
      root: {
        fontSize: '14px',
      },
    },
    MuiMenuItem: {
      root: {
        fontSize: '14px',
      },
    },
    MuiTextField: {
      root: {
        fontSize: '14px',
      },
    },
    MuiSelect: {
      root: {
        fontSize: '14px',
      },
      selectMenu: {
        fontSize: '12px',
      },
    },

    MuiTab: {
      textColorPrimary: {
        color: 'rgba(0, 0, 0, 0.87)',
      },
    },
    MuiPopover: {
      paper: {
        backgroundColor: '#FFFFFF',
        fontSize: '12px',
      },
    },
    // MuiDialog: {
    //   paper: {
    //     backgroundColor: '#FFFFFF',
    //     fontSize: '12px',
    //   },
    // },
    MuiButton: {
      root: {
        fontWeight: 'bold',
        letterSpacing: 1.25,
        fontSize: 12,
        textTransform: 'none !important',
        boxShadow: 'none !important',
      },
    },
    MuiToggleButton: {
      root: {
        borderRadius: 4,
      },
    },
    MuiCardLg: {
      root: {
        borderRadius: 10,
      },
    },
    MuiCard: {
      root: {
        borderRadius: 4,
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2), 0px 2px 1px rgba(0, 0, 0, 0.12), 0px 1px 1px rgba(0, 0, 0, 0.14)',
      },
    },
    // MuiPopover: {
    //   paper: {
    //     backgroundColor: '#F5F5F5',
    //   },
    // },
    MuiDialog: {
      paper: {
        backgroundColor: '#F5F5F5',
        fontSize: '12px',
      },
    },
    MuiTableCell: {
      root: {
        fontSize: 12,
      },
    },
  },
};

export default defaultTheme;
