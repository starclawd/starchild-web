import { Link, Route, Routes } from 'react-router-dom'
import { Trans } from '@lingui/react/macro'
import styled from 'styled-components'
import './App.css'
import AboutPage from 'pages/AboutPage'
import { useActiveLocale } from 'hooks/useActiveLocale'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from 'store/theme/reducer'
import { RootState } from 'store'
import { ThemeProvider } from 'styles/ThemeProvider'

const Header = styled.header`
  background-color: ${props => props.theme.navBackground};
  color: ${props => props.theme.navText};
  padding: 16px;
`

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
`

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
`

const NavLink = styled(Link)`
  color: ${props => props.theme.navText};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`

const LanguageButton = styled.button`
  background: transparent;
  border: 1px solid ${props => props.theme.navText};
  color: ${props => props.theme.navText};
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`

const ThemeButton = styled.button`
  background: transparent;
  border: 1px solid ${props => props.theme.navText};
  color: ${props => props.theme.navText};
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`

function AppContent() {
  const activeLocale = useActiveLocale()
  const dispatch = useDispatch()
  const { mode } = useSelector((state: RootState) => state.theme)

  const handleToggleTheme = () => {
    dispatch(toggleTheme())
  }
  
  return (
    <>
      <Header>
        <Nav>
          <NavLinks>
            <NavLink to="/"><Trans>Home</Trans></NavLink>
            <NavLink to="/theme-demo"><Trans>Theme Demo</Trans></NavLink>
            <NavLink to="/todo"><Trans>Todo</Trans></NavLink>
          </NavLinks>
          <div>
            <LanguageButton>
              <Trans>Language</Trans>: {activeLocale}
            </LanguageButton>
            <ThemeButton onClick={handleToggleTheme}>
              <Trans>Theme</Trans>: {mode === 'light' ? '🌞' : '🌙'}
            </ThemeButton>
          </div>
        </Nav>
      </Header>
      
      <MainContent>
        <Routes>
          <Route path="/" element={<AboutPage />} />
        </Routes>
      </MainContent>
    </>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
