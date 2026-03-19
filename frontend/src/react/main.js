function App() {
  return (
    <React.Fragment>
      <AddCar />
      <UpdateCar />
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById("react-root"));
root.render(<App />);
