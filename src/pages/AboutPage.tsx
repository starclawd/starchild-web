import styled from 'styled-components';
import { Trans } from '@lingui/react/macro';
import { useGetPostByIdQuery } from 'api';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 20px;
  margin-top: 20px;
`;

const AboutPage = () => {
  const { data: post, isLoading } = useGetPostByIdQuery(1);

  return (
    <Container>
      <Title><Trans>About</Trans></Title>
      <p><Trans>This is a sample project built with React, TypeScript, Redux Toolkit, React Router, Lingui and Styled Components.</Trans></p>
      
      <Card>
        <h2><Trans>Features</Trans></h2>
        <ul>
          <li><Trans>React with TypeScript</Trans></li>
          <li><Trans>State Management (Redux Toolkit)</Trans></li>
          <li><Trans>API Requests (RTK Query)</Trans></li>
          <li><Trans>Routing (React Router)</Trans></li>
          <li><Trans>Internationalization (Lingui)</Trans></li>
          <li><Trans>Styling Solutions (Styled Components + SCSS)</Trans></li>
        </ul>
      </Card>
      
      {isLoading ? (
        <p><Trans>Loading...</Trans></p>
      ) : (
        <Card>
          <h2><Trans>Sample API Data</Trans></h2>
          {post && (
            <>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </>
          )}
        </Card>
      )}
    </Container>
  );
};

export default AboutPage; 