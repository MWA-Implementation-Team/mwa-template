const eventSource = new EventSource('http://localhost:3001/watch');
eventSource.onmessage = () => window.location.reload();
