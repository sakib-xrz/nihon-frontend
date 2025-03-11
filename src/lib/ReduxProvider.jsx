// ReduxProvider.js
"use client";

import { store } from "@/redux/store";
import { LoadingOutlined } from "@ant-design/icons";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

const persistor = persistStore(store);

const ReduxProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="flex items-center justify-center h-screen">
            <LoadingOutlined className="text-4xl" />
          </div>
        }
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
