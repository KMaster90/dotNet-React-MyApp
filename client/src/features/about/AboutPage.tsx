import { Alert, AlertTitle, Button, ButtonGroup, Container, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useState } from 'react';
import agent from '../../app/api/agent';

export default function AboutPage() {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  function getValidationError() {
    agent.TestErrors.getValidationError()
      .then(() => console.log('should not see this!'))
      .catch((errors) => setValidationErrors(errors));
  }

  return (
    <Container>
      <Typography gutterBottom variant="h2">
        Errors for testing purposes
      </Typography>
      <ButtonGroup fullWidth>
        <Button variant="contained" onClick={() => agent.TestErrors.get404Error().catch(console.log)}>
          Test 404 Error
        </Button>
        <Button variant="contained" onClick={() => agent.TestErrors.get400Error().catch(console.log)}>
          Test 400 Error
        </Button>
        <Button variant="contained" onClick={() => agent.TestErrors.get401Error().catch(console.log)}>
          Test 401 Error
        </Button>
        <Button variant="contained" onClick={getValidationError}>
          Test Validation Error
        </Button>
        <Button variant="contained" onClick={() => agent.TestErrors.get500Error().catch(console.log)}>
          Test 500 Error
        </Button>
      </ButtonGroup>
      {validationErrors.length > 0 && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <AlertTitle>Validation Errors</AlertTitle>
          <List>
            {validationErrors.map((error, index) => (
              <ListItem key={error}>
                <ListItemText>{error}</ListItemText>
              </ListItem>
            ))}
          </List>
        </Alert>
      )}
    </Container>
  );
}
