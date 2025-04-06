import { Link, Route, Routes } from 'react-router-dom'
import { Trans } from '@lingui/react/macro'
import styled, { ThemeProvider } from 'styled-components'
import { theme } from 'styles/theme'
import './App.css'
import AboutPage from 'pages/AboutPage'
import { useActiveLocale } from 'hooks/useActiveLocale'

const Header = styled.header`
  background-color: ${props => props.theme.primary};
  color: white;
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
  color: white;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`

const LanguageButton = styled.button`
  background: transparent;
  border: 1px solid white;
  color: white;
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

function App() {
  const activeLocale = useActiveLocale()
  return (
    <ThemeProvider theme={theme}>
      <Header>
        <Nav>
          <NavLinks>
            <NavLink to="/"><Trans>Home</Trans></NavLink>
          </NavLinks>
          <LanguageButton>
            <Trans>Language</Trans>: {activeLocale}
          </LanguageButton>
        </Nav>
      </Header>
      
      <MainContent>
        <Routes>
          <Route path="/" element={<AboutPage />} />
        </Routes>
      </MainContent>
    </ThemeProvider>
  )
}

export default App
