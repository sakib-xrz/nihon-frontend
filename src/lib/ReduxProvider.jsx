// ReduxProvider.js
"use client";

import Loading from "@/components/Loading";
import { store } from "@/redux/store";
import { Provider } from "react-redux";
import { BounceLoader } from "react-spinners";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

const persistor = persistStore(store);

const ReduxProvider = ({ children }) => {
    return (
        <Provider store={store}>
            <PersistGate
                loading={
                    <div
                        style={{
                            width: "100%",
                            height: "80vh",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center", 
                        }}
                    >
                        <BounceLoader color="#FF7CAF" />
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