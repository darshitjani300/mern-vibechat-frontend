import { Provider } from "react-redux";
import RouterPage from "./routes/RouterPage";
import { Toaster } from "react-hot-toast";
import { store } from "./redux/store/store";

const App = () => {
  return (
    <Provider store={store}>
      <Toaster
        toastOptions={{
          duration: 3000,
          position: "top-right",
        }}
      />
      <RouterPage />
    </Provider>
  );
};

export default App;
