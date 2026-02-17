'use client'
import { createContext, useEffect, useMemo, useState } from "react";
import { CreateMLCEngine, InitProgressReport, MLCEngine } from "@mlc-ai/web-llm";

export const WebLLMContext = createContext<ContextVal | null>(null);

export type ContextVal = {
  engine: MLCEngine | null,
  loading: boolean
}

export const  WebLLMProvider = ({ children}) => {
  const [engine, setEngine] = useState<MLCEngine | null>(null);
  const [loading, setLoading] = useState(true);

const contextValue : ContextVal = useMemo(() => ({
    engine,
    loading,
  }), [engine, loading]); // Dependencies array


// Using CreateMLCEngine


// Direct instantiation
//const engineInstance = new MLCEngine({ initProgressCallback });
//await engineInstance.reload("Llama-3.1-8B-Instruct");

  useEffect(() => {
    const initializeEngine = async () => {
      // Initialize the engine (e.g., load a specific model like 'Llama-3')
      // Code for loading the model goes here (refer to WebLLM documentation)
      // const chat = new ChatModule();
      // await chat.reload("Llama-3"); 
      //TODO: Allaw users to select
      const _engine = await CreateMLCEngine('gemma-2-2b-it-q4f16_1-MLC', { initProgressCallback });
      setEngine(_engine)
      setLoading(false);
    };
    initializeEngine();
  }, []);

// Initialize with a progress callback
 const initProgressCallback = (progress) => {
     console.log("Model loading progress:", progress);
 };

  return (
    <WebLLMContext.Provider value={contextValue}>
      {children}
    </WebLLMContext.Provider>
  );
};