import { useThemeManager } from 'store/theme/hooks';
import styled from 'styled-components';

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: ${({ theme }) => theme.primary};
    color: white;
  }
`;

const ThemeToggle = () => {
  const [theme, toggleTheme] = useThemeManager();
  
  return (
    <ToggleButton onClick={toggleTheme}>
      {theme === 'light' ? '🌙' : '🌞'}
    </ToggleButton>
  );
};

export default ThemeToggle; 