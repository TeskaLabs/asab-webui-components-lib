import React, { createContext, useContext } from 'react';

export const ConsoleContext = createContext(null);

export const useConsoleContext = () => useContext(ConsoleContext);
