// generated_app/components/ExampleComponent.js

const ExampleComponent = () => {
  // Access the public environment variables using process.env
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  return (
    <div>
      <h1>Welcome to {appName}</h1>
      <p>The API is located at: {apiUrl}</p>
    </div>
  );
};

export default ExampleComponent;
