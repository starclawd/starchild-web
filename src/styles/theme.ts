import { ThemeMode } from 'store/theme/reducer';

// 定义主题接口，包含所有颜色变量
export interface Theme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  border: string;
  card: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  // 表单相关颜色
  inputBackground: string;
  inputText: string;
  inputBorder: string;
  // 按钮相关颜色
  buttonPrimary: string;
  buttonPrimaryText: string;
  buttonSecondary: string;
  buttonSecondaryText: string;
  // 标题颜色
  heading: string;
  // 导航栏颜色
  navBackground: string;
  navText: string;
}

// 亮色主题
export const lightTheme: Theme = {
  primary: '#1890ff',
  secondary: '#52c41a',
  background: '#f5f5f5',
  text: '#333333',
  border: '#e8e8e8',
  card: '#ffffff',
  error: '#f5222d',
  success: '#52c41a',
  warning: '#faad14',
  info: '#1890ff',
  // 表单相关颜色
  inputBackground: '#ffffff',
  inputText: '#333333',
  inputBorder: '#d9d9d9',
  // 按钮相关颜色
  buttonPrimary: '#1890ff',
  buttonPrimaryText: '#ffffff',
  buttonSecondary: '#f5f5f5',
  buttonSecondaryText: '#333333',
  // 标题颜色
  heading: '#262626',
  // 导航栏颜色
  navBackground: '#001529',
  navText: '#ffffff',
};

// 暗色主题
export const darkTheme: Theme = {
  primary: '#177ddc',
  secondary: '#49aa19',
  background: '#141414',
  text: '#f5f5f5',
  border: '#303030',
  card: '#1f1f1f',
  error: '#a61d24',
  success: '#49aa19',
  warning: '#d89614',
  info: '#177ddc',
  // 表单相关颜色
  inputBackground: '#141414',
  inputText: '#f5f5f5',
  inputBorder: '#434343',
  // 按钮相关颜色
  buttonPrimary: '#177ddc',
  buttonPrimaryText: '#ffffff',
  buttonSecondary: '#141414',
  buttonSecondaryText: '#f5f5f5',
  // 标题颜色
  heading: '#f5f5f5',
  // 导航栏颜色
  navBackground: '#1f1f1f',
  navText: '#f5f5f5',
};

// 根据主题模式获取对应的主题配置
export const getTheme = (mode: ThemeMode): Theme => {
  return mode === 'light' ? lightTheme : darkTheme;
}; 