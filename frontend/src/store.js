import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appSlice";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';


const persistConfig = {
    key: 'app',
    storage,
    version: 1,
}


const persistedReducer = persistReducer(persistConfig, appReducer);


export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
        serializableCheck: false,
    }),
});


export const persistor = persistStore(store);