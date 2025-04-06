import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    primary: string;
    secondary: string;
    danger: string;
    warning: string;
    success: string;
    textColor: string;
    lightTextColor: string;
    backgroundColor: string;
  }
} 